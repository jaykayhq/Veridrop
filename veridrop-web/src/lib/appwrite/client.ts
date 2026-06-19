import { Client, Account, Databases, Storage, Functions } from "appwrite";

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

/**
 * Server-side Appwrite client.
 * Must only be used in API routes / Server Components / Server Actions.
 * Do NOT import this client into client components.
 */
export function createAdminClient() {
  if (!endpoint || !projectId || !apiKey) {
    throw new Error("Missing Appwrite environment variables");
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId);

  client.setDevKey(apiKey);

  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client),
    functions: new Functions(client),
  };
}

/**
 * Public Appwrite client for browser-side usage.
 * No API key exposed — only endpoint and project ID.
 */
export function createPublicClient() {
  if (!endpoint || !projectId) {
    throw new Error("Missing Appwrite public environment variables");
  }

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId);

  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client),
  };
}
