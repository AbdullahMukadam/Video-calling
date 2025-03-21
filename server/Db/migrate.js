import { migrate } from "drizzle-orm/neon-serverless/migrator"
import { db } from "./Db.js"

async function runMigration() {
    console.log("running migrations...")

    await migrate(db, {
        migrationsFolder: "drizzle"
    })

    console.log("migration completed");
    process.exit(0)
}

runMigration().catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
})