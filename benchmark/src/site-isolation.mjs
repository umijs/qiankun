import { runBrowserSample } from './browser.mjs';

function isIframeTargetAtOrigin(targetInfo, origin) {
  if (targetInfo.type !== 'iframe') return false;
  try {
    return new URL(targetInfo.url).origin === origin;
  } catch {
    return false;
  }
}

async function observeTargetsDuring(session, sample) {
  const targets = new Map();
  const recordTarget = ({ targetInfo }) => targets.set(targetInfo.targetId, targetInfo);
  session.on('Target.targetCreated', recordTarget);
  session.on('Target.targetInfoChanged', recordTarget);
  try {
    await sample();
    return [...targets.values()];
  } finally {
    session.off('Target.targetCreated', recordTarget);
    session.off('Target.targetInfoChanged', recordTarget);
  }
}

export async function inspectCrossSiteIsolation({
  browser,
  fixtureOrigins,
  hostOrigin,
  nativeVariant,
  timeoutMs,
  wujieVariant,
}) {
  const session = await browser.newBrowserCDPSession();
  const runVariant = (variant) => runBrowserSample({ browser, fixtureOrigins, hostOrigin, timeoutMs, variant });
  try {
    await session.send('Target.setDiscoverTargets', { discover: true });
    const nativeTargets = await observeTargetsDuring(session, () => runVariant(nativeVariant));
    const crossSiteOrigin = fixtureOrigins['cross-site'];
    const nativeOopifTarget = nativeTargets.find((target) => isIframeTargetAtOrigin(target, crossSiteOrigin));
    if (!nativeOopifTarget) {
      throw new Error(`cross-site native iframe did not create an OOPIF target at ${crossSiteOrigin}`);
    }

    const wujieTargets = await observeTargetsDuring(session, () => runVariant(wujieVariant));
    const wujieAppSiteTarget = wujieTargets.find((target) => isIframeTargetAtOrigin(target, crossSiteOrigin));
    return {
      crossSiteEntryOrigin: crossSiteOrigin,
      nativeIframe: {
        oopif: true,
        targetUrl: nativeOopifTarget.url,
      },
      wujie: {
        appSiteOopif: Boolean(wujieAppSiteTarget),
        targetUrl: wujieAppSiteTarget?.url ?? null,
      },
    };
  } finally {
    await session.send('Target.setDiscoverTargets', { discover: false }).catch(() => {});
    await session.detach().catch(() => {});
  }
}
