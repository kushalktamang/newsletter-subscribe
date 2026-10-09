import db from "@/database/database.js";
import subscriberTable from "@/database/schema.js";
import { newToken } from "@/utils/random.js";
import { and, eq, gt, sql } from "drizzle-orm";

const CONFIRM_TTL_MS = 24 * 60 * 60 * 1000;

const upsertSubscriber = async (rawEmail: string) => {
  const email = rawEmail.trim().toLowerCase();
  const confirmToken = newToken();
  const confirmTokenExpiresAt = new Date(Date.now() + CONFIRM_TTL_MS);

  const [row] = await db
    .insert(subscriberTable)
    .values({
      email,
      confirmToken,
      confirmTokenExpiresAt,
      unsubscribeToken: newToken(),
    })
    .onConflictDoUpdate({
      target: subscriberTable.email,
      set: {
        confirmToken,
        confirmTokenExpiresAt,
        confirmedAt: null,
        unsubscribedAt: null,
      },
      // only re-issue for pending or unsubscribed rows
      setWhere: sql`${subscriberTable.confirmedAt} is null or ${subscriberTable.unsubscribedAt} is not null`,
    })
    .returning({ id: subscriberTable.id });

  // no row means already confirmed and active, so nothing to send
  if (row === undefined) {
    return null;
  }

  return { email, token: confirmToken }; // raw token goes in the confirm lin
};

const confirmSubscriber = async (token: string) => {
  const [confirmed] = await db
    .update(subscriberTable)
    .set({
      confirmedAt: new Date(),
      confirmToken: null,
      confirmTokenExpiresAt: null,
    })
    .where(
      and(
        eq(subscriberTable.confirmToken, token),
        gt(subscriberTable.confirmTokenExpiresAt, new Date()),
      ),
    )
    .returning({ email: subscriberTable.email });

  return Boolean(confirmed);
};

export { upsertSubscriber, confirmSubscriber };
