"use client";

import { useState } from "react";
import { toast } from "sonner";

interface PaymentCancelProps {
  subscriptionId: string;
  onCancelSuccess?: () => void;
  className?: string;
}

export default function PaymentCancel({
  subscriptionId,
  onCancelSuccess,
  className = ""
}: PaymentCancelProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    if (!subscriptionId) {
      toast.error("No subscription ID provided.");
      return;
    }
    if (!window.confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/payments/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscriptionId }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Subscription cancelled successfully.");
        if (onCancelSuccess) onCancelSuccess();
      } else {
        toast.error(data.error || "Failed to cancel subscription.");
      }
    } catch (error: any) {
      toast.error("Something went wrong. Please try again.");
      console.error("Cancel subscription error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={isLoading}
      className={`bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200 ${className} ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isLoading ? "Cancelling..." : "Cancel Subscription"}
    </button>
  );
}
