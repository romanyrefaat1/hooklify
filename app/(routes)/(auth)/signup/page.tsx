"use client"

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmationPassword, setConfirmationPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleSignup = async(e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        if (email.trim().length === 0 || password.trim().length === 0){
            setError("Please fill the Email and Password fields")
        }
        if (password !== confirmationPassword) {
            setError("Passowrd and confirmation password do not match")
        }

        const {data, error} = await supabase.auth.signUp({email, password})
        
        if (error) {
            setError(`Error at signup: ${error.message} ${error.status}`)
            return;
        }
        
        router.push("/app")
    }

    return (
        <form onSubmit={e=> handleSignup(e)}>
            <input 
             placeholder="Email"
            type="email" value={email} onChange={(e)=> setEmail(e.target.value)} required/>
            <input placeholder="Password" 
            type="password" value={password} onChange={(e)=> setPassword(e.target.value)} required />
            <input placeholder="Confirmation Password" 
            type="password" value={confirmationPassword} onChange={(e)=> setConfirmationPassword(e.target.value)} required />
            <button type="submit">Sign up</button>
            {error && <span>{error}</span>}
        </form>
    )
    
}