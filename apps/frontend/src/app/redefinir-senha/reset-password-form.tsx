// Endereço: apps/frontend/src/app/redefinir-senha/reset-password-form.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/services/api';

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Se não houver token na URL, redireciona para o login após um momento
  useEffect(() => {
    if (!token) {
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    }
  }, [token, router]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (password !== passwordConfirmation) {
      setError('As senhas não coincidem.');
      return;
    }
    if (!token) {
      setError('Token de redefinição inválido ou ausente.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/password/reset', {
        token,
        password,
        passwordConfirmation,
      });
      setSuccess(response.data.message);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ocorreu um erro. Tente novamente.';
      setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  // Se o token não existir, mostra uma mensagem de erro
  if (!token) {
    return (
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <h1 className="text-xl font-bold text-red-600">Token Inválido</h1>
        <p className="mt-4 text-gray-600">O link de redefinição de senha é inválido ou expirou. Você será redirecionado em breve.</p>
      </div>
    );
  }

  // Se a senha foi redefinida com sucesso, mostra a mensagem de sucesso
  if (success) {
    return (
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        <h1 className="text-2xl font-bold text-green-600">Senha Redefinida!</h1>
        <p className="mt-4 text-gray-600">{success}</p>
        <Link href="/login" className="mt-6 inline-block font-semibold text-blue-600 hover:text-blue-500">
          Ir para o Login
        </Link>
      </div>
    );
  }

  // Formulário principal de redefinição de senha
  return (
    <div className="w-full max-w-md rounded-lg bg-white px-8 py-12 shadow-lg">
      <div className="text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-800">Crie sua nova senha</h1>
        <p className="mb-6 text-gray-500">Escolha uma senha forte e segura.</p>
      </div>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="password" className="block text-left text-sm font-medium text-gray-700 mb-2">Nova Senha</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border border-gray-300 p-3 text-gray-900" required />
        </div>
        <div>
          <label htmlFor="passwordConfirmation" className="block text-left text-sm font-medium text-gray-700 mb-2">Confirmar Nova Senha</label>
          <input id="passwordConfirmation" type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} className="w-full rounded-md border border-gray-300 p-3 text-gray-900" required />
        </div>
        {error && (
          <div className="rounded-md bg-red-50 p-3">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-blue-600 py-3 text-white font-semibold shadow-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Salvando...' : 'Redefinir Senha'}
        </button>
      </form>
    </div>
  );
}