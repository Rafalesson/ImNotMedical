'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  useScrollReveal(sectionRef);

  return (
    <section ref={sectionRef} id="about" className="bg-[#f1f5f9]">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-7xl flex-col justify-center gap-16 px-6 py-24 sm:py-32 lg:flex-row lg:items-center lg:px-8">
        <div className="w-full max-w-xl space-y-6">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Sobre o Zello</span>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Um time comprometido em humanizar o cuidado digital
          </h2>
          <p className="text-base leading-7 text-slate-600">
            Somos uma equipe multidisciplinar apaixonada por tecnologia e saúde. Desde 2020 conectamos médicos e pacientes com uma plataforma segura, intuitiva e alinhada às principais regulações do país.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            <div data-reveal className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-3xl font-bold text-blue-600">+30k</p>
              <p className="mt-2 text-sm text-slate-600">Consultas realizadas com emissão de documentos válidos.</p>
            </div>
            <div data-reveal className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <p className="text-3xl font-bold text-blue-600">98%</p>
              <p className="mt-2 text-sm text-slate-600">De satisfação entre profissionais de saúde que utilizam o Zello.</p>
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-xl" data-reveal>
          <div className="overflow-hidden rounded-3xl shadow-xl ring-1 ring-white/60">
            <Image
              src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80"
              alt="Equipe médica reunida"
              width={900}
              height={600}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

