// Endereço: apps/frontend/src/app/paciente/layout.tsx (versão com sticky footer)

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function PatientAreaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 1. O container principal usa flex-col e tem no mínimo a altura da tela (com dvh para mobile).
    <div className="flex flex-col min-h-[100dvh] bg-gray-50">
      <Header />
      
      {/* 2. A 'main' usa flex-grow para ocupar todo o espaço vertical que sobrar. */}
      <main className="flex-grow w-full">
        {children}
      </main>

      <Footer />
    </div>
  );
}