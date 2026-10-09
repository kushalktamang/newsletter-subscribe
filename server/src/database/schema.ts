import { integer, varchar, text, timestamp, snakeCase } from "drizzle-orm/pg-core";

const subscriberTable = snakeCase.table("subscribers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: text().notNull().unique(),

  confirmToken: varchar({ length: 64 }).unique(),
  confirmTokenExpiresAt: timestamp({ withTimezone: true }),
  unsubscribeToken: varchar({ length: 64 }).notNull().unique(),

  confirmedAt: timestamp({ withTimezone: true }),
  unsubscribedAt: timestamp({ withTimezone: true }),

  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export default subscriberTable;
