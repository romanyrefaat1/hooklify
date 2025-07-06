"use client"

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SignupPage() {
    const [email, setEmail] = useState("refaatromany641@gmail.com");
    const [password, setPassword] = useState("Oppooldx1--");
    const [confirmationPassword, setConfirmationPassword] = useState("Oppooldx1--");
    const [firstName, setFirstName] = useState("Romany");
    const [lastName, setLastName] = useState("Refaat");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!email.trim() || !password.trim() || !firstName.trim() || !lastName.trim()) {
            setError("Please fill in all required fields");
            setLoading(false);
            return;
        }

        if (password !== confirmationPassword) {
            setError("Password and confirmation password do not match");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        full_name: `${firstName} ${lastName}`
                    }
                }
            });

            if (error) {
                setError(`Error at signup: ${error.message}`);
                setLoading(false);
                return;
            }

            if (data.user) {
                // The trigger will handle creating the user record automatically
                // with the metadata we passed in options.data
                
                if (!data.session) {
                    setError("Please check your email to confirm your account");
                    setLoading(false);
                    return;
                }

                router.push("/app");
            }
        } catch (err) {
            console.error("Signup error:", err);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSignup}>
            <input
                placeholder="First Name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={loading}
            />
            <input
                placeholder="Last Name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={loading}
            />
            <input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
            />
            <input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
            />
            <input
                placeholder="Confirmation Password"
                type="password"
                value={confirmationPassword}
                onChange={(e) => setConfirmationPassword(e.target.value)}
                required
                disabled={loading}
            />
            <button type="submit" disabled={loading}>
                {loading ? "Signing up..." : "Sign up"}
            </button>
            {error && <span style={{ color: 'red' }}>{error}</span>}
        </form>
    );
}