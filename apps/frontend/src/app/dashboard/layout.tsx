// Endereço: apps/frontend/src/app/dashboard/layout.tsx (versão corrigida)
import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // A estrutura com 'h-screen' garante que o layout ocupe a tela inteira.
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      {/* 'flex-grow' e 'overflow-auto' garantem que a área principal ocupe o espaço
          restante e tenha rolagem própria, sem sobrepor a sidebar. */}
      <main className="flex-grow p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}