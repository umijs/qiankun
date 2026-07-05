import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import type { MicroAppMeta } from '../apps';
import Trigram from './Trigram';

interface StageProps {
  app: MicroAppMeta | undefined;
  loading: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
}

interface ContainerInfo {
  name?: string;
  version?: string;
  sandbox: boolean;
  hasContent: boolean;
}

/** Reads the sandbox facts straight off the live container qiankun decorates. */
function useContainerInfo(containerRef: RefObject<HTMLDivElement | null>): ContainerInfo {
  const [info, setInfo] = useState<ContainerInfo>({ sandbox: false, hasContent: false });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const read = () => {
      const next: ContainerInfo = {
        name: el.dataset.name,
        version: el.dataset.version,
        sandbox: !!el.dataset.sandboxCfg && el.dataset.sandboxCfg !== 'false',
        hasContent: el.childElementCount > 0,
      };
      setInfo((prev) =>
        prev.name === next.name &&
        prev.version === next.version &&
        prev.sandbox === next.sandbox &&
        prev.hasContent === next.hasContent
          ? prev
          : next,
      );
    };

    read();
    const observer = new MutationObserver(read);
    observer.observe(el, { attributes: true, childList: true });
    return () => observer.disconnect();
  }, [containerRef]);

  return info;
}

/**
 * The sandbox stage: the one place a micro app is allowed to render, framed so the
 * boundary is visible. The container div must stay mounted forever — qiankun holds a
 * reference to it from registration time.
 */
export default function Stage({ app, loading, containerRef }: StageProps) {
  const info = useContainerInfo(containerRef);
  const mounted = info.hasContent && !loading && info.name === app?.name;

  return (
    <section hidden={!app} aria-label="micro app stage">
      <header className="mb-3 flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-[-0.01em] text-ink">{app?.label}</h1>
          <p className="mt-0.5 font-mono text-[11px] text-ink-soft">
            {app?.stack} · {app?.loadingPath} · entry {app?.entry}
          </p>
        </div>
        <Trigram sandbox={info.sandbox && mounted} styles={mounted} mounted={mounted} />
      </header>

      <div className="relative rounded-[10px] border border-hairline bg-surface shadow-stage">
        {/* viewfinder corner ticks: the visible sandbox boundary */}
        <CornerTicks />

        <div className="flex items-center justify-between border-b border-hairline px-4 py-2">
          <span className="font-mono text-[11px] text-ink-soft">
            {info.name ? `data-name="${info.name}" · qiankun v${info.version ?? '…'}` : 'container idle'}
          </span>
          <span
            className={`flex items-center gap-1.5 font-mono text-[11px] ${mounted ? 'text-success' : 'text-ink-soft'}`}
          >
            <span className={`size-1.5 rounded-full ${mounted ? 'bg-success' : loading ? 'bg-primary' : 'bg-hairline'}`} />
            {mounted ? 'mounted' : loading ? 'mounting' : 'idle'}
          </span>
        </div>

        <div className="relative min-h-[70vh] overflow-auto">
          <div ref={containerRef} id="subapp-stage" className="min-h-[70vh]" />
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface/80">
              <span className="animate-pulse font-mono text-xs text-ink-soft">crossing the sandbox boundary…</span>
            </div>
          )}
        </div>
      </div>
    </section>
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
