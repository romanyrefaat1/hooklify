import Dashboard from "@/components/dashboard/Dashboard";
import Sidebar from "@/components/dashboard/Sidebar";
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AppPage ({children}: {children: React.ReactNode}){
    return (
        <div className="app">
            {children}
        </div>
    )
}