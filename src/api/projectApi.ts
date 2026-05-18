import type { KimaiClient } from "./kimaiClient";
import type {
  KimaiCustomer,
  KimaiProject,
  CustomerListParams,
  ProjectListParams,
} from "./kimaiTypes";

export async function getProjects(
  client: KimaiClient,
  params?: ProjectListParams,
): Promise<KimaiProject[]> {
  return client.get<KimaiProject[]>("/api/projects", params);
}

export async function getProject(
  client: KimaiClient,
  id: number,
): Promise<KimaiProject> {
  return client.get<KimaiProject>(`/api/projects/${id}`);
}

export async function getCustomers(
  client: KimaiClient,
  params?: CustomerListParams,
): Promise<KimaiCustomer[]> {
  return client.get<KimaiCustomer[]>("/api/customers", params);
}

export async function getCustomer(
  client: KimaiClient,
  id: number,
): Promise<KimaiCustomer> {
  return client.get<KimaiCustomer>(`/api/customers/${id}`);
}
