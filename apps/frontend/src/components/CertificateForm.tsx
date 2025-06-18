// src/components/CertificateForm.tsx (versão final com sessionStorage)
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { AutocompleteSearch } from './AutocompleteSearch';

type Patient = { id: string; name: string; cpf: string; userId: string; };
type Cid = { id: string; code: string; description: string; };

export function CertificateForm() {
  const router = useRouter();

  // Estados locais para controlar o formulário
  const [purpose, setPurpose] = useState('');
  const [durationInDays, setDurationInDays] = useState<number | ''>(1);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedCid, setSelectedCid] = useState<Cid | null>(null);
  
  // Este useEffect lê os dados do sessionStorage quando o componente carrega
  useEffect(() => {
    const savedData = sessionStorage.getItem('certificateFormData');
    if (savedData) {
      const formData = JSON.parse(savedData);
      setPurpose(formData.purpose);
      setDurationInDays(formData.durationInDays);
      setSelectedPatient(formData.patient);
      setSelectedCid(formData.cid);
    }
  }, []);

  const searchPatients = async (query: string): Promise<Patient[]> => {
    try {
      const response = await api.get(`/patients/search?name=${query}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      return [];
    }
  };
  const handleSelectPatient = (patient: Patient) => setSelectedPatient(patient);
  
  const searchCids = async (query: string): Promise<Cid[]> => {
    try {
      const response = await api.get(`/cids/search?query=${query}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar CIDs:', error);
      return [];
    }
  };
  const handleSelectCid = (cid: Cid) => setSelectedCid(cid);

  function handlePreview(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedPatient) {
      alert('Por favor, selecione um paciente da lista.');
      return;
    }
    
    const dataToSave = {
      patient: selectedPatient,
      cid: selectedCid,
      purpose,
      durationInDays,
    };

    // Salva os dados no sessionStorage e navega
    sessionStorage.setItem('certificateFormData', JSON.stringify(dataToSave));
    router.push('/dashboard/atestados/preview');
  }

  return (
    <form onSubmit={handlePreview} className="space-y-6">
      <AutocompleteSearch<Patient>
        label="Buscar Paciente"
        placeholder="Digite o nome do paciente..."
        onSearch={searchPatients}
        onSelect={handleSelectPatient}
        initialQuery={selectedPatient?.name || ''}
        renderOption={(patient) => (
          <div className="p-3 cursor-pointer hover:bg-gray-100">
            <p className="font-semibold text-gray-900">{patient.name}</p>
            <p className="text-sm text-gray-500">CPF: {patient.cpf}</p>
          </div>
        )}
      />

      <div>
        <label htmlFor="purpose" className="mb-2 block text-sm font-medium text-gray-700">Finalidade do Atestado</label>
        <textarea id="purpose" rows={4} value={purpose} onChange={(e) => setPurpose(e.target.value)} className="w-full rounded-md border border-gray-300 p-3 text-gray-900" required />
      </div>

      <AutocompleteSearch<Cid>
        label="CID-10 (Opcional)"
        placeholder="Digite o código ou descrição..."
        onSearch={searchCids}
        onSelect={handleSelectCid}
        initialQuery={selectedCid ? `${selectedCid.code} - ${selectedCid.description}` : ''}
        renderOption={(cid) => (
          <div className="p-3 cursor-pointer hover:bg-gray-100">
            <p className="font-semibold text-gray-900">{cid.code}</p>
            <p className="text-sm text-gray-500">{cid.description}</p>
          </div>
        )}
      />
      
      <div>
        <label htmlFor="durationInDays" className="mb-2 block text-sm font-medium text-gray-700">Duração do Afastamento (em dias)</label>
        <input type="number" id="durationInDays" value={durationInDays} onChange={(e) => setDurationInDays(e.target.value === '' ? '' : Number(e.target.value))} className="w-full rounded-md border border-gray-300 p-3 text-gray-900" required/>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="rounded-md bg-blue-600 px-6 py-2 text-white font-semibold cursor-pointer">
          Gerar Pré-visualização
        </button>
      </div>
    </form>
  );
}