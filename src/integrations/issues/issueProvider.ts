import type { IssueIntegrationSettings, IssueProvider } from "./types";
import { createGitLabProvider } from "./gitlabIssueProvider";
import { createGitHubProvider } from "./githubIssueProvider";

export function createIssueProvider(
  config: IssueIntegrationSettings,
  token: string,
): IssueProvider {
  if (config.provider === "github") {
    return createGitHubProvider(config, token);
  }
  return createGitLabProvider(config, token);
}
