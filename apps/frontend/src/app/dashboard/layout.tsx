// Endereço: apps/frontend/src/app/dashboard/layout.tsx (versão com dvh)
import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // MUDANÇA: trocamos h-screen por h-[100dvh]
    <div className="flex h-[100dvh] bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}