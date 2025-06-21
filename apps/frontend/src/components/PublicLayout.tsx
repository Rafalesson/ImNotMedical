// Endereço: apps/frontend/src/components/PublicLayout.tsx (versão final com CSS Grid)
'use client';

import { Footer } from "./Footer";
import { Header } from "./Header";

export function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 1. O layout agora usa CSS Grid para organizar o cabeçalho, o conteúdo principal e o rodapé.
    // Isso permite que o cabeçalho e o rodapé tenham altura fixa, enquanto o conteúdo principal é rolável.
    <div className="grid h-screen grid-rows-[auto_1fr_auto] bg-gray-50">
      <Header />

      <main className="overflow-y-auto p-4 flex items-center justify-center">
        {children}
      </main>

      <Footer />
    </div>
  );
}