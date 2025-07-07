"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./AuthContext";
import { supabase } from "@/lib/supabase/client";
import { UserSitesRow } from "@/types/supabase-schemas";

const UserSitesContext = createContext<{
    sites: Array<UserSitesRow>;
    loading: boolean;
    error: Error | null;
}| undefined>(undefined);

export default function UserSitesProvider ({children}: {children: React.ReactNode}){
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userSites, setUserSites] = useState<Array<UserSitesRow>>([]);
    const {user} = useUser();

    useEffect(()=> {
        const fetchUserSites = async ()=> {
            setLoading(true);
            try {
                const {data, error} = await supabase
                    .from('sites')
                    .select('*')
                    .eq('user_id', user.id)

                if (error) setError(error);
                else setUserSites(data);
            } catch (error) {
                setError(error);
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

export function useUserSites (){
    const ctx = useContext(UserSitesContext)
    if (!ctx) {
        throw new Error("useUserSites must be used within a UserSitesProvider")
    }
    return ctx;
}