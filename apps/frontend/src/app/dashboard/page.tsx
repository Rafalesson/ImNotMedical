// Endereço: apps/frontend/src/app/dashboard/page.tsx (versão final após refatoração para middleware)
'use client';

// O 'useContext' e 'useRouter' foram removidos, pois não são mais necessários para a lógica de autenticação aqui.
import { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { api } from '@/services/api';
import Link from 'next/link';

// Definimos o tipo para o atestado para manter o código organizado.
type Certificate = {
  id: string;
  purpose: string;
  issueDate: string;
  // Adicione outros campos que a API retornar, se necessário.
};

export default function DashboardPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  // Podemos adicionar um estado de loading para os dados da página, se quisermos.
  const [isLoading, setIsLoading] = useState(true);

  // REMOVIDO: O 'useEffect' que verificava a autenticação e redirecionava. O middleware agora faz isso.

  // O componente agora foca apenas em buscar seus próprios dados e renderizar a UI.
  useEffect(() => {
    async function fetchCertificates() {
      setIsLoading(true);
      try {
        const response = await api.get('/certificates/my-certificates');
        setCertificates(response.data);
      } catch (error) {
        // Agora que temos um tratador de erro global, podemos pensar em como
        // lidar com erros de fetch de dados específicos da página.
        // Por enquanto, um log de erro é suficiente.
        console.error("Erro ao buscar atestados:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCertificates();
  }, []); // A lista de dependências está vazia, pois este fetch só precisa rodar uma vez.

  // REMOVIDO: A verificação 'if (!isAuthenticated) { return null; }'. O middleware garante que nunca chegaremos aqui sem autenticação.
  
  // Poderíamos mostrar um spinner enquanto os dados da página carregam.
  if (isLoading) {
    return <div>Carregando informações do dashboard...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
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
          {certificates.length > 0 ? (
            certificates.map(cert => (
              <div key={cert.id} className="p-2 border-b">
                {cert.purpose} - {new Date(cert.issueDate).toLocaleDateString()}
              </div>
            ))
          ) : (
            <p className="text-gray-500">Nenhum atestado emitido recentemente.</p>
          )}
        </div>
      </div>
    </div>
  );
}