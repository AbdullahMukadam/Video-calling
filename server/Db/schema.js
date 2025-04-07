
import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    isGoogleUser: boolean().default(false)
})

const calls = pgTable("calls", {
    id: serial("id").primaryKey(),
    callId: text("callId").notNull(),
    callerId: text("callerId").notNull(),
    joinerId: text("joinerId"),
})


export { users, calls }