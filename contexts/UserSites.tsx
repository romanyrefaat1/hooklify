"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./AuthContext";
import { supabase } from "@/lib/supabase/client";
import { UserSitesRow, EventRow } from "@/types/supabase-schemas";

export type UserSiteContext = UserSitesRow & {events: EventRow[]}

export type SitesContext = Array<UserSiteContext>

const UserSitesContext = createContext<{
    sites: SitesContext;
    loading: boolean;
    error: Error | null;
}| undefined>(undefined);

export default function UserSitesProvider ({children}: {children: React.ReactNode}){
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userSites, setUserSites] = useState<Array<UserSitesRow>>([]);
    const {user, loading: userLoading, error: userError} = useUser();

    useEffect(()=> {
        const fetchUserSites = async ()=> {

            if (userLoading) return;
            if (userError) {
                throw new Error(userError.message)
            }
            
            setLoading(true);
            try {
                const {data: sitesData, error: sitesError} = await supabase
                    .from('sites')
                    .select('*')
                    .eq('user_id', user?.id)

                console.log("from provider", sitesData)

                if (sitesError) {
                    setError(sitesError);
                    return;
                }
                if (!sitesData) {
                    setUserSites([]);
                    return;
                }
                // Fetch all events for these sites
                const siteIds = sitesData.map(site => site.id);
                let eventsData: any[] = [];
                if (siteIds.length > 0) {
                    const {data: events, error: eventsError} = await supabase
                        .from('events')
                        .select('*')
                        .in('site_id', siteIds);
                    if (eventsError) {
                        setError(eventsError);
                        return;
                    }
                    eventsData = events || [];
                }
                // Sort eventsData by timestamp descending (newest to oldest)
                eventsData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                // Attach events to each site
                const sitesWithEvents = sitesData.map((site: UserSitesRow) => ({
                    ...site,
                    events: eventsData.filter((event: any) => event.site_id === site.id)
                }));
                console.log("sitesWithEvents", sitesWithEvents)
                setUserSites(sitesWithEvents);
            } catch (error) {
                if (error instanceof Error) setError(error);
                else setError(new Error(String(error)));
            } finally {
                setLoading(false);
            }
        }
        fetchUserSites();
    },[user])

    return (
        <UserSitesContext.Provider
        value={{sites: userSites, loading, error}}
        >{children}</UserSitesContext.Provider>
    )
}

import { useParams } from "next/navigation";

export function useUserSites (){
    const ctx = useContext(UserSitesContext)
    if (!ctx) {
        throw new Error("useUserSites must be used within a UserSitesProvider")
    }
    const { siteId } = useParams() as { siteId?: string };
    const currSite = ctx.sites.find(site => site.id === siteId) as UserSiteContext | undefined;
    return { ...ctx, currSite };
}