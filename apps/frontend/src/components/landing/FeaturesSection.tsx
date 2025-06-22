// Endereço: apps/frontend/src/components/landing/FeaturesSection.tsx

import { ShieldCheck, Rocket, Users } from 'lucide-react';

const features = [ 
  { name: 'Validação Segura', description: 'Garanta a autenticidade de cada documento com nossa tecnologia anti-fraude, protegendo médicos e pacientes.', icon: ShieldCheck, },
  { name: 'Emissão Rápida e Intuitiva', description: 'Crie e envie atestados e prescrições em segundos, direto da plataforma, com uma interface pensada para você.', icon: Rocket, },
  { name: 'Conexão Direta', description: 'Uma ponte segura entre você e seu paciente. Facilite a comunicação, o envio de documentos e o acompanhamento.', icon: Users, },
];

export function FeaturesSection() {
  return (
    // MUDANÇA: trocamos h-screen por h-[100dvh]
    <section className="relative bg-white h-[100dvh] scroll-snap-align-start flex flex-col justify-center">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 lg:py-24 overflow-y-auto">
        {/* ... conteúdo interno ... */}
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Sempre à Frente</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Uma plataforma completa para o cuidado digital
          </p>
          <p className="mt-4 text-base leading-7 text-gray-600 lg:text-lg lg:leading-8">
            O Zello foi desenhado para otimizar a rotina de médicos e trazer segurança para pacientes, modernizando cada etapa da consulta.
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-2xl sm:mt-16 lg:mt-20 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none md:grid-cols-2 lg:grid-cols-3 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}