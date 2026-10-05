import * as React from 'react';
import styles from './SpoSitesExplorer.module.scss';
import type { ISpoSitesExplorerProps, ISpoSite } from './ISpoSitesExplorerProps';
import { escape } from '@microsoft/sp-lodash-subset';

export interface ISpoSitesExplorerState {
  selectedSiteId: string;
  copiedUrl: boolean;
}

const HARDCODED_SITES: ISpoSite[] = [
  {
    id: 'site-intranet',
    title: 'The Corporate Hub',
    url: 'https://nachanmvp.sharepoint.com/sites/copilotdemo',
    description: 'Central portal for company-wide news, executive announcements, employee resources, and org directory.',
    department: 'Corporate Communications',
    siteType: 'Hub Site',
    icon: '🌐'
  },
  {
    id: 'site-hr',
    title: 'Human Resources & Benefits',
    url: 'https://nachanmvp.sharepoint.com/sites/spdemo',
    description: 'Employee benefits handbook, paid time off guidelines, career progression, policies, and wellness programs.',
    department: 'People & Culture',
    siteType: 'Communication Site',
    icon: '👥'
  },
  {
    id: 'site-it',
    title: 'IT Support & Engineering',
    url: 'https://nachanmvp.sharepoint.com/teams/ContosoIT',
    description: 'IT helpdesk portal, software catalog, hardware requests, engineering wikis, and security compliance.',
    department: 'Information Technology',
    siteType: 'Team Site',
    icon: '💻'
  },
  {
    id: 'site-marketing',
    title: 'Marketing & Brand Central',
    url: 'https://nachanmvp.sharepoint.com/sites/LearningCentral',
    description: 'Brand asset guidelines, design templates, campaign collateral, public relations kits, and case studies.',
    department: 'Global Marketing',
    siteType: 'Communication Site',
    icon: '📢'
  },
  {
    id: 'site-finance',
    title: 'Finance, Payroll & Ops',
    url: 'https://nachanmvp.sharepoint.com/sites/IntranetDemo',
    description: 'Quarterly financial reports, expense reimbursement policies, procurement forms, and budget models.',
    department: 'Finance & Operations',
    siteType: 'Team Site',
    icon: '📊'
  }
];

export default class SpoSitesExplorer extends React.Component<ISpoSitesExplorerProps, ISpoSitesExplorerState> {
  constructor(props: ISpoSitesExplorerProps) {
    super(props);
    this.state = {
      selectedSiteId: HARDCODED_SITES[0].id,
      copiedUrl: false
    };
  }

  private _onSelectSite = (siteId: string): void => {
    this.setState({
      selectedSiteId: siteId,
      copiedUrl: false
    });
  };

  private _onCopyUrl = (url: string): void => {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => {
          this.setState({ copiedUrl: true });
          window.setTimeout(() => {
            this.setState({ copiedUrl: false });
          }, 2000);
        })
        .catch(() => {
          // ignore clipboard errors
        });
    }
  };

  public render(): React.ReactElement<ISpoSitesExplorerProps> {
    const { userDisplayName, description } = this.props;
    const { selectedSiteId, copiedUrl } = this.state;

    const selectedSite: ISpoSite =
      HARDCODED_SITES.find(site => site.id === selectedSiteId) || HARDCODED_SITES[0];

    return (
      <section className={styles.spoSitesExplorer}>
        {/* Top Header Bar */}
        <div className={styles.topBar}>
          <h2 className={styles.topBarTitle}>
            <span>📁</span> SharePoint Sites Explorer
          </h2>
          <div className={styles.topBarUser}>
            {userDisplayName ? `Signed in as ${escape(userDisplayName)}` : escape(description)}
          </div>
        </div>

        {/* Master-Detail Layout */}
        <div className={styles.layoutContainer}>
          {/* Left Navigation Menu */}
          <nav className={styles.sidebar} aria-label="SharePoint Sites Navigation">
            <div className={styles.sidebarHeader}>
              <h3 className={styles.sidebarHeading}>SharePoint Sites</h3>
              <span className={styles.siteBadgeCount}>{HARDCODED_SITES.length} sites</span>
            </div>

            <ul className={styles.menuList}>
              {HARDCODED_SITES.map(site => {
                const isActive = site.id === selectedSite.id;
                return (
                  <li key={site.id}>
                    <button
                      type="button"
                      className={`${styles.menuItemButton} ${isActive ? styles.menuItemButtonActive : ''}`}
                      onClick={() => this._onSelectSite(site.id)}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span className={styles.menuItemIcon} aria-hidden="true">{site.icon}</span>
                      <div className={styles.menuItemInfo}>
                        <div className={styles.menuItemTitle}>{site.title}</div>
                        <span className={styles.menuItemType}>{site.department}</span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right Site View */}
          <main className={styles.contentPanel} aria-label="Selected SharePoint Site Details">
            <header className={styles.contentHeader}>
              <div className={styles.contentTitleArea}>
                <h1 className={styles.siteHeading}>
                  <span>{selectedSite.icon}</span>
                  {selectedSite.title}
                </h1>
                <div className={styles.tagGroup}>
                  <span className={`${styles.tag} ${styles.tagType}`}>{selectedSite.siteType}</span>
                  <span className={`${styles.tag} ${styles.tagDept}`}>{selectedSite.department}</span>
                </div>
              </div>

              <div className={styles.actionsArea}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => this._onCopyUrl(selectedSite.url)}
                  title="Copy SharePoint Site URL"
                >
                  {copiedUrl ? '✓ Copied!' : '📋 Copy URL'}
                </button>
                <a
                  href={selectedSite.url}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.btnPrimary}
                  title="Open SharePoint site in new tab"
                >
                  ↗ Open Site
                </a>
              </div>
            </header>

            {/* Site Overview Banner */}
            <div className={styles.siteInfoBanner}>
              <p className={styles.siteDescription}>{selectedSite.description}</p>
              <div className={styles.siteUrlRow}>
                <strong>Location:</strong>
                <a href={selectedSite.url} target="_blank" rel="noreferrer">
                  {selectedSite.url}
                </a>
              </div>
            </div>

            {/* Embedded Site Preview */}
            <div className={styles.previewSection}>
              <div className={styles.previewHeader}>
                <span className={styles.previewLabel}>
                  🖥️ Site Preview ({selectedSite.title})
                </span>
                <span className={styles.previewNotice}>
                  If your browser or tenant blocks iframe embedding, use &#39;Open Site&#39; above
                </span>
              </div>
              <div className={styles.iframeWrapper}>
                <iframe
                  key={selectedSite.id}
                  src={selectedSite.url}
                  title={selectedSite.title}
                  className={styles.siteIframe}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            </div>
          </main>
        </div>
      </section>
    );
  }
}
