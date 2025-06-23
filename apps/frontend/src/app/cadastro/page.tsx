// Endereço: apps/frontend/src/app/cadastro/page.tsx

import { PublicLayout } from "@/components/PublicLayout";
import { Stethoscope, User } from "lucide-react";
import Link from "next/link";

export default function RegistrationTypePage() {
  return (
    <PublicLayout>
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Bem-vindo(a) à Zello!
        </h1>
        <p className="mt-4 text-lg leading-8 text-gray-600">
          Para começar, nos diga qual tipo de conta você gostaria de criar.
        </p>

        {/* Container para os dois cards de opção */}
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          
          {/* Card de Médico */}
          <Link href="/cadastro/medico" className="block rounded-lg border border-gray-200 p-8 text-center shadow-sm transition hover:border-blue-500 hover:shadow-lg">
            <Stethoscope className="mx-auto h-12 w-12 text-blue-600" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Sou Médico(a)
            </h2>
            <p className="mt-2 text-gray-500">
              Crie sua conta profissional para emitir e gerenciar documentos digitais.
            </p>
          </Link>

          {/* Card de Paciente */}
          <Link href="/cadastro/paciente" className="block rounded-lg border border-gray-200 p-8 text-center shadow-sm transition hover:border-blue-500 hover:shadow-lg">
            <User className="mx-auto h-12 w-12 text-blue-600" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Sou Paciente
            </h2>
            <p className="mt-2 text-gray-500">
              Acesse seus documentos e conecte-se com seus médicos de forma segura.
            </p>
          </Link>

        </div>
      </div>
    </PublicLayout>
  );
}