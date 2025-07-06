// Service function to call the backend API route for getting a subscription
export async function getSubscriptionService(subscriptionId: string) {
  const response = await fetch('/api/dodopayments/get-subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ subscriptionId }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to get subscription');
  }
  return data;
}
