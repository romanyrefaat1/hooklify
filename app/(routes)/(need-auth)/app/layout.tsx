import UserSitesProvider from "@/contexts/UserSites";

export default async function AppLayout ({children}: {children: React.ReactNode}) {
    return (
        <UserSitesProvider>
            {children}
        </UserSitesProvider>
    )
}