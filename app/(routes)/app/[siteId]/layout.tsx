import ClientLayout from "./_components/ClientLayout";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <ClientLayout>
        {children}
      </ClientLayout>
    </div>
  );
}