// Endereço: apps/frontend/src/app/dashboard/atestados/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Search, Download, Trash2, Loader2, AlertTriangle, Eye } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { useDebounce } from '@/hooks/useDebounce';

type Certificate = {
  id: string;
  issueDate: string;
  patient: {
    patientProfile: {
      name: string;
    } | null;
  } | null;
  pdfUrl: string;
};

type ApiResponse = {
  data: Certificate[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export default function CertificateHistoryPage() {
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const debouncedSearchTerm = useDebounce(inputValue, 500);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  
  const headerCheckboxRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<ApiResponse>({
    queryKey: ['certificateHistory', page, debouncedSearchTerm],
    queryFn: async () => {
      const { data } = await api.get('/certificates/my-certificates', {
        params: {
          page,
          limit: 10,
          patientName: debouncedSearchTerm,
        },
      });
      return data;
    },
    // MODIFICAÇÃO: 'keepPreviousData' trocado por 'placeholderData' para a sintaxe da v5
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
    setSelectedIds([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);


  const batchDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => api.delete('/certificates/batch/delete', { data: { ids } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificateHistory'] });
      setSelectedIds([]);
    },
    onError: (error) => {
      console.error("Erro ao deletar atestados em lote:", error);
      alert("Falha ao deletar os atestados selecionados.");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (certificateId: string) => {
      return api.delete(`/certificates/${certificateId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificateHistory'] });
    },
    onError: (error) => {
      console.error("Erro ao deletar atestado:", error);
      alert("Falha ao deletar o atestado. Tente novamente.");
    }
  });

  useEffect(() => {
    if (headerCheckboxRef.current) {
      const numSelected = selectedIds.length;
      const numItemsOnPage = data?.data.length ?? 0;
      headerCheckboxRef.current.checked = numSelected === numItemsOnPage && numItemsOnPage > 0;
      headerCheckboxRef.current.indeterminate = numSelected > 0 && numSelected < numItemsOnPage;
    }
  }, [selectedIds, data]);


  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const allIdsOnPage = data?.data.map(cert => cert.id) ?? [];
      setSelectedIds(allIdsOnPage);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };
  
  const handleOpenPreview = (pdfUrl: string) => {
    setPreviewPdfUrl(pdfUrl);
    setIsPreviewModalOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewModalOpen(false);
    setPreviewPdfUrl(null);
  };

  const openBatchDeleteModal = () => {
    if (selectedIds.length > 0) {
      setCertificateToDelete(null); 
      setIsDeleteModalOpen(true);
    }
  };

  const openSingleDeleteModal = (certificateId: string) => {
    setCertificateToDelete(certificateId);
    setSelectedIds([]);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (certificateToDelete) {
      deleteMutation.mutate(certificateToDelete);
    } 
    else if (selectedIds.length > 0) {
      batchDeleteMutation.mutate(selectedIds);
    }
    closeDeleteModal();
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCertificateToDelete(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={4} className="text-center p-6">
            <div className="flex justify-center items-center">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          </td>
        </tr>
      );
    }
    if (isError) {
      return (
        <tr>
          <td colSpan={4} className="text-center p-6 text-red-500">Erro ao carregar atestados. Tente novamente.</td>
        </tr>
      );
    }
    if (data?.data.length === 0) {
      return (
        <tr>
          <td colSpan={4} className="text-center p-6 text-gray-500">Nenhum atestado encontrado.</td>
        </tr>
      );
    }

    return data?.data.map((cert) => (
      <tr key={cert.id} className={selectedIds.includes(cert.id) ? 'bg-blue-50' : ''}>
        <td className="px-6 py-4">
          <input
            type="checkbox"
            checked={selectedIds.includes(cert.id)}
            onChange={(e) => handleSelectOne(cert.id, e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {cert.patient?.patientProfile?.name || 'N/A'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {new Date(cert.issueDate).toLocaleDateString('pt-BR')}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
          <button
            onClick={() => handleOpenPreview(cert.pdfUrl)}
            className="text-gray-600 hover:text-gray-900 inline-flex items-center"
            title="Visualizar Atestado"
          >
            <Eye className="mr-1 h-4 w-4" />
            Visualizar
          </button>
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}${cert.pdfUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-900 inline-flex items-center"
            title="Baixar Atestado"
          >
            <Download className="mr-1 h-4 w-4" />
            Baixar
          </a>
          <button
            onClick={() => openSingleDeleteModal(cert.id)}
            disabled={deleteMutation.isLoading}
            className="text-red-600 hover:text-red-900 inline-flex items-center disabled:opacity-50"
            title="Excluir Atestado"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Excluir
          </button>
        </td>
      </tr>
    ));
  };


  return (
    <div>
      {/* O botão foi removido daqui */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Histórico de Atestados</h1>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Buscar por nome do paciente..."
            className="w-full p-3 pl-10 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* O botão de exclusão em lote agora vive aqui, ao lado do checkbox */}
              <th className="px-6 py-3 text-left">
                <div className="flex items-center gap-x-3">
                  <input
                    type="checkbox"
                    ref={headerCheckboxRef}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  {selectedIds.length > 0 && (
                    <button
                      onClick={openBatchDeleteModal}
                      className="p-1 text-red-600 rounded-full hover:bg-red-100 disabled:opacity-50"
                      disabled={batchDeleteMutation.isLoading}
                      title={`Excluir ${selectedIds.length} atestado(s)`}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Emissão</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {renderContent()}
          </tbody>
        </table>
      </div>

      {data && data.total > 0 && (
        <div className="mt-6 flex justify-between items-center">
            <div>
            <p className="text-sm text-gray-700">
                Página <span className="font-medium">{data.page}</span> de <span className="font-medium">{data.totalPages}</span>
            </p>
            </div>
            <div className="flex gap-2">
            <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1 || isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
                Anterior
            </button>
            <button
                onClick={() => setPage(p => p + 1)}
                disabled={page === data.totalPages || isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
                Próximo
            </button>
            </div>
        </div>
      )}

      <Modal
        isOpen={isPreviewModalOpen}
        onClose={handleClosePreview}
        title="Visualização do Atestado"
        maxWidth="max-w-4xl"
      >
        {previewPdfUrl ? (
          <iframe 
            src={`${process.env.NEXT_PUBLIC_API_URL}${previewPdfUrl}`}
            className="w-full h-[75vh] border-0"
            title="Preview do Atestado"
          />
        ) : (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="ml-4">Carregando preview...</p>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        title="Confirmar Exclusão"
        maxWidth="max-w-lg"
      >
        <div className="mt-2">
            <div className="flex items-start gap-4">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0">
                    <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
                <div>
                    <p className="text-sm text-gray-700">
                        Você tem certeza que deseja excluir <strong>{certificateToDelete ? 1 : selectedIds.length} atestado(s)</strong>?
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        Esta ação é permanente e não poderá ser desfeita.
                    </p>
                </div>
            </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
            onClick={handleConfirmDelete}
            disabled={deleteMutation.isLoading || batchDeleteMutation.isLoading}
          >
            {(deleteMutation.isLoading || batchDeleteMutation.isLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Excluir
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            onClick={closeDeleteModal}
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
}