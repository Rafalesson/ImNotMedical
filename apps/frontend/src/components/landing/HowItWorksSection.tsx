// Endereço: apps/frontend/src/components/landing/HowItWorksSection.tsx

import { UserPlus, Laptop, FileCheck2 } from 'lucide-react';

const steps = [
  { name: '1. Cadastre-se em Minutos', description: 'Crie sua conta de forma rápida e segura, seja você médico ou paciente, e acesse a plataforma imediatamente.', icon: UserPlus, },
  { name: '2. Realize a Consulta', description: 'Conecte-se através da nossa plataforma de telemedicina, com vídeo de alta qualidade e ferramentas integradas.', icon: Laptop, },
  { name: '3. Emita e Valide Documentos', description: 'Gere atestados e prescrições digitais com validade jurídica e compartilhe-os com total segurança.', icon: FileCheck2, },
];

export function HowItWorksSection() {
  return (
    // MUDANÇA: trocamos h-screen por h-[100dvh]
    <section className="relative bg-gray-50 h-[100dvh] scroll-snap-align-start flex flex-col justify-center">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-24 overflow-y-auto">
        {/* ... conteúdo interno ... */}
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Simples e Direto</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Comece a usar em 3 passos
          </p>
          <p className="mt-4 text-base leading-7 text-gray-600 lg:text-lg lg:leading-8">
            Projetamos cada etapa para ser o mais clara e eficiente possível, eliminando complexidades desnecessárias.
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-2xl sm:mt-16 lg:mt-20 lg:max-w-4xl">
          <dl className="grid grid-cols-1 gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-0">
            {steps.map((step) => (
              <div key={step.name} className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                  <step.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <dt className="mt-4 font-semibold text-gray-900">{step.name}</dt>
                <dd className="mt-2 text-base text-gray-600">{step.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}