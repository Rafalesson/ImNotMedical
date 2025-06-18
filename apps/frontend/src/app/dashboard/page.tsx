// src/app/dashboard/page.tsx (versão de depuração com botão de teste)
'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/contexts/AuthProvider';
import { PlusCircle } from 'lucide-react';
import { api } from '@/services/api';
import Link from 'next/link';

type Certificate = {
  id: string;
  purpose: string;
  issueDate: string;
};

export default function DashboardPage() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    async function fetchCertificates() {
      try {
        const response = await api.get('/certificates/my-certificates');
        setCertificates(response.data);
      } catch (error) {
        console.error("Erro ao buscar atestados:", error);
      }
    }
    fetchCertificates();
  }, [isAuthenticated, router]);

  // --- NOSSA NOVA FUNÇÃO DE TESTE ---
  const handleTestConnection = async () => {
    try {
      console.log('Testando conexão com o backend...');
      const response = await api.get('/'); // Tenta acessar a rota mais simples: "Hello World!"
      console.log('Conexão com o backend OK! Resposta:', response.data);
      alert('SUCESSO! A conexão com o backend está funcionando.');
    } catch (error) {
      console.error('FALHA na conexão com o backend:', error);
      alert('FALHA! A conexão com o backend não funcionou. Verifique o console.');
    }
  };
  
  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        {/* --- NOSSO NOVO BOTÃO DE TESTE --- */}
        <button 
          onClick={handleTestConnection}
          className="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600"
        >
          Testar Conexão Backend
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/dashboard/atestados/novo" className="h-full">
          <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 h-full">
            <PlusCircle className="w-12 h-12 text-blue-500 mb-2" />
            <h2 className="text-lg font-semibold text-gray-700">Emitir Novo Atestado</h2>
          </div>
        </Link>
        <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center justify-center">
          <h3 className="text-4xl font-bold text-gray-800">07</h3>
          <p className="text-gray-500">Consultas Hoje</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center justify-center">
          <h3 className="text-4xl font-bold text-gray-800">124</h3>
          <p className="text-gray-500">Total de Pacientes</p>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Atestados Emitidos Recentemente</h2>
        <div className="space-y-4">
          {/* ... lógica de exibir atestados ... */}
        </div>
      </div>
    </div>
  );
}