// Endereço: apps/frontend/src/app/redefinir-senha/page.tsx

import { PublicLayout } from "@/components/PublicLayout";
import { ResetPasswordForm } from "./reset-password-form";
import { Suspense } from "react";

// Este componente age como um "wrapper" que usa o Suspense
// para garantir que o formulário só renderize quando os parâmetros da URL estiverem disponíveis.
export default function ResetPasswordPage() {
  return (
    <PublicLayout>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </PublicLayout>
  );
}