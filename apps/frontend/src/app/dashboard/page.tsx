'use client';

import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { CertificatesListSkeleton } from './certificates-list-skeleton';

type CertificateApi = {
  id: string;
  issueDate: string;
  patient: {
    patientProfile: {
      name?: string | null;
    } | null;
  } | null;
};

type PrescriptionApi = {
  id: string;
  issueDate: string;
  patient: {
    patientProfile: {
      name?: string | null;
    } | null;
  } | null;
};

type RecentDocument = {
  id: string;
  issueDate: string;
  patientName: string;
  type: 'certificate' | 'prescription';
};

const fetchPatientCount = async (): Promise<{ count: number }> => {
  const { data } = await api.get('/patients/count');
  return data;
};

const fetchRecentDocuments = async (): Promise<RecentDocument[]> => {
  const [certificatesResponse, prescriptionsResponse] = await Promise.all([
    api.get<CertificateApi[]>('/certificates/recent'),
    api.get<PrescriptionApi[]>('/prescriptions/recent'),
  ]);

  const certificates: RecentDocument[] = (certificatesResponse.data ?? []).map(
    (cert) => ({
      id: `certificate-${cert.id}`,
      issueDate: cert.issueDate,
      patientName:
        cert.patient?.patientProfile?.name?.trim() ?? 'Paciente não identificado',
      type: 'certificate',
    }),
  );

  const prescriptions: RecentDocument[] = (
    prescriptionsResponse.data ?? []
  ).map((prescription) => ({
    id: `prescription-${prescription.id}`,
    issueDate: prescription.issueDate,
    patientName:
      prescription.patient?.patientProfile?.name?.trim() ??
      'Paciente não identificado',
    type: 'prescription',
  }));

  return [...certificates, ...prescriptions]
    .sort(
      (a, b) =>
        new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime(),
    )
    .slice(0, 5);
};

export default function DashboardPage() {
  const { data: patientData, isLoading: isLoadingCount } = useQuery({
    queryKey: ['patientCount'],
    queryFn: fetchPatientCount,
  });

  const {
    data: recentDocuments,
    isLoading: isLoadingDocuments,
    isError: isDocumentsError,
  } = useQuery({
    queryKey: ['recentDocuments'],
    queryFn: fetchRecentDocuments,
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
            <h2 className="text-lg font-semibold text-gray-700 text-center">Emitir Atestado</h2>
          </div>
        </Link>
        <Link href="/dashboard/receitas/novo" className="h-full">
          <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 h-full transition-colors">
            <PlusCircle className="w-12 h-12 text-green-500 mb-2" />
            <h2 className="text-lg font-semibold text-gray-700 text-center">Emitir Receita</h2>
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
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Documentos Emitidos Recentemente</h2>

        {isLoadingDocuments && <CertificatesListSkeleton />}

        {isDocumentsError && (
          <p className="text-red-500">Ocorreu um erro ao buscar os documentos.</p>
        )}

        {!isLoadingDocuments && !isDocumentsError && (
          <div className="space-y-2">
            {recentDocuments && recentDocuments.length > 0 ? (
              recentDocuments.map((document) => {
                const isCertificate = document.type === 'certificate';
                const accentClasses = isCertificate
                  ? 'border-l-4 border-blue-500/80 bg-blue-50/60'
                  : 'border-l-4 border-green-500/80 bg-green-50/60';
                const badgeClasses = isCertificate
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-green-100 text-green-700';
                const label = isCertificate ? 'Atestado' : 'Receita';
                const formattedDate = new Date(document.issueDate).toLocaleString(
                  'pt-BR',
                  {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  },
                );

                return (
                  <div
                    key={document.id}
                    className={`p-3 rounded-md transition border border-gray-200 hover:bg-white ${accentClasses}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {document.patientName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Emitido em: {formattedDate}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeClasses}`}>
                        {label}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 p-3">Nenhum documento emitido recentemente.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
