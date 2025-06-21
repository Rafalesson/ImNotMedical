// apps/frontend/src/app/layout.tsx (DEPOIS)

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthProvider';
import { Providers } from '@/components/providers'; // 1. IMPORTE O NOVO PROVIDER

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Zello - Cuidado Digital',
  description: 'Sua plataforma de telemedicina',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full bg-gray-100">
      <body className={`${inter.className} h-full`}>
        <Providers> {/* 2. ADICIONE O PROVIDERS ENVOLVENDO O AUTHPROVIDER */}
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}