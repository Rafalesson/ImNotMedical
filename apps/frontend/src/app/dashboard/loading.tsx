// Endereço: apps/frontend/src/app/dashboard/loading.tsx (versão final)

import { Spinner } from '@/components/Spinner';

export default function DashboardLoading() {
  // Este componente é envolvido pelo layout do dashboard automaticamente.
  // Por isso, só precisamos nos preocupar em centralizar o spinner.
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner />
    </div>
  );
}