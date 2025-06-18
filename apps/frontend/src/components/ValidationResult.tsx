// src/components/ValidationResult.tsx
'use client';
import { CheckCircle, AlertTriangle } from 'lucide-react';
export const ValidationResult = ({ result, error }) => {
  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-center w-full">
        <AlertTriangle className="mx-auto mb-2 h-10 w-10 text-red-500" />
        <p className="font-semibold text-red-800">{error}</p>
      </div>
    );
  }
  if (result) {
    return (
      <div className="rounded-md border border-green-200 bg-green-50 p-4 text-center w-full">
        <CheckCircle className="mx-auto mb-2 h-10 w-10 text-green-600" />
        <h2 className="text-lg font-bold text-green-900">Documento Válido!</h2>
        <div className="mt-4 text-left text-sm text-gray-700 space-y-1">
          <p><strong>Emitido para:</strong> {result.patientName}</p>
          <p><strong>Médico Responsável:</strong> {result.doctorName} (CRM: {result.doctorCrm})</p>
          <p><strong>Dias de Afastamento:</strong> {result.durationInDays}</p>
          <p><strong>Data de Emissão:</strong> {new Date(result.issuedAt).toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
    );
  }
  return null;
};