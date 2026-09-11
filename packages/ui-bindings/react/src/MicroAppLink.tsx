import { isMicroAppLinkActive, navigateMicroAppLink, subscribeToMicroAppLinkLocation } from '@qiankunjs/ui-shared';
import React, { forwardRef, useEffect, useState } from 'react';

export type MicroAppLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: string;
  replace?: boolean;
  activeClassName?: string;
};

/** A host navigation link for micro apps registered with `registerMicroApps`. */
export const MicroAppLink = forwardRef<HTMLAnchorElement, MicroAppLinkProps>(
  ({ to, replace = false, className, activeClassName, onClick, ...anchorProps }, ref) => {
    const [locationHref, setLocationHref] = useState(() =>
      typeof window === 'undefined' ? undefined : window.location.href,
    );

    useEffect(() => {
      // The post-subscription read closes the render-to-effect navigation gap.
      // eslint-disable-next-line @eslint-react/set-state-in-effect
      const updateLocation = () => setLocationHref(window.location.href);
      const unsubscribe = subscribeToMicroAppLinkLocation(updateLocation);
      // A navigation can finish between rendering and installing the listener.
      updateLocation();
      return unsubscribe;
    }, []);

    const linkClassName = [className, activeClassName && isMicroAppLinkActive(to, locationHref) && activeClassName]
      .filter(Boolean)
      .join(' ');

    return (
      <a
        {...anchorProps}
        ref={ref}
        href={to}
        className={linkClassName || undefined}
        onClick={(event) => {
          onClick?.(event);
          navigateMicroAppLink(event, event.currentTarget, replace);
        }}
      />
    );
  },
);

MicroAppLink.displayName = 'MicroAppLink';
