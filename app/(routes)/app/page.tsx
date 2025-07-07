import { getCurrentUser } from "@/actions/users/getCurrentUser"
import { Input } from "@/components/ui/input";
import AllWebsitesGrid from "@/components/website/all-websites-grid";
import Link from "next/link";
import { Search, Plus } from "lucide-react";

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
                        Welcome back{user?.first_name ? `, ${user.first_name}` : ''}! Choose an Website to continue.
                    </p>
                </div>

                {/* Search and Add New */}
                <div className="mb-8 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                        <Input 
                            type="search" 
                            placeholder="Search for an Website"
                            className="pl-10 h-12 text-base border-2 transition-all duration-200 focus:border-2"
                            style={{ 
                                backgroundColor: 'var(--bg-surface)',
                                borderColor: 'var(--color-border)',
                                color: 'var(--text-primary)'
                            }}
                        />
                    </div>
                    <Link href="/new">
                        <button className="button h-12 px-6 flex items-center gap-2 font-medium text-base whitespace-nowrap">
                            <Plus className="w-4 h-4" />
                            New Website
                        </button>
                    </Link>
                </div>

                {/* Websites Grid */}
                <AllWebsitesGrid />
            </div>
        </div>
    )
}