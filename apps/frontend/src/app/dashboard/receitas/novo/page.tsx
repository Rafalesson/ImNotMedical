'use client';

import { PrescriptionForm } from '@/components/PrescriptionForm';

export default function NewPrescriptionPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Emitir nova receita</h1>
      <div className="p-8 bg-white rounded-lg shadow-md">
        <PrescriptionForm />
      </div>
    </div>
  );
}
