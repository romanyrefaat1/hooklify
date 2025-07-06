// Service function to call the backend API route for canceling a subscription
export async function cancelSubscriptionService(subscriptionId: string) {
  const response = await fetch('/api/dodopayments/cancel-subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subscriptionId }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to cancel subscription');
  }
  return data;
}
