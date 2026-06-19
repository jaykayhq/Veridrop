import { Client, Databases, Users, Account } from "node-appwrite";

export function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT as string)
    .setProject(process.env.APPWRITE_PROJECT_ID as string)
    .setKey(process.env.APPWRITE_API_KEY as string);

  return {
    get databases() { return new Databases(client); },
    get users() { return new Users(client); },
  };
}

export const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "veridrop_main";
