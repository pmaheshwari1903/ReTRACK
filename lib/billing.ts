"use server";

import { getServerSession } from "@/features/auth/actions";
import {
  cancelProSubscription,
  createProSubscription,
  verifyAndActivateProSubscription,
} from "@/features/billing/server/subscription";
import { redirect } from "next/navigation";

export async function startProSubscription() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return createProSubscription(session.user.id);
}

export async function verifyAndActivateSubscription(payload?: {
  razorpay_payment_id?: string;
  razorpay_subscription_id?: string;
  razorpay_signature?: string;
}) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return verifyAndActivateProSubscription(session.user.id, payload);
}

export async function cancelSubscription() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return cancelProSubscription(session.user.id);
}