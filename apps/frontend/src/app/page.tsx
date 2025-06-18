// src/app/page.tsx (página de login usando o PublicLayout)
'use client';

import { PublicLayout } from "@/components/PublicLayout";
import { useContext, useState } from 'react';
import { AuthContext } from '@/contexts/AuthProvider';
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useContext(AuthContext);
  const router = useRouter();

  async function handleSignIn(event: React.FormEvent) {
    event.preventDefault();
    try {
      await signIn({ email, password });
      router.push('/dashboard');
    } catch (error) {
      alert('Falha no login. Verifique suas credenciais.');
      console.error(error);
    }
  }

  return (
    <PublicLayout>
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md">
            <div className="p-8 bg-white rounded-lg shadow-md space-y-6">
                <h1 className="text-center text-3xl font-bold text-gray-800">
                    Acesse sua conta
                </h1>
                <form onSubmit={handleSignIn} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-gray-300 p-3 text-gray-900" required />
                    </div>
                    <div>
                        <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">Senha</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border border-gray-300 p-3 text-gray-900" required />
                    </div>
                    <button type="submit" className="w-full rounded-md bg-blue-600 py-3 text-white font-semibold shadow-lg hover:bg-blue-700">
                        Entrar
                    </button>
                </form>
            </div>
        </div>
      </div>
    </PublicLayout>
  );
}