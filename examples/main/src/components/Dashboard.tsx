import { useCallback, useEffect, useState } from 'react';
import { microApps } from '../apps';
import { useLocale, useMessages } from '../i18n';
import { navigate } from '../router';

export default function Dashboard() {
  const locale = useLocale();
  const m = useMessages();

  return (
    <div className="relative mx-auto max-w-4xl">
      {/* the sleeve watermark */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-6 right-0 font-ornament text-[120px] leading-none font-semibold text-ink/4 select-none"
      >
        乾坤
      </span>

      <header className="pt-6 pb-10">
        <p className="mb-3 font-mono text-[11px] tracking-[0.18em] text-primary uppercase">{m.eyebrow}</p>
        <h1 className="max-w-xl font-display text-[40px] leading-[1.12] font-semibold tracking-[-0.02em] text-ink">
          {m.heroTitle}
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft">
          {m.heroLede}
        </p>
      </header>

      <section aria-label="registered micro apps" className="rounded-[10px] border border-hairline bg-surface">
        <div className="flex items-center justify-between border-b border-hairline px-5 py-3">
          <h2 className="text-sm font-semibold text-ink">{m.appRegistry}</h2>
          <span className="font-mono text-[11px] text-ink-soft">
            {'<MicroApp> · sandbox: on · style isolation: on'}
          </span>
        </div>
        <ul>
          {microApps.map((app) => (
            <li key={app.name} className="border-b border-hairline last:border-b-0">
              <button
                type="button"
                onClick={() => navigate(app.path)}
                className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-paper"
              >
                <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: app.accent }} />
                <span className="w-28 shrink-0">
                  <span className="block text-sm font-medium text-ink">{app.label}</span>
                  <span className="block font-mono text-[10px] text-ink-soft">{app.name}</span>
                </span>
                <span className="flex-1 text-[13px] text-ink-soft">{app.stack[locale]}</span>
                <span className="hidden font-mono text-[11px] text-ink-soft sm:block">{app.entry}</span>
                <span
                  className={`w-24 shrink-0 rounded-full border px-2 py-0.5 text-center font-mono text-[10px] ${
                    app.loadingPath === 'esm sandbox'
                      ? 'border-primary/25 text-primary'
                      : 'border-hairline text-ink-soft'
                  }`}
                >
                  {app.loadingPath}
                </span>
                <span className="text-ink-soft transition-transform duration-150 group-hover:translate-x-0.5">→</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <HostRealmCheck />
    </div>
  );
}

/**
 * The host-side half of the sub apps' window probe: sub apps write
 * window.__SANDBOX_PROBE__ from inside their sandbox; the host realm must never see it.
 */
function HostRealmCheck() {
  const m = useMessages();
  const read = useCallback(() => String((window as Window & { __SANDBOX_PROBE__?: unknown }).__SANDBOX_PROBE__), []);
  const [value, setValue] = useState(read);

  useEffect(() => {
    const timer = window.setInterval(() => setValue(read()), 1500);
    return () => window.clearInterval(timer);
  }, [read]);

  const clean = value === 'undefined';

  return (
    <section aria-label="host realm check" className="mt-6 rounded-[10px] border border-hairline bg-surface px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">{m.hostRealmCheck}</h2>
          <p className="mt-1 max-w-lg text-[13px] leading-relaxed text-ink-soft">
            {m.hostRealmBody.split('{code}')[0]}
            <code className="font-mono text-xs">window.__SANDBOX_PROBE__</code>
            {m.hostRealmBody.split('{code}')[1]}
          </p>
        </div>
        <div className="text-right">
          <code className={`font-mono text-sm ${clean ? 'text-success' : 'text-danger'}`}>{value}</code>
          <p className="mt-1 font-mono text-[10px] text-ink-soft">{clean ? m.membraneHolds : m.sandboxBreached}</p>
        </div>
      </div>
    </section>
  );
}
