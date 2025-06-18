// src/app/dashboard/atestados/novo/page.tsx (versão final simplificada)
'use client';

import { CertificateForm } from '@/components/CertificateForm';

export default function NewCertificatePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Emitir Novo Atestado</h1>
      <div className="p-8 bg-white rounded-lg shadow-md">
        <CertificateForm />
      </div>
    </div>
  );
}