/**
 * Cancels an active Razorpay Pro subscription.
 *
 * Razorpay stops future charges; the user keeps Pro until the current billing
 * period ends (handled in `getUserSubscription` via `subscriptionRenewsAt`).
 *
 * @module features/billing/server/cancel-subscription
 */

import "server-only";

export { cancelProSubscription } from "./subscription";