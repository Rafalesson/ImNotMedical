// Endereço: apps/frontend/src/app/dashboard/page.tsx (versão final com React Query)
'use client'; // 1. TRANSFORMAMOS A PÁGINA EM UM CLIENT COMPONENT

import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query'; // 2. IMPORTAMOS O useQuery
import { api } from '@/services/api'; // Importamos nossa instância do axios
import { CertificatesListSkeleton } from './certificates-list-skeleton'; // Reutilizamos nosso esqueleto

// Tipagem para os dados que esperamos
type Certificate = {
  id: string;
  purpose: string;
  issueDate: string;
  patient: {
    patientProfile: {
      name: string;
    } | null;
  } | null;
};

// Função que busca os dados, agora será chamada pelo React Query
const fetchCertificates = async (): Promise<Certificate[]> => {
  const { data } = await api.get('/certificates/my-certificates');
  return data;
};

export default function DashboardPage() {
  // 3. A MÁGICA DO REACT QUERY
  // Ele nos dá o estado de carregamento, erros e os dados, tudo em uma linha.
  const { 
    data: certificates, 
    isLoading, 
    isError 
  } = useQuery<Certificate[]>({
    queryKey: ['certificates'], // Uma chave única para esta busca de dados
    queryFn: fetchCertificates, // A função que ele deve executar
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      </div>
      
      {/* Os cards estáticos continuam os mesmos */}
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

      {/* 4. RENDERIZAÇÃO CONDICIONAL BASEADA NOS ESTADOS DO REACT QUERY */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Atestados Emitidos Recentemente</h2>
        
        {isLoading && <CertificatesListSkeleton />}

        {isError && <p className="text-red-500">Ocorreu um erro ao buscar os atestados.</p>}

        {!isLoading && !isError && (
          <div className="space-y-2">
            {certificates && certificates.length > 0 ? (
              certificates.map(cert => (
                <div key={cert.id} className="p-3 border-b last:border-b-0 hover:bg-gray-50 rounded-md">
                  <p className="font-semibold text-gray-800">
                    {cert.patient?.patientProfile?.name || 'Paciente não identificado'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Emitido em: {new Date(cert.issueDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 p-3">Nenhum atestado emitido recentemente.</p>
            )}
          </div>
        )}
      </div>
      
    </div>
  );
}