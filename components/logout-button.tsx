"use client"

import { supabase } from "@/lib/supabase/client"

export default function LogoutButton(){
    
    const handleLogout = async()=>{
        const {error}= await supabase.auth.signOut()
        
        if (error){
            console.error(error)
            return;
        }
        console.log("logged out")
    }
    
    return <button onClick={handleLogout}>Logout</button>
}