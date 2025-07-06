// Service function to call the backend API route for getting customer subscriptions
export async function getCustomerSubscriptionsService(customerId: string) {
  const response = await fetch('/api/dodopayments/get-customer-subscriptions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ customerId }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to get customer subscriptions');
  }
  return data;
}
