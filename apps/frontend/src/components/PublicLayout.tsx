// Endereço: apps/frontend/src/components/PublicLayout.tsx (versão com dvh)
'use client';

import { Footer } from "./Footer";
import { Header } from "./Header";

export function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // MUDANÇA: trocamos min-h-screen por min-h-[100dvh]
    <div className="flex flex-col min-h-[100dvh] bg-gray-50">
      <Header />
      <main className="flex flex-col flex-grow">
        <div className="flex-grow flex items-center justify-center p-4">
            {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}