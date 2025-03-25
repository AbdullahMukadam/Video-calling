import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";


const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    isGoogleUser: boolean().default(false)
})


export { users }