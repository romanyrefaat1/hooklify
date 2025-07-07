// Server Component: Recent Logs Table
interface Log {
  id: string;
  createdOn: string;
  type: string;
}

interface DashboardRecentLogsProps {
  recentLogs: Log[];
}

export default function DashboardRecentLogs({ recentLogs }: DashboardRecentLogsProps) {
  return (
    <div className="fade-in">
      <h2 className="text-2xl font-bold text-text-primary mb-6 font-display tracking-tight">
        Your recent logs
      </h2>
      <div className="hooklify-card">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-text-primary text-sm uppercase tracking-wider">ID</th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary text-sm uppercase tracking-wider">Created On</th>
                <th className="text-left py-4 px-4 font-semibold text-text-primary text-sm uppercase tracking-wider">Type</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.map((log, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-text-secondary font-mono text-sm">{log.id}</td>
                  <td className="py-4 px-4 text-text-secondary font-mono text-sm">{log.createdOn}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-color-primary-muted text-color-primary-dark">
                      {log.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
