import React from 'react';
import {useLocation} from '@docusaurus/router';
import {useSidebarBreadcrumbs, useHomePageRoute} from '@docusaurus/theme-common/internal';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import clsx from 'clsx';
import styles from './styles.module.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  type?: string;
}

function BreadcrumbsItemLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}): React.ReactElement {
  if (!href) {
    return <span className={styles.breadcrumbItem}>{children}</span>;
  }

  return (
    <Link
      className={clsx(styles.breadcrumbItem, styles.breadcrumbItemLink)}
      href={href}
      itemProp="item"
    >
      <span itemProp="name">{children}</span>
    </Link>
  );
}

function BreadcrumbsItem({
  item,
  active,
}: {
  item: BreadcrumbItem;
  active?: boolean;
}): React.ReactElement {
  return (
    <li
      className={clsx(styles.breadcrumbsItem, {
        [styles.breadcrumbsItemActive]: active,
      })}
      itemScope
      itemProp="itemListElement"
      itemType="https://schema.org/ListItem"
    >
      <BreadcrumbsItemLink href={!active ? item.href : undefined}>
        {item.label}
      </BreadcrumbsItemLink>
      <meta itemProp="position" content={String(1)} />
    </li>
  );
}

function HomeBreadcrumbItem(): React.ReactElement {
  const homeHref = useHomePageRoute()?.path ?? '/';
  return (
    <li
      className={styles.breadcrumbsItem}
      itemScope
      itemProp="itemListElement"
      itemType="https://schema.org/ListItem"
    >
      <Link
        aria-label={translate({
          id: 'theme.docs.breadcrumbs.home',
          message: 'Home page',
          description: 'The ARIA label for the home page in the breadcrumbs',
        })}
        className={clsx(styles.breadcrumbItem, styles.breadcrumbItemLink)}
        href={homeHref}
        itemProp="item"
      >
        <span className={styles.breadcrumbHomeIcon} itemProp="name">
          🏠
        </span>
      </Link>
      <meta itemProp="position" content="0" />
    </li>
  );
}

export default function DocBreadcrumbs(): React.ReactElement | null {
  const breadcrumbs = useSidebarBreadcrumbs();
  const location = useLocation();

  if (!breadcrumbs || breadcrumbs.length === 0) {
    return null;
  }

  return (
    <nav
      className={styles.breadcrumbs}
      aria-label={translate({
        id: 'theme.docs.breadcrumbs.navAriaLabel',
        message: 'Breadcrumbs',
        description: 'The ARIA label for the breadcrumbs',
      })}
    >
      <ul
        className={styles.breadcrumbsList}
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <HomeBreadcrumbItem />
        {breadcrumbs.map((item, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <BreadcrumbsItem
              key={idx}
              item={item}
              active={isLast}
            />
          );
        })}
      </ul>
    </nav>
  );
}
