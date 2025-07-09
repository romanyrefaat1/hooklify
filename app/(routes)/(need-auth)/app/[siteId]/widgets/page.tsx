import React from 'react';
import WidgetsHeader from './_components/WidgetsHeader';
import WidgetsList from './_components/WidgetsList';
import { SiteWidgetsProvider } from '@/contexts/SiteWidgetsContext';

// Mock data - replace with actual server-side data fetching
const mockSite = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'My Awesome Website',
  site_url: 'https://myawesomewebsite.com',
  api_key: 'abc123-def456-ghi789'
};

const mockWidgets = [
  {
    id: '1',
    name: 'Welcome Toast',
    description: 'Shows a welcome message to new visitors',
    type: 'toast',
    created_at: '2024-01-15T10:30:00Z',
    site_id: mockSite.id,
    api_key: 'widget-key-001',
    href: '/widgets/welcome-toast',
    style: { position: 'top-right', theme: 'success' }
  },
  {
    id: '2',
    name: 'Discount Notification',
    description: 'Promote special offers and discounts',
    type: 'toast',
    created_at: '2024-01-20T14:15:00Z',
    site_id: mockSite.id,
    api_key: 'widget-key-002',
    href: '/widgets/discount-toast',
    style: { position: 'bottom-left', theme: 'warning' }
  },
  {
    id: '3',
    name: 'Cookie Consent',
    description: 'GDPR compliant cookie consent notification',
    type: 'toast',
    created_at: '2024-01-25T09:45:00Z',
    site_id: mockSite.id,
    api_key: 'widget-key-003',
    href: '/widgets/cookie-consent',
    style: { position: 'bottom-center', theme: 'info' }
  }
];

// Server-side function to get widgets data
async function getWidgets(siteId) {
  // In a real app, this would be an API call or database query
  // For now, we'll return the mock data
  return mockWidgets.filter(widget => widget.site_id === siteId);
}

export default async function WidgetsPage({ params }) {
  const siteId = params?.siteId || null;
  
  // Fetch widgets server-side
  const widgets = await getWidgets(siteId as string);
  
  return (
    <div className="min-h-screen fade-in container bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <SiteWidgetsProvider>
      <WidgetsHeader 
        selectedType="all"
        showFilters={false}
      />
      
      <WidgetsList 
        searchTerm=""
        selectedType="all"
      />
      </SiteWidgetsProvider>
    </div>
  );
}