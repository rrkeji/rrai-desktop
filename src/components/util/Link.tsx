import * as React from 'react';
import { useLocation, Link as UmiLink } from 'umi';
// import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import clsx from 'clsx';

import { Link as MuiLink, LinkProps as MuiLinkProps, styled } from '@mui/joy';


// Add support for the sx prop for consistency with the other branches.
const Anchor = styled('a')({});

// interface NextLinkComposedProps
//   extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
//   Omit<NextLinkProps, 'href' | 'as' | 'passHref' | 'onMouseEnter' | 'onClick' | 'onTouchStart'> {
// }
interface NextLinkComposedProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
  linkAs?: string;
}

const NextLinkComposed = React.forwardRef<HTMLAnchorElement, NextLinkComposedProps>(
  function NextLinkComposed(props, ref) {
    const {
      to,
      linkAs,
      replace,
      scroll,
      shallow,
      prefetch,
      legacyBehavior = true,
      locale,
      ...other
    } = props;

    return (
      <UmiLink
        to={to}
        prefetch={prefetch}
        as={linkAs}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        passHref
        locale={locale}
        legacyBehavior={legacyBehavior}
      >
        <Anchor ref={ref} {...other} />
      </UmiLink>
    );
  },
);

export type LinkProps = {
  activeClassName?: string;
  as?: string;
  href: string;
  linkAs?: string; // Useful when the as prop is shallow by styled().
  noLinkStyle?: boolean;
} & Omit<NextLinkComposedProps, 'to' | 'linkAs' | 'href'> &
  Omit<MuiLinkProps, 'href'>;

// A styled version of the Next.js Link component:
// https://nextjs.org/docs/api-reference/next/link
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(props, ref) {
  const {
    activeClassName = 'active',
    as,
    className: classNameProps,
    href,
    legacyBehavior,
    linkAs: linkAsProp,
    locale,
    noLinkStyle,
    prefetch,
    replace,
    role, // Link don't have roles.
    scroll,
    shallow,
    ...other
  } = props;

  const location = useLocation();
  const pathname = typeof href === 'string' ? href : href.pathname;
  const className = clsx(classNameProps, {
    [activeClassName]: location.pathname === pathname && activeClassName,
  });

  // external links: MuiLink (default) or 'a'
  const isExternal = typeof href === 'string' && (href.indexOf('http') === 0 || href.indexOf('mailto:') === 0);
  if (isExternal)
    return !noLinkStyle
      ? <MuiLink className={className} href={href} ref={ref} {...other} />
      : <Anchor className={className} href={href} ref={ref} {...other} />;

  const linkAs = linkAsProp || as;
  const nextjsProps = {
    to: href,
    linkAs,
    replace,
    scroll,
    shallow,
    prefetch,
    legacyBehavior,
    locale,
  };

  // internal (routed) links: MuiLink (default, over NextLinkComposed) or NextLinkComposed
  return !noLinkStyle
    ? <MuiLink component={NextLinkComposed} className={className} ref={ref} {...nextjsProps} {...other} />
    : <NextLinkComposed className={className} ref={ref} {...nextjsProps} {...other} />;
});
