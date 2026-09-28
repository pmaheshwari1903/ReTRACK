"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"
import { statusButtonClass } from "@/features/dashboard/lib/status-style";
import { startProSubscription, verifyAndActivateSubscription } from "@/lib/billing";

type RazorpayCheckoutResponse = {
    razorpay_payment_id?: string;
    razorpay_subscription_id?: string;
    razorpay_signature?: string;
};

type RazorpayCheckout = new (options: Record<string, unknown>) => {
    open: () => void;
};

declare global {
    interface Window {
        Razorpay?: RazorpayCheckout
    }
}

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

export function UpgradeButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleUpgrade() {
        const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!key) {
          toast.error("Razorpay key is not configured yet.");
          return;
        }
    
        if (!window.Razorpay) {
          toast.error("Checkout is still loading, please try again in a moment.");
          return;
        }
    
        setLoading(true);
    
        try {
          const { subscriptionId } = await startProSubscription();
    
          const checkout = new window.Razorpay({
            key,
            subscription_id: subscriptionId,
            name: "Retrack Code Reviewer",
            description: "Pro plan — unlimited AI reviews",
            handler: async (response: RazorpayCheckoutResponse) => {
              try {
                setLoading(true);
                await verifyAndActivateSubscription({
                  razorpay_payment_id: response?.razorpay_payment_id,
                  razorpay_subscription_id: response?.razorpay_subscription_id || subscriptionId,
                  razorpay_signature: response?.razorpay_signature,
                });
                toast.success("Payment successful! Pro plan is now active 🎉");
                router.refresh();
              } catch (activationErr) {
                console.error("Activation error:", activationErr);
                toast.success("Payment received! Updating Pro subscription...");
                router.refresh();
              } finally {
                setLoading(false);
              }
            },
          });
    
          checkout.open();
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Could not start checkout.";
          toast.error(message);
        } finally {
          setLoading(false);
        }
      }
    return (
        <>
            <Script src={RAZORPAY_SCRIPT_URL} strategy="lazyOnload"></Script>
            <Button
                onClick={handleUpgrade}
                disabled={loading}
                className={cn(statusButtonClass.success)}
            >
                {loading ? "Activating Pro…" : "Upgrade to Pro"}
            </Button>
        </>
    )
}