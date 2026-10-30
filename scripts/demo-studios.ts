/**
 * Fills the live site with sample studios before real gyms join. Only gyms and
 * their reviews: no accounts, passwords or bookings, so it is safe on production.
 * Each one is tagged as a sample; remove them from the admin console
 * (Gyms → Sample studios → Remove all samples) or hide them one by one.
 *
 *   bun run db:demo-studios
 */
import { getMongoClient } from "@/server/db/client";
import { ensureIndexes } from "@/server/db/collections";
import { SAMPLE_OWNER_ID, upsertDemoGyms } from "./lib/demo-gyms";

async function main() {
  await ensureIndexes();
  const ids = await upsertDemoGyms(() => ({ ownerId: SAMPLE_OWNER_ID, isDemo: true }));
  console.log(`✓ ${ids.length} sample studios`);
  await (await getMongoClient()).close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
