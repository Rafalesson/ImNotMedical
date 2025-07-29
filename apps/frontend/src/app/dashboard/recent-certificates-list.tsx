// Endereço: apps/frontend/src/app/dashboard/recent-certificates-list.tsx

import { cookies } from 'next/headers';

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

async function getCertificates(token: string | undefined): Promise<Certificate[]> {
  if (!token) {
    return [];
  }
  
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/certificates/my-certificates`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store', 
    });

    if (!response.ok) {
      throw new Error(`Falha ao buscar dados: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData.data; 

  } catch (error) {
    console.error("Falha ao buscar atestados no servidor:", error);
    return []; 
  }
}


export async function RecentCertificatesList() {
  const cookieStore = cookies();
  const token = cookieStore.get('zello.token')?.value;
  const certificates: Certificate[] = await getCertificates(token);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Atestados Emitidos Recentemente</h2>
      <div className="space-y-2">
        {certificates.length > 0 ? (
          certificates.map((cert: Certificate) => (
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