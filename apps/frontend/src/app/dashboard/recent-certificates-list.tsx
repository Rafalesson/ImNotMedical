// Endereço: apps/frontend/src/app/dashboard/recent-certificates-list.tsx (versão com fetch)

import { cookies } from 'next/headers'; // A função cookies continua aqui

// A tipagem do atestado permanece a mesma.
type Certificate = {
  id: string;
  purpose: string;
  issueDate: string;
  patient: {
    patientProfile: {
      name: string;
    } | null
  } | null
};


// A função de busca de dados agora usa fetch.
async function getCertificates(token: string | undefined) {
  // Se não houver token, não há o que buscar.
  if (!token) {
    return [];
  }
  
  // Usamos a variável de ambiente para montar a URL completa.
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/certificates/my-certificates`;

  try {
    // 1. FAZEMOS A CHAMADA USANDO A API FETCH NATIVA
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      // 'no-store' garante que os dados sejam sempre frescos para cada usuário.
      cache: 'no-store', 
    });

    // 2. Verificamos se a resposta foi bem-sucedida (status 2xx)
    if (!response.ok) {
      // Se não foi, lançamos um erro para ser pego pelo catch.
      throw new Error(`Falha ao buscar dados: ${response.statusText}`);
    }

    // 3. Convertemos a resposta para JSON
    return response.json();

  } catch (error) {
    console.error("Falha ao buscar atestados no servidor:", error);
    return []; 
  }
}


// O componente que consome os dados permanece o mesmo.
export async function RecentCertificatesList() {
  const cookieStore = cookies();
  const token = cookieStore.get('zello.token')?.value;
  const certificates = await getCertificates(token);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Atestados Emitidos Recentemente</h2>
      <div className="space-y-2">
        {certificates.length > 0 ? (
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
    </div>
  );
}