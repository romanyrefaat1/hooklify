"use client"

import { useUser } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { user } = useUser();

    const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email.trim().length === 0 || password.trim().length === 0) {
            setError("Please fill the Email and Password fields");
            return;
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setError(`Error at login: ${error.message} (${error.status})`);
            console.error("Error at sign in:", error);
            return;
        }

        router.push("/app/redirect");
    };

    return (
        <form onSubmit={handleSignup}>
            <input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Sign in</button>
            {error && <span>{error}</span>}
        </form>
    );
}
