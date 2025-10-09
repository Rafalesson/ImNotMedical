'use client';

import { useRef, type ComponentType } from 'react';
import { ShieldCheck, Rocket, Users } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

type Feature = {
  name: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
};

const features: Feature[] = [
  {
    name: 'Validação Segura',
    description:
      'Tecnologia antifraude que valida cada documento emitido, garantindo confiança total para médicos e pacientes.',
    icon: ShieldCheck,
  },
  {
    name: 'Emissão Rápida e Intuitiva',
    description:
      'Atestados e prescrições criados em poucos cliques, com layouts profissionais e envio imediato para o paciente.',
    icon: Rocket,
  },
  {
    name: 'Conexão Direta',
    description:
      'Comunicação descomplicada entre você e seu paciente, com histórico compartilhado e acompanhamento contínuo.',
    icon: Users,
  },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} id="features" className="bg-white">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-7xl flex-col justify-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Por que Zello?</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Clareza e segurança em cada etapa do cuidado digital
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Mais do que uma plataforma, o Zello conecta pessoas com dados confiáveis e processos fluidos.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const baseBackground = index % 2 === 0 ? 'bg-white' : 'bg-[#f9fafb]';

            return (
              <div
                key={feature.name}
                data-reveal
                className={`group relative flex flex-col rounded-3xl ${baseBackground} p-8 shadow-sm ring-1 ring-slate-100 transition-all duration-200 hover:-translate-y-2 hover:shadow-xl hover:ring-blue-100`}
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-all duration-200 group-hover:bg-blue-600 group-hover:text-white">
                  <feature.icon className="h-10 w-10" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{feature.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
