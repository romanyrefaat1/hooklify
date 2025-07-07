import Dashboard from "@/components/dashboard/Dashboard";
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AppPage (){
    const supabase = await createClient()
    const {
        data: { user },
      } = await supabase.auth.getUser();

    if (!user) redirect('/login')
  

    return (
        <div>
            {/* App Page */}
            <Dashboard />
        </div>
    )
}