import { setLocale, useLocale, useMessages } from '../i18n';

/**
 * Sits in a toolbar row of its own rather than inside the dashboard or the stage: those two
 * swap as you navigate, and a control that moves when the page changes is a control you have
 * to look for every time.
 */
export default function LocaleSwitch() {
  const locale = useLocale();
  const m = useMessages();

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === 'en' ? 'zh' : 'en')}
      aria-label={m.localeSwitchLabel}
      className="rounded-md border border-hairline bg-surface px-2.5 py-1 font-mono text-[11px] text-ink-soft transition-colors duration-150 hover:border-primary hover:text-primary"
    >
      {m.localeName}
    </button>
  );
}
