import { getCurrentUser } from "@/actions/users/getCurrentUser"
import Content from "./_components/content";

export default async function AppPage() {
    const user = await getCurrentUser()
    
    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-page)' }}>
            <div className="max-w-7xl mx-auto container">
                {/* Header */}
                <div className="mb-8 pt-4">
                    <h1 className="font-display text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Your Websites
                    </h1>
                    <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                        Welcome back{user?.first_name ? `, ${user.first_name}` : ''}! Choose a Website to continue.
                    </p>
                </div>

                <Content />
            </div>
        </div>
    )
}