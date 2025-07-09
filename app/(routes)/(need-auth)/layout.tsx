import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AppLayout ({children}: {children: React.ReactNode}) {
    const supabase = await createClient()
    const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

    if (!authUser) redirect('/login')

    return (
        <div>
            {children}
        </div>
    )
}