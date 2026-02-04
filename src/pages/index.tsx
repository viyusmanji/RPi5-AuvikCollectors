import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/">
            Get Started
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/checklists/complete-deployment">
            Deployment Checklists
          </Link>
        </div>
      </div>
    </header>
  );
}

type FeatureItem = {
  title: string;
  description: ReactNode;
  link: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Hardware Setup',
    description: (
      <>
        Bill of materials, PoE compatibility, and hardware assembly guides
        for Raspberry Pi 5 + PoE HAT deployments.
      </>
    ),
    link: '/docs/hardware/bill-of-materials',
  },
  {
    title: 'Software Installation',
    description: (
      <>
        OS configuration, Auvik collector installation, and Tailscale
        remote access setup instructions.
      </>
    ),
    link: '/docs/software/auvik-installation',
  },
  {
    title: 'Network Configuration',
    description: (
      <>
        IP addressing, VLAN placement, firewall rules, and SNMP setup
        for network monitoring.
      </>
    ),
    link: '/docs/network/ip-addressing',
  },
  {
    title: 'Deployment Workflow',
    description: (
      <>
        Step-by-step checklists for office preparation, field installation,
        and post-deployment verification.
      </>
    ),
    link: '/docs/deployment/pre-deployment',
  },
  {
    title: 'Troubleshooting',
    description: (
      <>
        Common issues and solutions for power, connectivity, and
        collector problems.
      </>
    ),
    link: '/docs/troubleshooting/common-issues',
  },
  {
    title: 'Reference',
    description: (
      <>
        Cost analysis, Auvik documentation links, and glossary of
        terms and acronyms.
      </>
    ),
    link: '/docs/reference/cost-analysis',
  },
];

function Feature({title, description, link}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <Link to={link} className={styles.featureLink}>
        <div className={styles.feature}>
          <div className="text--center padding-horiz--md">
            <Heading as="h3">{title}</Heading>
            <p>{description}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Deployment Guide"
      description="Raspberry Pi 5 Auvik Collector deployment playbook for viyu.net">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
