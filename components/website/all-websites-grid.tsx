"use client";

import { useUserSites } from "@/contexts/UserSites";
import { useState } from "react";
import Link from "next/link";
import { useUser } from "@/contexts/AuthContext";
import { makeFirstLetterUpperCase } from "@/lib/helpers/makeFirstLetterUpperCase";
import { Globe, Users, Calendar, ArrowRight } from "lucide-react";

export default function AllWebsitesGrid() {
    const { sites, loading, error: sitesError } = useUserSites()
    const [error, setError] = useState<string | null>(null)
    const { user, loading: userLoading } = useUser()

    if (!sites && !loading && !error)
        setError(`An Error occurred. Please refresh the page. Error: ${sitesError}`)

    if (error) {
        return (
            <div className="toast" style={{ 
                borderLeftColor: 'var(--color-danger)',
                backgroundColor: 'var(--color-danger-muted)'
            }}>
                <p className="text-sm font-medium" style={{ color: 'var(--color-danger)' }}>
                    Error Loading Websites
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {error}
                </p>
            </div>
        )
    }

    if (loading || userLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <div 
                        key={i} 
                        className="card animate-pulse"
                        style={{ backgroundColor: 'var(--bg-surface)' }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div 
                                className="w-10 h-10 rounded-lg"
                                style={{ backgroundColor: 'var(--color-border)' }}
                            ></div>
                            <div className="flex-1">
                                <div 
                                    className="h-4 rounded mb-2"
                                    style={{ backgroundColor: 'var(--color-border)' }}
                                ></div>
                                <div 
                                    className="h-3 rounded w-2/3"
                                    style={{ backgroundColor: 'var(--color-border)' }}
                                ></div>
                            </div>
                        </div>
                        <div 
                            className="h-10 rounded"
                            style={{ backgroundColor: 'var(--color-border)' }}
                        ></div>
                    </div>
                ))}
            </div>
        )
    }

    if (sites.length === 0) {
        return (
            <div className="text-center py-16">
                <div 
                    className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-primary-muted)' }}
                >
                    <Globe className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    No Websites yet
                </h3>
                <p className="text-base mb-8" style={{ color: 'var(--text-secondary)' }}>
                    Get started by creating your first Website to manage your websites and projects.
                </p>
                <Link href="/new">
                    <button className="button px-6 py-3 text-base font-medium">
                        Create your first Website
                    </button>
                </Link>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map(site => (
                <div 
                    key={site.id} 
                    className="card hover:shadow-lg transition-all duration-200 cursor-pointer group"
                    style={{ 
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--color-border)'
                    }}
                >
                    {/* Website Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200"
                            style={{ backgroundColor: 'var(--color-primary-muted)' }}
                        >
                            <Globe className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-display text-lg font-semibold truncate group-hover:text-primary transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>
                                {site.name || site.site_url}
                            </h3>
                        </div>
                    </div>

                    {/* Website Info */}
                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            <Users className="w-4 h-4" />
                            <span>{makeFirstLetterUpperCase(user?.plan_type) + " Plan" || "Free Plan"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            <Calendar className="w-4 h-4" />
                            <span>1 project</span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <Link href={`/app/${site.id}`} className="block">
                        <button 
                            className="w-full h-12 rounded-lg border-2 font-medium text-base transition-all duration-200 flex items-center justify-center gap-2 group-hover:border-primary group-hover:bg-primary-muted"
                            style={{ 
                                backgroundColor: 'transparent',
                                borderColor: 'var(--color-border)',
                                color: 'var(--text-primary)'
                            }}
                        >
                            <span>Open Website</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </button>
                    </Link>
                </div>
            ))}
        </div>
    )
}