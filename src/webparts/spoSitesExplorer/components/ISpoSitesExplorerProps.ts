export interface ISpoSite {
  id: string;
  title: string;
  url: string;
  description: string;
  department: string;
  siteType: 'Hub Site' | 'Communication Site' | 'Team Site';
  icon: string;
}

export interface ISpoSitesExplorerProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  userDisplayName: string;
}
