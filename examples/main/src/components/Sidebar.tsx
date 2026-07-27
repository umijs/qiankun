import { microApps, siblingShell } from '../apps';
import { useLocale, useMessages } from '../i18n';
import { navigate } from '../router';
import Seal from './Seal';

/** the short form of each loading path, for the tag on the right of a nav item */
const loadingTag = { 'esm sandbox': 'esm', classic: 'classic', 'never loads': '404' } as const;

interface SidebarProps {
  activePath: string;
}

export default function Sidebar({ activePath }: SidebarProps) {
  const locale = useLocale();
  const m = useMessages();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-hairline bg-surface">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="flex items-center gap-3 border-b border-hairline px-5 py-5 text-left"
      >
        <Seal size={36} />
        <span className="leading-tight">
          <span className="block font-display text-lg font-semibold tracking-[-0.01em] text-ink">qiankun</span>
          <span className="block font-mono text-[11px] text-ink-soft">{m.shellSubtitle}</span>
        </span>
      </button>

      <nav className="flex-1 px-3 py-4">
        <NavItem
          label={m.dashboard}
          sub={m.dashboardSub}
          active={activePath === '/'}
          onClick={() => navigate('/')}
        />

        <p className="mt-6 mb-2 px-2 font-mono text-[10px] tracking-[0.18em] text-ink-soft uppercase">{m.microApps}</p>
        {microApps.map((app) => (
          <NavItem
            key={app.name}
            label={app.label}
            sub={app.stack[locale]}
            dot={app.accent}
            mono={loadingTag[app.loadingPath]}
            active={activePath.startsWith(app.path)}
            onClick={() => navigate(app.path)}
          />
        ))}
      </nav>

      <footer className="flex flex-col gap-2 border-t border-hairline px-5 py-4">
        <a
          href={siblingShell.href}
          className="font-mono text-[11px] text-ink-soft transition-colors duration-150 hover:text-primary"
        >
          {siblingShell.label} · {siblingShell.sub} ↗
        </a>
        <a
          href="https://github.com/umijs/qiankun"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[11px] text-ink-soft transition-colors duration-150 hover:text-primary"
        >
          umijs/qiankun ↗
        </a>
      </footer>
    </aside>
  );
}

interface NavItemProps {
  label: string;
  sub: string;
  active: boolean;
  onClick: () => void;
  dot?: string;
  mono?: string;
}

function NavItem({ label, sub, active, onClick, dot, mono }: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`relative flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors duration-150 ${
        active ? 'bg-primary/8 text-primary' : 'text-ink hover:bg-paper'
      }`}
    >
      {active && <span className="absolute top-2 bottom-2 left-0 w-[3px] rounded-full bg-amber" />}
      {dot && <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: dot }} />}
      <span className="flex-1 leading-tight">
        <span className="block text-sm font-medium">{label}</span>
        <span className={`block text-xs ${active ? 'text-primary/70' : 'text-ink-soft'}`}>{sub}</span>
      </span>
      {mono && <span className="font-mono text-[10px] text-ink-soft">{mono}</span>}
    </button>
  );
}
