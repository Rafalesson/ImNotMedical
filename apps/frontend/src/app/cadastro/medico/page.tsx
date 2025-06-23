// Endereço: apps/frontend/src/app/cadastro/medico/page.tsx (versão corrigida sem import do Prisma)
'use client';

import { useState } from 'react';
import { PublicLayout } from '@/components/PublicLayout';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';

export default function DoctorRegistrationPage() {
  const [formData, setFormData] = useState({
    name: '',
    crm: '',
    specialty: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirmation: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirmation) {
      setError('As senhas não coincidem.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      // Adicionamos o campo 'role' com o valor de texto 'DOCTOR' diretamente
      // no objeto que enviamos para a API.
      await api.post('/users', {
        ...formData,
        role: 'DOCTOR', // Enviamos a string, e o backend (que conhece o Enum) cuidará da conversão.
      });
      
      router.push('/login?status=success');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ocorreu um erro ao criar a conta.';
      setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Cadastro de Médico(a)</h1>
        <form onSubmit={handleSubmit} className="space-y-6">

          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Dados da Conta</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <input type="email" name="email" onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Telefone</label>
                <input type="tel" name="phone" onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Senha</label>
                <input type="password" name="password" onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Confirmar Senha</label>
                <input type="password" name="passwordConfirmation" onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Perfil Profissional</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-gray-600">Nome Completo</label>
                <input type="text" name="name" onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">CRM</label>
                <input type="text" name="crm" onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
              </div>
               <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600">Especialidade</label>
                <input type="text" name="specialty" onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
              </div>
            </div>
          </fieldset>
          
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Endereço do Consultório (Opcional)</legend>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="md:col-span-4">
                <label className="block text-sm font-medium text-gray-600">Rua / Logradouro</label>
                <input type="text" name="street" onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
              </div>
               <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600">Número</label>
                <input type="text" name="number" onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
              </div>
               <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-600">Bairro</label>
                <input type="text" name="neighborhood" onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
              </div>
               <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-600">Cidade</label>
                <input type="text" name="city" onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
              </div>
               <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600">Estado (UF)</label>
                <input type="text" name="state" maxLength={2} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
              </div>
               <div className="md:col-span-4">
                <label className="block text-sm font-medium text-gray-600">CEP</label>
                <input type="text" name="zipCode" onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"/>
              </div>
            </div>
          </fieldset>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={isLoading} className="w-full rounded-md bg-blue-600 py-3 text-white font-semibold shadow-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300">
            {isLoading ? 'Criando conta...' : 'Finalizar Cadastro'}
          </button>
        </form>
      </div>
    </PublicLayout>
  );
}