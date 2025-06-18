// src/components/Header.tsx
'use client';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
        <Link href="/" className="-m-1.5 p-1.5">
          <span className="text-2xl font-bold text-gray-800 tracking-tight">Zello</span>
        </Link>
        {/* No futuro, podemos adicionar aqui um botão de Login/Logout */}
      </nav>
    </header>
  );
}