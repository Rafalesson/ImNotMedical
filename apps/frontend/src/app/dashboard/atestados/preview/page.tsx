// src/app/dashboard/atestados/preview/page.tsx (versão final sem o botão de rascunho)
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { CheckCircle, XCircle, Loader2, Download, Home } from 'lucide-react';
import { ValidationResult } from '@/components/ValidationResult'; // Supondo que você criou este componente

export default function PreviewPage() {
  const router = useRouter();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [finalCertificate, setFinalCertificate] = useState(null);

  const handleConfirmAndIssue = useCallback(async () => {
    const savedDataString = sessionStorage.getItem('certificateFormData');
    if (!savedDataString) {
      alert('Não foi possível encontrar os dados do formulário. Por favor, tente novamente.');
      router.push('/dashboard/atestados/novo');
      return;
    }
    const formData = JSON.parse(savedDataString);
    const dtoForCreation = {
      patientId: formData.patient.userId,
      purpose: formData.purpose,
      durationInDays: formData.durationInDays,
      cidCode: formData.cid?.code,
    };

    setIsSubmitting(true);
    try {
      const response = await api.post('/certificates', dtoForCreation);
      setFinalCertificate(response.data); // Salva os dados do atestado final
      sessionStorage.removeItem('certificateFormData');
    } catch (error) {
      console.error('Erro ao emitir atestado:', error);
      alert('Falha ao emitir o atestado final.');
    } finally {
      setIsSubmitting(false);
    }
  }, [router]);

  useEffect(() => {
    const savedDataString = sessionStorage.getItem('certificateFormData');
    if (!savedDataString) {
      router.replace('/dashboard/atestados/novo');
      return;
    }
    const formData = JSON.parse(savedDataString);
    const dtoForPreview = {
      patientId: formData.patient.userId,
      purpose: formData.purpose,
      durationInDays: formData.durationInDays,
      cidCode: formData.cid?.code,
    };

    const fetchPreview = async () => {
      setIsLoading(true);
      try {
        const response = await api.post('/certificates/preview', dtoForPreview, {
          responseType: 'blob',
        });
        const url = URL.createObjectURL(response.data);
        setPdfUrl(url);
      } catch (error) {
        console.error('Erro ao gerar preview do PDF:', error);
        alert('Não foi possível gerar a pré-visualização.');
        router.push('/dashboard/atestados/novo');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPreview();
  }, [router]);

  const handleEdit = () => {
    router.push('/dashboard/atestados/novo');
  };

  if (finalCertificate) {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3333';
    const downloadUrl = `${backendUrl}${finalCertificate.pdfUrl}`;
    return (
      <div className="flex flex-col items-center justify-center text-center p-8">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-2xl font-bold text-gray-800">Atestado Emitido com Sucesso!</h1>
        <p className="mt-2 text-gray-600">O documento foi salvo e está pronto para ser baixado.</p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a href={downloadUrl} download target="_blank" rel="noopener noreferrer" className="flex items-center justify-center rounded-md bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-700">
                <Download className="mr-2" size={20}/> Baixar Atestado Final
            </a>
            <button onClick={() => router.push('/dashboard')} className="flex items-center justify-center rounded-md bg-gray-600 px-6 py-3 text-white font-semibold hover:bg-gray-700">
                <Home className="mr-2" size={20}/> Voltar para o Dashboard
            </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Pré-visualização e Ações</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="animate-spin text-blue-500" size={48} />
          <p className="ml-4 text-gray-600">Gerando pré-visualização...</p>
        </div>
      ) : (
        <div className="border rounded-lg shadow-md overflow-hidden bg-gray-200">
          <iframe src={pdfUrl || ''} width="100%" height="800px" title="Preview do Atestado"/>
        </div>
      )}
      <div className="mt-8 flex justify-end space-x-4">
        <button
          onClick={handleEdit}
          disabled={isSubmitting || isLoading}
          className="flex items-center rounded-md bg-gray-600 px-6 py-2 text-white font-semibold hover:bg-gray-700 disabled:opacity-50"
        >
          <XCircle className="mr-2" size={20}/> Editar
        </button>
        {/* O BOTÃO DE BAIXAR RASCUNHO FOI REMOVIDO DAQUI */}
        <button
          onClick={handleConfirmAndIssue}
          disabled={isSubmitting || isLoading}
          className="flex items-center rounded-md bg-blue-600 px-6 py-2 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          <CheckCircle className="mr-2" size={20}/>
          {isSubmitting ? 'Emitindo...' : 'Confirmar e Emitir'}
        </button>
      </div>
    </div>
  );
}