// apps/frontend/src/components/providers.tsx

"use client"; // Diretiva que marca este como um Componente de Cliente

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  // Usamos useState para garantir que o QueryClient só seja criado uma vez por render no cliente
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}