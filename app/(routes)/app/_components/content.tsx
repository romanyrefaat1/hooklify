"use client";

import AllWebsitesGrid from "@/components/website/all-websites-grid";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import SearchInput from "@/components/search-input";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { SitesContext, useUserSites } from "@/contexts/UserSites";

export default function Content() {
    const {sites: allSites, loading, error} = useUserSites()
    const [sites, setSites] = useState<SitesContext>([])
    const searchParams = useSearchParams()
    const q = searchParams.get('q');

    useEffect(()=> {
        if (q) {
            const filteredSites = allSites.filter(site => site.name?.toLowerCase().includes(q.toLowerCase()))
            setSites(filteredSites)
        } else {
            setSites(allSites)
        }
    }, [q, allSites])
    
    return (
        <div>
            {/* Search and Add New */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
                {q}
                    <SearchInput />
                    <Link href="/new">
                        <button className="button h-12 px-6 flex items-center gap-2 font-medium text-base whitespace-nowrap">
                            <Plus className="w-4 h-4" />
                            New Website
                        </button>
                        {/* <Button variant={"default"}>
                            <Plus className="w-4 h-4" />
                            New Website
                        </Button> */}
                    </Link>
                </div>

                {/* Websites Grid */}
               {loading ? 
               <Skeleton 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"/> : error ? <p className="text-danger">{error.message}</p>
                : <AllWebsitesGrid sites={sites}/>}
        </div>
    )
}