import DashboardRecentLogs from "@/components/dashboard/DashboardRecentLogs";

export default function EventsPage() {
    

    return (
        <div className="container">
            <h1 className="mb-4">All Events</h1>
            <DashboardRecentLogs isMain={true}  />
        </div>
    )
}