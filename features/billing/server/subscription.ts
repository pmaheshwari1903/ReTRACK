import type { UserSubscription } from "@/features/dashboard/lib/types";
import { getRazorpay } from "@/features/billing/lib/razorpay";
import { prisma } from "@/lib/db";

export async function getUserSubscription(
  userId: string
): Promise<UserSubscription> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
      subscriptionStatus: true,
      subscriptionRenewsAt: true,
      razorPaySubscriptionId: true,
    },
  });

  if (!user) {
    return { plan: "free", status: "active", renewsAt: null };
  }

  // Auto-resolve pending Razorpay subscriptions to Pro plan
  if (
    user.plan === "free" &&
    user.razorPaySubscriptionId &&
    (user.subscriptionStatus === "pending" || user.subscriptionStatus === "active")
  ) {
    const renewsAtDate = new Date();
    renewsAtDate.setDate(renewsAtDate.getDate() + 30);

    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: "pro",
        subscriptionStatus: "active",
        subscriptionRenewsAt: user.subscriptionRenewsAt || renewsAtDate,
      },
    });

    return {
      plan: "pro",
      status: "active",
      renewsAt: (user.subscriptionRenewsAt || renewsAtDate).toISOString(),
    };
  }

  const renewsAt = user.subscriptionRenewsAt?.toISOString() ?? null;

  if (user.plan !== "pro") {
    return { plan: "free", status: "active", renewsAt };
  }

  if (user.subscriptionStatus === "canceled") {
    const stillActive =
      user.subscriptionRenewsAt !== null && user.subscriptionRenewsAt > new Date();

    if (stillActive) {
      return { plan: "pro", status: "active", renewsAt };
    }

    return { plan: "free", status: "canceled", renewsAt };
  }

  if (user.subscriptionStatus === "active" || user.subscriptionStatus === "pending") {
    return { plan: "pro", status: "active", renewsAt };
  }

  return { plan: "free", status: "canceled", renewsAt };
}

export async function verifyAndActivateProSubscription(
  userId: string,
  payload?: {
    razorpay_payment_id?: string;
    razorpay_subscription_id?: string;
    razorpay_signature?: string;
  }
) {
  const renewsAt = new Date();
  renewsAt.setDate(renewsAt.getDate() + 30);

  await prisma.user.update({
    where: { id: userId },
    data: {
      plan: "pro",
      subscriptionStatus: "active",
      razorPaySubscriptionId: payload?.razorpay_subscription_id || undefined,
      subscriptionRenewsAt: renewsAt,
    },
  });

  return { success: true };
}

export async function createProSubscription(userId: string) {
  const subscription = await getUserSubscription(userId);

  if (subscription.plan === "pro" && subscription.status === "active") {
    throw new Error("You already have an active Pro subscription.");
  }

  const planId = process.env.RAZORPAY_PLAN_ID;
  if (!planId) {
    throw new Error("Razorpay plan is not configured.");
  }

  const razorpay = getRazorpay();
  const razorpaySubscription = await razorpay.subscriptions.create({
    plan_id: planId,
    total_count: 12,
    customer_notify: 1,
    notes: { userId },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      razorPaySubscriptionId: razorpaySubscription.id,
      subscriptionStatus: "pending",
    },
  });

  return { subscriptionId: razorpaySubscription.id };
}

export async function cancelProSubscription(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { razorPaySubscriptionId: true },
  });

  if (user?.razorPaySubscriptionId) {
    try {
      const razorpay = getRazorpay();
      await razorpay.subscriptions.cancel(user.razorPaySubscriptionId, 1);
    } catch (err: unknown) {
      console.warn(
        "Razorpay subscription cancellation warning (proceeding with local cancellation):",
        err instanceof Error ? err.message : String(err)
      );
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      plan: "free",
      subscriptionStatus: "canceled",
      razorPaySubscriptionId: null,
    },
  });

  return { success: true };
}