// Endereço: apps/frontend/src/app/cadastro/paciente/page.tsx (versão com import corrigido)
'use client';

import { useState } from 'react';
import { PublicLayout } from '@/components/PublicLayout';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';

export default function PatientRegistrationPage() {
  // O estado do formulário
  const [formData, setFormData] = useState({
    name: '', cpf: '', dateOfBirth: '', sex: '', email: '', phone: '', 
    password: '', passwordConfirmation: '', street: '', number: '', 
    neighborhood: '', city: '', state: '', zipCode: '', complement: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prevData => ({ ...prevData, [e.target.name]: e.target.value }));
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
      await api.post('/users', { ...formData, role: 'PATIENT' });
      router.push('/login?status=success');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message: string | string[] }>;
        const errorMessage = axiosError.response?.data?.message || 'Ocorreu um erro ao criar a conta.';
        setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
      } else {
        setError('Ocorreu um erro inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const inputStyles = "mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400";
  const labelStyles = "block text-sm font-medium text-gray-700";

  return (
    <PublicLayout>
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-lg mb-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Crie sua Conta de Paciente</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Dados da Conta</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label htmlFor="email" className={labelStyles}>Email</label><input id="email" type="email" name="email" onChange={handleChange} required className={inputStyles}/></div>
              <div><label htmlFor="phone" className={labelStyles}>Telefone</label><input id="phone" type="tel" name="phone" onChange={handleChange} className={inputStyles}/></div>
              <div><label htmlFor="password" className={labelStyles}>Senha</label><input id="password" type="password" name="password" onChange={handleChange} required className={inputStyles}/></div>
              <div><label htmlFor="passwordConfirmation" className={labelStyles}>Confirmar Senha</label><input id="passwordConfirmation" type="password" name="passwordConfirmation" onChange={handleChange} required className={inputStyles}/></div>
            </div>
          </fieldset>
          <fieldset className="space-y-4">
            <legend className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Dados Pessoais</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><label htmlFor="name" className={labelStyles}>Nome Completo</label><input id="name" type="text" name="name" onChange={handleChange} required className={inputStyles}/></div>
              <div><label htmlFor="cpf" className={labelStyles}>CPF</label><input id="cpf" type="text" name="cpf" onChange={handleChange} required className={inputStyles}/></div>
              <div><label htmlFor="dateOfBirth" className={labelStyles}>Data de Nascimento</label><input id="dateOfBirth" type="date" name="dateOfBirth" onChange={handleChange} required className={inputStyles}/></div>
              <div>
                <label htmlFor="sex" className={labelStyles}>Sexo</label>
                <select id="sex" name="sex" onChange={handleChange} className={inputStyles} value={formData.sex}>
                  <option value="">Selecione...</option>
                  <option value="MALE">Masculino</option>
                  <option value="FEMALE">Feminino</option>
                  <option value="OTHER">Outro</option>
                </select>
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