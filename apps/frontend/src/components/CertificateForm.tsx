// apps/frontend/src/components/CertificateForm.tsx (Refatorado com Context)
'use client';

import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { AutocompleteSearch } from './AutocompleteSearch';
import { useAttestation } from '@/contexts/AttestationContext'; // 1. Importa o nosso hook

type Patient = { id: string; name: string; cpf: string; userId: string; };
type Cid = { id: string; code: string; description: string; };

export function CertificateForm() {
  const router = useRouter();
  // 2. Lê o estado e a função de atualização diretamente do contexto
  const { data, setData } = useAttestation();

  // 3. O useEffect que lia do sessionStorage foi REMOVIDO.

  const searchPatients = async (query: string): Promise<Patient[]> => {
    try {
      const response = await api.get(`/patients/search?name=${query}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      return [];
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    setData({ ...data, patient });
  };

  const searchCids = async (query: string): Promise<Cid[]> => {
    try {
      const response = await api.get(`/cids/search?query=${query}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar CIDs:', error);
      return [];
    }
  };

  const handleSelectCid = (cid: Cid) => {
    setData({ ...data, cid });
  };

  function handlePreview(event: React.FormEvent) {
    event.preventDefault();
    if (!data.patient) {
      alert('Por favor, selecione um paciente da lista.');
      return;
    }

    // 4. A lógica de salvar no sessionStorage foi REMOVIDA.
    // Os dados já estão no contexto, basta navegar.
    router.push('/dashboard/atestados/preview');
  }

  return (
    <form onSubmit={handlePreview} className="space-y-6">
      <AutocompleteSearch<Patient>
        label="Buscar Paciente"
        placeholder="Digite o nome do paciente..."
        onSearch={searchPatients}
        onSelect={handleSelectPatient}
        // 5. O formulário agora lê os valores direto do contexto
        initialValue={data.patient} 
        renderOption={(patient) => (
          <div className="p-3 cursor-pointer hover:bg-gray-100">
            <p className="font-semibold text-gray-900">{patient.name}</p>
            <p className="text-sm text-gray-500">CPF: {patient.cpf}</p>
          </div>
        )}
        displayValue={(patient) => patient.name}
      />

      <div>
        <label htmlFor="purpose" className="mb-2 block text-sm font-medium text-gray-700">Finalidade do Atestado</label>
        <textarea id="purpose" rows={4} value={data.purpose} onChange={(e) => setData({ ...data, purpose: e.target.value })} className="w-full rounded-md border border-gray-300 p-3 text-gray-900" required />
      </div>

      <AutocompleteSearch<Cid>
        label="CID-10 (Opcional)"
        placeholder="Digite o código ou descrição..."
        onSearch={searchCids}
        onSelect={handleSelectCid}
        initialValue={data.cid}
        renderOption={(cid) => (
          <div className="p-3 cursor-pointer hover:bg-gray-100">
            <p className="font-semibold text-gray-900">{cid.code}</p>
            <p className="text-sm text-gray-500">{cid.description}</p>
          </div>
        )}
        displayValue={(cid) => `${cid.code} - ${cid.description}`}
      />

      <div>
        <label htmlFor="durationInDays" className="mb-2 block text-sm font-medium text-gray-700">Duração do Afastamento (em dias)</label>
        <input type="number" id="durationInDays" value={data.durationInDays} onChange={(e) => setData({ ...data, durationInDays: e.target.value === '' ? '' : Number(e.target.value) })} className="w-full rounded-md border border-gray-300 p-3 text-gray-900" required/>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="rounded-md bg-blue-600 px-6 py-2 text-white font-semibold cursor-pointer">
          Gerar Pré-visualização
        </button>
      </div>
    </form>
  );
}