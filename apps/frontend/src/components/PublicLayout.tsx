// Endereço: apps/frontend/src/components/PublicLayout.tsx
'use client';

import { Footer } from "./Footer";
import { Header } from "./Header";

export function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex flex-col flex-grow pt-[var(--header-height)-1]">
        <div className="flex-grow flex items-center justify-center p-4">
            {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}