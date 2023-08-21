import React, { FC, useContext } from 'react';
// @ts-ignore
import { history } from 'dumi';
import { context, Link } from 'dumi/theme';
import './LocaleSelect.less';

const LocaleSelect: FC<{ location: any }> = ({ location }) => {
  const {
    locale,
    config: { locales },
  } = useContext(context);
  const firstDiffLocale = locales.find(({ name }) => name !== locale);

  function getLocaleTogglePath(target: string) {
    let newPathname = location.pathname.replace(`/${locale}`, '') || '/';

    // append locale prefix to path if it is not the default locale
    if (target !== locales[0].name) {
      newPathname = `/${target}${newPathname}`.replace(/\/$/, '');
    }

    return newPathname;
  }

  return (
    Boolean(locales.length) && (
      <div className="__dumi-default-locale-select" data-locale-count={locales.length}>
        {locales.length > 2 ? (
          <select
            value={locale}
            onChange={ev => history.push(getLocaleTogglePath(ev.target.value))}
          >
            {locales.map(localeItem => (
              <option value={localeItem.name} key={localeItem.name}>
                {localeItem.label}
              </option>
            ))}
          </select>
        ) : (
          <Link to={getLocaleTogglePath(firstDiffLocale.name)}>{firstDiffLocale.label}</Link>
        )}
      </div>
    )
  );
};

export default LocaleSelect;
