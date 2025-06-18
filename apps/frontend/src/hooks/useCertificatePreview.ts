// src/hooks/useCertificatePreview.ts
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
    // Se não houver dados no armazém, redireciona de volta para o formulário.
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
      } catch (error) {
        console.error('Erro ao gerar preview do PDF:', error);
        alert('Não foi possível gerar a pré-visualização.');
        router.push('/dashboard/atestados/novo'); // Volta ao form em caso de erro
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreview();

    // Função de limpeza para evitar vazamento de memória no navegador
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
    // A lista de dependências agora é segura e não causa loops
  }, [formData, router]);

  return { isLoading, pdfUrl, formData };
}