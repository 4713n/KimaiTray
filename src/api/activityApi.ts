import type { KimaiClient } from "./kimaiClient";
import type { ActivityListParams, KimaiActivity } from "./kimaiTypes";

export async function getActivities(
  client: KimaiClient,
  params?: ActivityListParams,
): Promise<KimaiActivity[]> {
  return client.get<KimaiActivity[]>("/api/activities", params);
}

export async function getActivitiesForProject(
  client: KimaiClient,
  projectId: number,
): Promise<KimaiActivity[]> {
  return getActivities(client, { project: projectId });
}

export async function getActivity(
  client: KimaiClient,
  id: number,
): Promise<KimaiActivity> {
  return client.get<KimaiActivity>(`/api/activities/${id}`);
}
