import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";


const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    password: text("password").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
})


export { users }