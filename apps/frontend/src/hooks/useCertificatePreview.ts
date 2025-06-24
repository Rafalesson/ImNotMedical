// Endereço: apps/frontend/src/hooks/useCertificatePreview.ts (versão com erro detalhado)

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCertificateStore } from '@/stores/certificateStore';
import { api } from '@/services/api';

export function useCertificatePreview() {
  const router = useRouter();
  const { formData } = useCertificateStore();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!formData) {
      router.replace('/dashboard/atestados/novo');
      return;
    }

    const fetchPreview = async () => {
      setIsLoading(true);
      try {
        const response = await api.post('/certificates/preview', formData, {
          responseType: 'blob',
        });
        const url = URL.createObjectURL(response.data);
        setPdfUrl(url);
      } catch (error: any) {
        console.error('Erro ao gerar preview do PDF:', error);
        
        // O erro do axios para 'blob' é um pouco diferente, precisamos ler a resposta
        // como texto para ver a mensagem de erro JSON que o backend enviou.
        if (error.response && error.response.data instanceof Blob) {
          error.response.data.text().then((text: string) => {
            try {
              const parsedError = JSON.parse(text);
              alert(`Erro: ${parsedError.message || 'Não foi possível gerar a pré-visualização.'}`);
            } catch (e) {
              alert('Não foi possível gerar a pré-visualização. Ocorreu um erro inesperado.');
            }
          });
        } else {
          const errorMessage = error.response?.data?.message || 'Não foi possível gerar a pré-visualização.';
          alert(`Erro: ${errorMessage}`);
        }

        router.push('/dashboard/atestados/novo');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreview();

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [formData, router]); 

  return { isLoading, pdfUrl, formData };
}