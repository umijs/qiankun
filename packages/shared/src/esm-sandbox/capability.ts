import { QiankunError } from '../reporter/QiankunError';

type ProbeResult = { code: 'esm-unsupported' } | { code: 'esm-capability-check-failed'; cause: unknown } | undefined;

const checks = new WeakMap<Document, Promise<ProbeResult>>();

/** Probe in a separate document: a failed check must not consume the host's only import map. */
export function assertEsmSupport(targetDocument: Document = document): Promise<void> {
  let check = checks.get(targetDocument);
  if (!check) {
    check = probeEsmSupport(targetDocument);
    checks.set(targetDocument, check);
  }
  // single-spa annotates errors with app context. Share the probe, not an Error across apps.
  return check.then((result) => {
    if (result?.code === 'esm-unsupported') {
      throw new QiankunError(
        'ESM sandbox requires native support for dynamically injected multiple import maps. Use a Classic build or a supported browser',
        result.code,
      );
    }
    if (result) {
      throw new QiankunError('Unable to complete the ESM sandbox capability check', result.code, {
        cause: result.cause,
      });
    }
  });
}

function probeEsmSupport(targetDocument: Document): Promise<ProbeResult> {
  return new Promise((resolve) => {
    const frame = targetDocument.createElement('iframe');
    frame.hidden = true;
    frame.setAttribute('aria-hidden', 'true');
    frame.dataset.qiankun = 'esm-capability';
    const urls: string[] = [];
    const scripts: HTMLScriptElement[] = [];
    let probeDocument: Document | null = null;
    let settled = false;
    const finish = (result?: ProbeResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      probeDocument?.removeEventListener('securitypolicyviolation', onPolicyViolation);
      scripts.forEach((script) => {
        script.onload = script.onerror = null;
      });
      frame.onerror = null;
      frame.remove();
      urls.forEach((url) => URL.revokeObjectURL(url));
      resolve(result);
    };
    const failed = (cause: unknown) => finish({ code: 'esm-capability-check-failed', cause });
    const unsupported = () => finish({ code: 'esm-unsupported' });
    const onPolicyViolation = (event: SecurityPolicyViolationEvent) => {
      if (event.disposition === 'enforce' && event.effectiveDirective.startsWith('script-src')) {
        failed(new Error(`Content Security Policy blocked the ESM capability check: ${event.effectiveDirective}`));
      }
    };
    const timer = setTimeout(() => failed(new Error('ESM capability check timed out after 5000 ms')), 5000);
    const createUrl = (code: string) => {
      const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
      urls.push(url);
      return url;
    };

    try {
      frame.onerror = () => failed(new Error('Unable to load the ESM capability check iframe'));
      // about:blank inherits the host origin and CSP. No inline executable script or postMessage is needed.
      targetDocument.documentElement.appendChild(frame);
      const checkDocument = frame.contentDocument;
      probeDocument = checkDocument;
      const probeWindow = checkDocument?.defaultView;
      if (!checkDocument || !probeWindow) {
        failed(new Error('The ESM capability check iframe is inaccessible'));
        return;
      }
      checkDocument.addEventListener('securitypolicyviolation', onPolicyViolation);
      const probeHead = checkDocument.head;
      const dependencyUrl = createUrl('export {};');
      const run = (step: number) => {
        try {
          const specifier = `qiankun-esm-capability-${step}`;
          const map = checkDocument.createElement('script');
          map.type = 'importmap';
          map.textContent = JSON.stringify({ imports: { [specifier]: dependencyUrl } });
          probeHead.appendChild(map);
          const script = checkDocument.createElement('script');
          scripts.push(script);
          script.type = 'module';
          script.src = createUrl(
            `import ${JSON.stringify(specifier)}; globalThis.__qiankunEsmCapabilityStep__ = ${step};`,
          );
          script.onerror = unsupported;
          script.onload = () => {
            if (settled) return;
            // A module's load event alone does not prove that its graph evaluated successfully.
            if (Reflect.get(probeWindow, '__qiankunEsmCapabilityStep__') !== step) {
              unsupported();
              return;
            }
            if (step === 1) run(2);
            else finish();
          };
          probeHead.appendChild(script);
        } catch (error) {
          failed(error);
        }
      };
      run(1);
    } catch (error) {
      failed(error);
    }
  });
}
