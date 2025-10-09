'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

type Step = {
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    title: 'Cadastre-se em minutos',
    description:
      'Crie sua conta como médico ou paciente, confirme os dados principais e personalize o seu perfil profissional.',
  },
  {
    title: 'Realize a consulta',
    description:
      'Conecte-se por vídeo com estabilidade e prontuário integrado, mantendo todo o histórico em um só lugar.',
  },
  {
    title: 'Emita documentos válidos',
    description:
      'Gere atestados, receitas e laudos com validade jurídica, assinados digitalmente e prontos para o envio.',
  },
];

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} id="how-it-works" className="bg-[#f9fafb]">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-7xl flex-col justify-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Como funciona</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:whitespace-nowrap">
            Comece a usar o Zello em três passos simples
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Processos guiados, integrações automáticas e suporte humano garantem uma jornada tranquila do cadastro à emissão dos documentos.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              data-reveal
              className="group relative flex flex-col gap-4 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-2 hover:shadow-xl hover:ring-blue-100"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-500 text-lg font-semibold text-white shadow-md transition-transform duration-200 group-hover:scale-105">
                {index + 1}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="text-sm leading-6 text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 w-full px-4 sm:px-0">
          {/* Grid with 3 equal columns on md+, place button in middle column so it matches card width */}
          <div className="mx-auto grid w-full grid-cols-1 md:grid-cols-3">
            <div />
            <div className="flex justify-center">
              <Link
                href="/cadastro"
                className="w-full sm:inline-flex items-center justify-center text-center rounded-lg border border-blue-600 bg-transparent px-8 py-4 text-base sm:text-lg font-semibold text-blue-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Começar Agora
              </Link>
            </div>
            <div />
          </div>
        </div>
      </div>
    </section>
  );
}



