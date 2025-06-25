// Endereço: apps/frontend/src/app/dashboard/page.tsx (versão final com React Query)
'use client';

import Link from 'next/link';
import { PlusCircle, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { CertificatesListSkeleton } from './certificates-list-skeleton';

// Definimos a tipagem para os dados que esperamos da API
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

// --- Funções de Busca de Dados ---
// Cada função busca um dado específico e será usada por um hook 'useQuery'
const fetchPatientCount = async (): Promise<{ count: number }> => {
  const { data } = await api.get('/patients/count');
  return data;
};

const fetchRecentCertificates = async (): Promise<Certificate[]> => {
  const { data } = await api.get('/certificates/my-certificates');
  return data;
};


export default function DashboardPage() {
  // 1. Hook para buscar a contagem de pacientes
  const { data: patientData, isLoading: isLoadingCount } = useQuery({
    queryKey: ['patientCount'],
    queryFn: fetchPatientCount,
  });

  // 2. Hook para buscar a lista de atestados
  const { data: certificates, isLoading: isLoadingCertificates, isError: isCertificatesError } = useQuery({
    queryKey: ['recentCertificates'],
    queryFn: fetchRecentCertificates,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/dashboard/atestados/novo" className="h-full">
          <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 h-full transition-colors">
            <PlusCircle className="w-12 h-12 text-blue-500 mb-2" />
            <h2 className="text-lg font-semibold text-gray-700 text-center">Emitir Novo Atestado</h2>
          </div>
        </Link>
        <Link href="#" className="h-full">
          <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 h-full transition-colors">
            <PlusCircle className="w-12 h-12 text-green-500 mb-2" />
            <h2 className="text-lg font-semibold text-gray-700 text-center">Emitir Nova Receita</h2>
          </div>
        </Link>
        <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center justify-center h-full">
          <h3 className="text-4xl font-bold text-gray-800">07</h3>
          <p className="text-gray-500">Consultas Hoje</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center justify-center h-full">
          {isLoadingCount ? (
             <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />
          ) : (
            <h3 className="text-4xl font-bold text-gray-800">{patientData?.count ?? 0}</h3>
          )}
          <p className="text-gray-500 mt-2">Total de Pacientes</p>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Atestados Emitidos Recentemente</h2>
        
        {/* Renderização Condicional para a lista de atestados */}
        {isLoadingCertificates && <CertificatesListSkeleton />}
        
        {isCertificatesError && <p className="text-red-500">Ocorreu um erro ao buscar os atestados.</p>}

        {!isLoadingCertificates && !isCertificatesError && (
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