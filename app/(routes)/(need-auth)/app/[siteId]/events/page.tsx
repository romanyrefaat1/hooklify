import DashboardRecentLogs from "@/components/dashboard/DashboardRecentLogs";

export default async function EventsPage({params}) {
    const {siteId} = await params
    const { data:currSiteEvents, error } = await supabase
  .from('widgets')
  .select('*')
  .eq('site_id', siteId)

    return (
        <div className="my-container">
            <h1 className="mb-4">All Events</h1>
            <DashboardRecentLogs isMain={true} currSiteEvents={currSiteEvents}  />
        </div>
    )
}