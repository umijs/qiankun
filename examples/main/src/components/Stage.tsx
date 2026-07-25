import { MicroApp } from '@qiankunjs/react';
import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { MicroAppMeta } from '../apps';
import Trigram from './Trigram';

interface StageProps {
  app: MicroAppMeta;
}

interface ContainerInfo {
  name?: string;
  version?: string;
  sandbox: boolean;
  styleIsolation: boolean;
}

const idleContainer: ContainerInfo = { sandbox: false, styleIsolation: false };

/** `data-sandbox-cfg` is qiankun's own debug summary of the sandbox it built for this app. */
function readSandboxCfg(raw: string | undefined): Pick<ContainerInfo, 'sandbox' | 'styleIsolation'> {
  if (!raw) return idleContainer;

  try {
    const cfg: unknown = JSON.parse(raw);
    if (typeof cfg === 'object' && cfg !== null) {
      const { enabled, styleIsolation } = cfg as { enabled?: boolean; styleIsolation?: boolean };
      return { sandbox: enabled !== false, styleIsolation: styleIsolation === true };
    }

    return { sandbox: cfg === true, styleIsolation: false };
  } catch {
    return idleContainer;
  }
}

/**
 * Reads the sandbox facts straight off the live container. `<MicroApp />` creates that element
 * and hands it to qiankun, so we look it up by the class the binding puts on it rather than
 * owning a ref to it ourselves.
 */
function useContainerInfo(frameRef: RefObject<HTMLElement | null>, appName: string): ContainerInfo {
  const [info, setInfo] = useState<ContainerInfo>(idleContainer);

  useEffect(() => {
    const container = frameRef.current?.querySelector<HTMLElement>('.qiankun-micro-app-container');
    if (!container) return;

    const read = () => {
      const next: ContainerInfo = {
        name: container.dataset.name,
        version: container.dataset.version,
        ...readSandboxCfg(container.dataset.sandboxCfg),
      };
      setInfo((prev) =>
        prev.name === next.name &&
        prev.version === next.version &&
        prev.sandbox === next.sandbox &&
        prev.styleIsolation === next.styleIsolation
          ? prev
          : next,
      );
    };

    // whatever is on the container right now still belongs to the app we are leaving
    setInfo(idleContainer);
    read();
    // attributes only: the micro app's own DOM churn is none of our business
    const observer = new MutationObserver(read);
    observer.observe(container, { attributes: true, attributeFilter: ['data-name', 'data-version', 'data-sandbox-cfg'] });
    return () => observer.disconnect();
  }, [frameRef, appName]);

  return info;
}

/**
 * The sandbox stage: the one place a micro app is allowed to render, framed so the boundary is
 * visible. Mounting, unmounting, loading and error capture all belong to `<MicroApp />` — the
 * shell only says which app the route wants.
 */
export default function Stage({ app }: StageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const info = useContainerInfo(frameRef, app.name);
  const status = failed ? 'failed' : loading ? 'mounting' : 'mounted';
  const mounted = status === 'mounted';

  return (
    <section className="stage-lift" aria-label="micro app stage">
      <header className="mb-3 flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-[-0.01em] text-ink">{app.label}</h1>
          <p className="mt-0.5 font-mono text-[11px] text-ink-soft">
            {app.stack} · {app.loadingPath} · entry {app.entry}
          </p>
        </div>
        <Trigram sandbox={info.sandbox && mounted} styles={info.styleIsolation && mounted} mounted={mounted} />
      </header>

      <div ref={frameRef} className="relative rounded-[10px] border border-hairline bg-surface shadow-stage">
        {/* viewfinder corner ticks: the visible sandbox boundary */}
        <CornerTicks />

        <div className="flex items-center justify-between border-b border-hairline px-4 py-2">
          <span className="font-mono text-[11px] text-ink-soft">
            {info.name ? `data-name="${info.name}" · qiankun v${info.version ?? '…'}` : 'container idle'}
          </span>
          <span
            className={`flex items-center gap-1.5 font-mono text-[11px] ${
              mounted ? 'text-success' : failed ? 'text-cinnabar' : 'text-ink-soft'
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${mounted ? 'bg-success' : failed ? 'bg-cinnabar' : 'bg-primary'}`}
            />
            {status}
          </span>
        </div>

        <MicroApp
          name={app.name}
          entry={app.entry}
          settings={{ sandbox: { styleIsolation: true } }}
          loader={(mounting) => <StageVeil loading={mounting} onLoadingChange={setLoading} />}
          errorBoundary={(error) => <StageFailure error={error} onFailedChange={setFailed} />}
          wrapperClassName="min-h-[70vh] overflow-auto"
          className="min-h-[70vh]"
        />
      </div>
    </section>
  );
}

/**
 * The loader slot is the binding's own view of "is this app up yet", so the stage header reads it
 * from here instead of guessing from the DOM. Reporting it up in an effect keeps the state change
 * out of `<MicroApp />`'s render.
 */
function StageVeil({ loading, onLoadingChange }: { loading: boolean; onLoadingChange: (loading: boolean) => void }) {
  useEffect(() => onLoadingChange(loading), [loading, onLoadingChange]);

  if (!loading) return null;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-surface/80">
      <span className="animate-pulse font-mono text-xs text-ink-soft">crossing the sandbox boundary…</span>
    </div>
  );
}

function StageFailure({ error, onFailedChange }: { error: Error; onFailedChange: (failed: boolean) => void }) {
  // same shape as the veil: report the binding's failure up after render, so the stage header stops
  // claiming the app is mounted
  useEffect(() => {
    onFailedChange(true);
    return () => onFailedChange(false);
  }, [onFailedChange]);

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-surface/95 px-8">
      <div className="max-w-lg">
        <p className="font-mono text-[10px] tracking-[0.18em] text-cinnabar uppercase">mount failed</p>
        <p className="mt-2 font-mono text-[12px] leading-relaxed break-words text-ink-soft">{error.message}</p>
      </div>
    </div>
  );
}

function CornerTicks() {
  const base = 'pointer-events-none absolute size-3 border-primary';
  return (
    <>
      <span className={`${base} -top-px -left-px rounded-tl-[10px] border-t-2 border-l-2`} />
      <span className={`${base} -top-px -right-px rounded-tr-[10px] border-t-2 border-r-2`} />
      <span className={`${base} -bottom-px -left-px rounded-bl-[10px] border-b-2 border-l-2`} />
      <span className={`${base} -right-px -bottom-px rounded-br-[10px] border-r-2 border-b-2`} />
    </>
  );
}
