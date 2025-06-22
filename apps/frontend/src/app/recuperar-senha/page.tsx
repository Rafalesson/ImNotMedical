// Endereço: apps/frontend/src/app/recuperar-senha/page.tsx (versão limpa)
'use client';

import { useState } from 'react';
import { PublicLayout } from '@/components/PublicLayout';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await api.post('/auth/password/forgot', { email });
      setMessage({ type: 'success', text: response.data.message });
    } catch (err) {
      console.error('Erro ao solicitar recuperação de senha:', err);
      setMessage({ type: 'error', text: 'Ocorreu um erro ao enviar a solicitação. Tente novamente mais tarde.' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PublicLayout>
      <div className="w-full max-w-md">
        {message?.type === 'success' ? (
          <div className="relative rounded-lg bg-white p-8 text-center shadow-lg">
            <Link href="/login" className="absolute top-6 left-6 p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className='py-8'>
              <h1 className="text-2xl font-bold text-gray-800">Verifique seu e-mail</h1>
              <p className="mt-4 text-gray-600">{message.text}</p>
            </div>
          </div>
        ) : (
          <div className="relative rounded-lg bg-white px-8 py-12 shadow-lg">
            <Link 
              href="/login" 
              className="absolute top-6 left-6 p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
              aria-label="Voltar para o login"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="text-center">
              <h1 className="mb-2 text-2xl font-bold text-gray-800">Recuperar sua senha</h1>
              <p className="mb-6 text-gray-500">
                Sem problemas! Digite seu e-mail abaixo e enviaremos um link para você criar uma nova senha.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="block text-left text-sm font-medium text-gray-700 mb-2">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-gray-300 p-3 text-gray-900" required />
              </div>
              {message?.type === 'error' && (
                <p className="text-sm font-medium text-red-700">{message.text}</p>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-blue-600 py-3 text-white font-semibold shadow-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
              </button>
            </form>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}