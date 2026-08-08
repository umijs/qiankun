import { useMessages } from '../i18n';

interface TrigramProps {
  sandbox: boolean;
  styles: boolean;
  mounted: boolean;
}

/**
 * The qian trigram (☰) as a live status display: one bar per isolation dimension.
 * A solid (yang) bar means the dimension is active; a broken (yin) bar means off or
 * pending. A mounted, fully isolated app completes the trigram.
 */
export default function Trigram({ sandbox, styles, mounted }: TrigramProps) {
  const m = useMessages();
  const bars = [
    { on: sandbox, label: m.trigramSandbox },
    { on: styles, label: m.trigramStyles },
    { on: mounted, label: m.trigramMounted },
  ];
  const live = bars.every((bar) => bar.on);

  return (
    <div className="flex items-center gap-3" title={bars.map((b) => `${b.label}: ${b.on ? 'on' : 'off'}`).join(' · ')}>
      <div className="flex flex-col gap-[3px]" aria-hidden>
        {bars.map((bar) =>
          bar.on ? (
            <span key={bar.label} className="h-[3px] w-7 rounded-full bg-success" />
          ) : (
            <span key={bar.label} className="flex w-7 justify-between">
              <span className="h-[3px] w-3 rounded-full bg-hairline" />
              <span className="h-[3px] w-3 rounded-full bg-hairline" />
            </span>
          ),
        )}
      </div>
      <span className={`font-mono text-[11px] ${live ? 'text-success' : 'text-ink-soft'}`}>
        {live ? `${m.isolated} · ${m.live}` : `${bars.filter((b) => b.on).length}/3`}
      </span>
    </div>
  );
}
