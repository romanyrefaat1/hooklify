"use client";

import { useUserSites } from "@/contexts/UserSites";
import normalizeMessageInEvents from "@/lib/helpers/normalize-message-in-events";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import Link from "next/link";
import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";

// Server Component: Recent Logs Table
interface Log {
  id: string;
  createdOn: string;
  type: string;
}

interface DashboardRecentLogsProps {
  recentLogs: Log[];
}

export default function DashboardRecentLogs({isMain=false, currSite}: {isMain?: boolean}) {
  // const {loading, error, currSite} = useUserSites()
  const loading = false;
  const currSite = {events: [
    {
    event_type: "user_signup",
    id: "49a2628f-6a50-4db9-86bc-bf4bb12fb51c",
    message: null,
    site_id: "2e36d662-2ce9-4b17-b742-315fabb0f4aa",
    timestamp: "2025-07-07T22:21:07.433+00:00",
    event_data: {
      city: "New York",
      name: "John Doe",
message: [
  {color: "#e74c3c", style: "bold", value: "John Doe"},
  {value: " just signed up from "},
  {color: "#3498db", style: "bold", value: "New York"},
  {value: "!"}
]
    }
  },
  {
    event_type: "user_signup",
    id: "49a2628f-6a50-4db9-86bc-bf4bb12fb51c",
    message: null,
    site_id: "2e36d662-2ce9-4b17-b742-315fabb0f4aa",
    timestamp: "2025-07-07T22:21:07.433+00:00",
    event_data: {
      city: "New York",
      name: "John Doe",
message: [
  {color: "#e74c3c", style: "bold", value: "John Doe"},
  {value: " just signed up from "},
  {color: "#3498db", style: "bold", value: "New York"},
  {value: "!"}
]
    }
  },
  {
    event_type: "user_signup",
    id: "49a2628f-6a50-4db9-86bc-bf4bb12fb51c",
    message: null,
    site_id: "2e36d662-2ce9-4b17-b742-315fabb0f4aa",
    timestamp: "2025-07-07T22:21:07.433+00:00",
    event_data: {
      city: "New York",
      name: "John Doe",
message: [
  {color: "#e74c3c", style: "bold", value: "John Doe"},
  {value: " just signed up from "},
  {color: "#3498db", style: "bold", value: "New York"},
  {value: "!"}
]
    }
  }
  , {
    event_type: "user_signup",
    id: "49a2628f-6a50-4db9-86bc-bf4bb12fb51c",
    message: null,
    site_id: "2e36d662-2ce9-4b17-b742-315fabb0f4aa",
    timestamp: "2025-07-07T22:21:07.433+00:00",
    event_data: {
      city: "New York",
      name: "John Doe",
message: [
  {color: "#e74c3c", style: "bold", value: "John Doe"},
  {value: " just signed up from "},
  {color: "#3498db", style: "bold", value: "New York"},
  {value: "!"}
]
    }
  },
  {
    event_type: "user_signup",
    id: "49a2628f-6a50-4db9-86bc-bf4bb12fb51c",
    message: null,
    site_id: "2e36d662-2ce9-4b17-b742-315fabb0f4aa",
    timestamp: "2025-07-07T22:21:07.433+00:00",
    event_data: {
      city: "New York",
      name: "John Doe",
message: [
  {color: "#e74c3c", style: "bold", value: "John Doe"},
  {value: " just signed up from "},
  {color: "#3498db", style: "bold", value: "New York"},
  {value: "!"}
]
    }
  },
  {
    event_type: "user_signup",
    id: "49a2628f-6a50-4db9-86bc-bf4bb12fb51c",
    message: null,
    site_id: "2e36d662-2ce9-4b17-b742-315fabb0f4aa",
    timestamp: "2025-07-07T22:21:07.433+00:00",
    event_data: {
      city: "New York",
      name: "John Doe",
message: [
  {color: "#e74c3c", style: "bold", value: "John Doe"},
  {value: " just signed up from "},
  {color: "#3498db", style: "bold", value: "New York"},
  {value: "!"}
]
    }
  }, {
    event_type: "user_signup",
    id: "49a2628f-6a50-4db9-86bc-bf4bb12fb51c",
    message: null,
    site_id: "2e36d662-2ce9-4b17-b742-315fabb0f4aa",
    timestamp: "2025-07-07T22:21:07.433+00:00",
    event_data: {
      city: "New York",
      name: "John Doe",
message: [
  {color: "#e74c3c", style: "bold", value: "John Doe"},
  {value: " just signed up from "},
  {color: "#3498db", style: "bold", value: "New York"},
  {value: "!"}
]
    }
  },{
    event_type: "user_signup",
    id: "49a2628f-6a50-4db9-86bc-bf4bb12fb51c",
    message: null,
    site_id: "2e36d662-2ce9-4b17-b742-315fabb0f4aa",
    timestamp: "2025-07-07T22:21:07.433+00:00",
    event_data: {
      city: "New York",
      name: "John Doe",
message: [
  {color: "#e74c3c", style: "bold", value: "John Doe"},
  {value: " just signed up from "},
  {color: "#3498db", style: "bold", value: "New York"},
  {value: "!"}
]
    }
  },{
    event_type: "user_signup",
    id: "49a2628f-6a50-4db9-86bc-bf4bb12fb51c",
    message: null,
    site_id: "2e36d662-2ce9-4b17-b742-315fabb0f4aa",
    timestamp: "2025-07-07T22:21:07.433+00:00",
    event_data: {
      city: "New York",
      name: "John Doe",
message: [
  {color: "#e74c3c", style: "bold", value: "John Doe"},
  {value: " just signed up from "},
  {color: "#3498db", style: "bold", value: "New York"},
  {value: "!"}
]
    }
  },{
    event_type: "user_signup",
    id: "49a2628f-6a50-4db9-86bc-bf4bb12fb51c",
    message: null,
    site_id: "2e36d662-2ce9-4b17-b742-315fabb0f4aa",
    timestamp: "2025-07-07T22:21:07.433+00:00",
    event_data: {
      city: "New York",
      name: "John Doe",
message: [
  {color: "#e74c3c", style: "bold", value: "John Doe"},
  {value: " just signed up from "},
  {color: "#3498db", style: "bold", value: "New York"},
  {value: "!"}
]
    }
  },{
    event_type: "user_signup",
    id: "49a2628f-6a50-4db9-86bc-bf4bb12fb51c",
    message: null,
    site_id: "2e36d662-2ce9-4b17-b742-315fabb0f4aa",
    timestamp: "2025-07-07T22:21:07.433+00:00",
    event_data: {
      city: "New York",
      name: "John Doe",
message: [
  {color: "#e74c3c", style: "bold", value: "John Doe"},
  {value: " just signed up from "},
  {color: "#3498db", style: "bold", value: "New York"},
  {value: "!"}
]
    }
  },{
    event_type: "user_signup",
    id: "49a2628f-6a50-4db9-86bc-bf4bb12fb51c",
    message: null,
    site_id: "2e36d662-2ce9-4b17-b742-315fabb0f4aa",
    timestamp: "2025-07-07T22:21:07.433+00:00",
    event_data: {
      city: "New York",
      name: "John Doe",
message: [
  {color: "#e74c3c", style: "bold", value: "John Doe"},
  {value: " just signed up from "},
  {color: "#3498db", style: "bold", value: "New York"},
  {value: "!"}
]
    }
  },{
    event_type: "user_signup",
    id: "49a2628f-6a50-4db9-86bc-bf4bb12fb51c",
    message: null,
    site_id: "2e36d662-2ce9-4b17-b742-315fabb0f4aa",
    timestamp: "2025-07-07T22:21:07.433+00:00",
    event_data: {
      city: "New York",
      name: "John Doe",
message: [
  {color: "#e74c3c", style: "bold", value: "John Doe"},
  {value: " just signed up from "},
  {color: "#3498db", style: "bold", value: "New York"},
  {value: "!"}
]
    }
  },{
    event_type: "user_signup",
    id: "49a2628f-6a50-4db9-86bc-bf4bb12fb51c",
    message: null,
    site_id: "2e36d662-2ce9-4b17-b742-315fabb0f4aa",
    timestamp: "2025-07-07T22:21:07.433+00:00",
    event_data: {
      city: "New York",
      name: "John Doe",
message: [
  {color: "#e74c3c", style: "bold", value: "John Doe"},
  {value: " just signed up from "},
  {color: "#3498db", style: "bold", value: "New York"},
  {value: "!"}
]
    }
  },{
    event_type: "user_signup",
    id: "49a2628f-6a50-4db9-86bc-bf4bb12fb51c",
    message: null,
    site_id: "2e36d662-2ce9-4b17-b742-315fabb0f4aa",
    timestamp: "2025-07-07T22:21:07.433+00:00",
    event_data: {
      city: "New York",
      name: "John Doe",
message: [
  {color: "#e74c3c", style: "bold", value: "John Doe"},
  {value: " just signed up from "},
  {color: "#3498db", style: "bold", value: "New York"},
  {value: "!"}
]
    }
  },{
    event_type: "user_signup",
    id: "49a2628f-6a50-4db9-86bc-bf4bb12fb51c",
    message: null,
    site_id: "2e36d662-2ce9-4b17-b742-315fabb0f4aa",
    timestamp: "2025-07-07T22:21:07.433+00:00",
    event_data: {
      city: "New York",
      name: "John Doe",
message: [
  {color: "#e74c3c", style: "bold", value: "John Doe"},
  {value: " just signed up from "},
  {color: "#3498db", style: "bold", value: "New York"},
  {value: "!"}
]
    }
  },{
    event_type: "user_signup",
    id: "49a2628f-6a50-4db9-86bc-bf4bb12fb51c",
    message: null,
    site_id: "2e36d662-2ce9-4b17-b742-315fabb0f4aa",
    timestamp: "2025-07-07T22:21:07.433+00:00",
    event_data: {
      city: "New York",
      name: "John Doe",
message: [
  {color: "#e74c3c", style: "bold", value: "John Doe"},
  {value: " just signed up from "},
  {color: "#3498db", style: "bold", value: "New York"},
  {value: "!"}
]
    }
  },{
    event_type: "user_signup",
    id: "49a2628f-6a50-4db9-86bc-bf4bb12fb51c",
    message: null,
    site_id: "2e36d662-2ce9-4b17-b742-315fabb0f4aa",
    timestamp: "2025-07-07T22:21:07.433+00:00",
    event_data: {
      city: "New York",
      name: "John Doe",
message: [
  {color: "#e74c3c", style: "bold", value: "John Doe"},
  {value: " just signed up from "},
  {color: "#3498db", style: "bold", value: "New York"},
  {value: "!"}
]
    }
  },{
    event_type: "user_signup",
    id: "49a2628f-6a50-4db9-86bc-bf4bb12fb51c",
    message: null,
    site_id: "2e36d662-2ce9-4b17-b742-315fabb0f4aa",
    timestamp: "2025-07-07T22:21:07.433+00:00",
    event_data: {
      city: "New York",
      name: "John Doe",
message: [
  {color: "#e74c3c", style: "bold", value: "John Doe"},
  {value: " just signed up from "},
  {color: "#3498db", style: "bold", value: "New York"},
  {value: "!"}
]
    }
  },{
    event_type: "user_signup",
    id: "49a2628f-6a50-4db9-86bc-bf4bb12fb51c",
    message: null,
    site_id: "2e36d662-2ce9-4b17-b742-315fabb0f4aa",
    timestamp: "2025-07-07T22:21:07.433+00:00",
    event_data: {
      city: "New York",
      name: "John Doe",
message: [
  {color: "#e74c3c", style: "bold", value: "John Doe"},
  {value: " just signed up from "},
  {color: "#3498db", style: "bold", value: "New York"},
  {value: "!"}
]
    }
  },{
    event_type: "user_signup",
    id: "49a2628f-6a50-4db9-86bc-bf4bb12fb51c",
    message: null,
    site_id: "2e36d662-2ce9-4b17-b742-315fabb0f4aa",
    timestamp: "2025-07-07T22:21:07.433+00:00",
    event_data: {
      city: "New York",
      name: "John Doe",
message: [
  {color: "#e74c3c", style: "bold", value: "John Doe"},
  {value: " just signed up from "},
  {color: "#3498db", style: "bold", value: "New York"},
  {value: "!"}
]
    }
  },{
    event_type: "user_signup",
    id: "49a2628f-6a50-4db9-86bc-bf4bb12fb51c",
    message: null,
    site_id: "2e36d662-2ce9-4b17-b742-315fabb0f4aa",
    timestamp: "2025-07-07T22:21:07.433+00:00",
    event_data: {
      city: "New York",
      name: "John Doe",
message: [
  {color: "#e74c3c", style: "bold", value: "John Doe"},
  {value: " just signed up from "},
  {color: "#3498db", style: "bold", value: "New York"},
  {value: "!"}
]
    }
  },{
    event_type: "user_signup",
    id: "49a2628f-6a50-4db9-86bc-bf4bb12fb51c",
    message: null,
    site_id: "2e36d662-2ce9-4b17-b742-315fabb0f4aa",
    timestamp: "2025-07-07T22:21:07.433+00:00",
    event_data: {
      city: "New York",
      name: "John Doe",
message: [
  {color: "#e74c3c", style: "bold", value: "John Doe"},
  {value: " just signed up from "},
  {color: "#3498db", style: "bold", value: "New York"},
  {value: "!"}
]
    }
  },{
    event_type: "user_signup",
    id: "49a2628f-6a50-4db9-86bc-bf4bb12fb51c",
    message: null,
    site_id: "2e36d662-2ce9-4b17-b742-315fabb0f4aa",
    timestamp: "2025-07-07T22:21:07.433+00:00",
    event_data: {
      city: "New York",
      name: "John Doe",
message: [
  {color: "#e74c3c", style: "bold", value: "John Doe"},
  {value: " just signed up from "},
  {color: "#3498db", style: "bold", value: "New York"},
  {value: "!"}
]
    }
  },{
    event_type: "user_signup",
    id: "49a2628f-6a50-4db9-86bc-bf4bb12fb51c",
    message: null,
    site_id: "2e36d662-2ce9-4b17-b742-315fabb0f4aa",
    timestamp: "2025-07-07T22:21:07.433+00:00",
    event_data: {
      city: "New York",
      name: "John Doe",
message: [
  {color: "#e74c3c", style: "bold", value: "John Doe"},
  {value: " just signed up from "},
  {color: "#3498db", style: "bold", value: "New York"},
  {value: "!"}
]
    }
  },
]}
  const [currentPage, setCurrentPage] = useState(1);
  const siteId = usePathname().split("/")[4];
  
  const totalEvents = currSite?.events?.length || 0;
  console.log("totalEvents:", currSite?.events);
  const eventsPerPage = isMain ? 10 : 6;
  const totalPages = Math.ceil(totalEvents / eventsPerPage);
  
  // Calculate pagination
  const paginatedEvents = useMemo(() => {
    if (!currSite?.events) return [];
    
    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    return currSite.events.slice(startIndex, endIndex);
  }, [currSite?.events, currentPage, eventsPerPage]);
  
  const displayedEvents = isMain ? paginatedEvents.length : Math.min(6, totalEvents);

  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <PaginationItem key={page}>
          <PaginationLink
            onClick={() => handlePageChange(page)}
            isActive={page === currentPage}
            className="cursor-pointer"
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };
   
  return (
    <div className="fade-in">
      {!isMain && <h2 className="text-2xl font-bold text-text-primary mb-6 font-display tracking-tight">
        Your recent Events
      </h2>}
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
              {loading && Array.from({ length: eventsPerPage }).map((_, idx) => (
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
              {currSite?.events?.length > 0 && (isMain ? paginatedEvents : currSite?.events?.slice(0, 6)).map((event, index) => (
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
        
        {/* Footer - Different based on isMain */}
        {totalEvents > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            {isMain ? (
              // Pagination for main view
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">
                    Showing {((currentPage - 1) * eventsPerPage) + 1} to {Math.min(currentPage * eventsPerPage, totalEvents)} of {totalEvents} events
                  </span>
                  <span className="text-sm text-text-secondary">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                
                {totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {renderPaginationItems()}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            ) : (
              // Original footer for non-main view
              <div className="flex flex-row-reverse justify-end gap-4 items-center">
                <span className="text-xs text-text-secondary">
                  Showing {displayedEvents} of {totalEvents} Events: <span className="text-xs font-medium text-text-primary">
                    {displayedEvents}/{totalEvents}
                  </span>
                </span>
                <div className="flex items-center gap-3">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/app/${siteId}/events`}>View All</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}