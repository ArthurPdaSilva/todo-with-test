import { defineConfig } from "drizzle-kit";

import { getFullEnv } from "@/env/config";

const { databaseFile, drizzleMigrationsFolder, drizzleSchemaFiles } =
  getFullEnv();

export default defineConfig({
  out: drizzleMigrationsFolder,
  schema: drizzleSchemaFiles,
  dialect: "sqlite",
  dbCredentials: {
    url: databaseFile,
  },
});
