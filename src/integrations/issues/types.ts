export type IssueProviderType = "gitlab" | "github";
export type IssueState = "opened" | "all";

export interface IssueIntegrationSettings {
  enabled: boolean;
  provider: IssueProviderType;
  baseUrl: string;
  apiBaseUrl: string;
  projectPathOrRepo: string;
  defaultState: IssueState;
  assigneeOnly: boolean;
  syncTime: boolean;
}

export interface ExternalIssue {
  id: number;
  title: string;
  state: string;
  webUrl: string;
  labels: string[];
  author: string;
}

export interface IssueProvider {
  testConnection(): Promise<{
    success: boolean;
    count?: number;
    error?: string;
  }>;
  searchIssues(query: string): Promise<ExternalIssue[]>;
  getIssueUrl(issue: ExternalIssue): string;
  addSpentTime?(issueId: number, durationSeconds: number): Promise<void>;
}
