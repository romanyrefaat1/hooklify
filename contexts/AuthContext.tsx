"use client"

import { supabase } from "@/lib/supabase/client";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
    id: string
    email: string
} | null

const AuthContext = createContext<{
    user: User
    loading: boolean
    isSignedIn: boolean;
}>({
    user: null,
    loading: true,
    isSignedIn: false,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>(null)
    const [loading, setLoading] = useState(true)
    const isSignedIn = user !== null;

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const {
                    data: { user: authUser },
                } = await supabase.auth.getUser()

                if (authUser) {

                    // Get user with user.id === authUser.id
                    const { data: user } = await supabase.from('users').select().eq('id', authUser.id).single()
                    
                    setUser({
                        id: authUser.id,
                        email: authUser.email!,
                    })
                } else {
                    setUser(null)
                }
            } catch (error) {
                console.error('Error getting user:', error)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        getCurrentUser()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({
                    id: session.user.id, // This is now the same as users.id
                    email: session.user.email!,
                })
            } else {
                setUser(null)
            }
            setLoading(false)
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading, isSignedIn }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useUser = () => {
    const ctx = useContext(AuthContext)

    if (!ctx) {
        throw new Error("useUser must be used within an AuthProvider")
    }

    return ctx;
}