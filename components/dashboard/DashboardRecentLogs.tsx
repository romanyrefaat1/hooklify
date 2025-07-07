"use client";

import { useUserSites } from "@/contexts/UserSites";
import normalizeMessageInEvents from "@/lib/helpers/normalize-message-in-events";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Server Component: Recent Logs Table
interface Log {
  id: string;
  createdOn: string;
  type: string;
}

interface DashboardRecentLogsProps {
  recentLogs: Log[];
}

export default function DashboardRecentLogs() {
  const {loading, error, currSite} = useUserSites()
  
  const totalEvents = currSite?.events?.length || 0;
  const displayedEvents = Math.min(6, totalEvents);
   
  return (
    <div className="fade-in">
      <h2 className="text-2xl font-bold text-text-primary mb-6 font-display tracking-tight">
        Your recent Events
      </h2>
      <div className="hooklify-card">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-center py-4 px-4 font-semibold text-text-primary text-sm uppercase tracking-wider">ID</th>
                <th className="text-center py-4 px-4 font-semibold text-text-primary text-sm uppercase tracking-wider">Name</th>
                <th className="text-center py-4 px-4 font-semibold text-text-primary text-sm uppercase tracking-wider">Message</th>
                <th className="text-center py-4 px-4 font-semibold text-text-primary text-sm uppercase tracking-wider">Created On</th>
                <th className="text-center py-4 px-4 font-semibold text-text-primary text-sm uppercase tracking-wider">Type</th>
              </tr>
            </thead>
            <tbody>
              {loading && Array.from({ length: 6 }).map((_, idx) => (
                <tr key={idx}>
                  {Array.from({ length: 5 }).map((_, tdIdx) => (
                    <td key={tdIdx} className="py-4 px-4">
                      <Skeleton className="h-4 w-full bg-gray-200" />
                    </td>
                  ))}
                </tr>
              ))}
              {currSite?.events?.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="py-4 px-4 text-text-secondary font-mono text-center text-sm">No events found</td>
                </tr>
              )}
              {currSite?.events?.length > 0 && currSite?.events?.slice(0, 6).map((event, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-text-secondary font-mono text-sm text-center">{event.id}</td>
                  <td className="py-4 px-4 text-text-secondary font-mono text-sm text-center">{event.event_data?.name}</td>
                  <td className="py-4 px-4 text-text-secondary font-mono text-sm text-center">{normalizeMessageInEvents(event.event_data?.message)}</td>
                  <td className="py-4 px-4 text-text-secondary font-mono text-sm text-center">{event.timestamp}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-color-primary-muted text-color-primary-dark">
                      {event.event_type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Event Counter */}
        {totalEvents > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-row-reverse justify-end gap-4 items-center">
              <span className="text-xs text-text-secondary">
                Showing {displayedEvents} of {totalEvents} Events: <span className="text-xs font-medium text-text-primary">
                  {displayedEvents}/{totalEvents}
                </span>
              </span>
              <div className="flex items-center gap-3">
                
                <Button asChild variant="outline" size="sm">
                  <Link href="/events">View All</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}