import { OperatorNav } from '@/components/operator/operator-nav';
import { ConsumptionBlock } from '@/components/operator/consumption-block';
import { ReviewQueue } from '@/components/operator/review-queue';
import { getCurrentSession } from '@/lib/auth';
import { getConsumptionByProfile, getTotalConsumptionSummary } from '@/lib/db/consumption';
import { getReviewQueue } from '@/lib/db/operator';
import { lastThirtyDays, summarizeProfile } from '@/lib/utils/consumption';

/**
 * The operator entry point. A server component does the reading; the two blocks
 * below are client components only because they filter, open and reveal.
 *
 * Block order is the addendum's order and it is the priority order: the review
 * queue is the reason the module exists, consumption is the reason
 * authentication exists.
 */
export default async function OperatorDashboardPage() {
  const session = (await getCurrentSession())!;
  const period = lastThirtyDays();

  // ponytail: src/lib/db/ has no function that lists profile ids, so the per
  // user table currently covers the signed-in operator. Widening it is one
  // extra id in this array once the DB agent adds that function; nothing in
  // ConsumptionBlock changes.
  const profileIds = [session.profile.id];

  const [queue, summary, perProfile] = await Promise.all([
    getReviewQueue(),
    getTotalConsumptionSummary(period),
    Promise.all(
      profileIds.map(async (profileId) =>
        summarizeProfile(profileId, await getConsumptionByProfile(profileId, period))
      )
    ),
  ]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-canvas">
      <OperatorNav />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-3.5 px-4 py-3.5">
          <ReviewQueue entries={queue} />
          <ConsumptionBlock summary={summary} rows={perProfile} />
        </div>
      </main>
    </div>
  );
}
