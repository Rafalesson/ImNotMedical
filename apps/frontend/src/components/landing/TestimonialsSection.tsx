'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

type Testimonial = {
  name: string;
  role: string;
  message: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    name: 'Dra. Helena Sampaio',
    role: 'Cardiologista',
    message:
      'O Zello me permite atender pacientes à distância com a segurança e o acolhimento que ofereço no consultório.',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=320&q=80',
  },
  {
    name: 'Dr. Marcelo Nunes',
    role: 'Clínico Geral',
    message:
      'Centralizei todos os documentos e prontuários. Minha rotina ficou mais ágil e os pacientes, mais confiantes.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80',
  },
  {
    name: 'Dra. Bruna Costa',
    role: 'Dermatologista',
    message:
      'Experiência intuitiva e próxima. Consigo manter o acompanhamento mesmo fora do consultório.',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=320&q=80',
  },
  {
    name: 'Ana Ribeiro',
    role: 'Paciente',
    message:
      'Resolvi meus atendimentos sem sair de casa. Recebi atestados e receitas em minutos pelo Zello.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=320&q=80',
  },
  {
    name: 'Carlos Mendes',
    role: 'Paciente',
    message:
      'As consultas são claras e seguras. Tudo chega no meu e-mail na hora e posso acompanhar cada passo.',
    avatar: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?auto=format&fit=crop&w=320&q=80',
  },
  {
    name: 'Luiza Teixeira',
    role: 'Paciente',
    message:
      'Fui atendida por vídeo com toda a atenção. A plataforma é simples e me passa muita confiança.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=320&q=80',
  },
];

const AUTO_SCROLL_INTERVAL = 5000;

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const totalSlides = testimonials.length;

  useScrollReveal(sectionRef);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleChange = () => setIsDesktop(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const items = container.querySelectorAll<HTMLElement>('[data-carousel-item]');
    const target = items[index];

    if (!target) {
      return;
    }

    container.scrollTo({
      left: target.offsetLeft,
      behavior,
    });
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      return;
    }

    scrollToIndex(activeIndex);
  }, [activeIndex, isDesktop, scrollToIndex]);

  useEffect(() => {
    if (!isDesktop) {
      return;
    }

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, [isDesktop, totalSlides]);

  const handlePrev = () => {
    const previousIndex = (activeIndex - 1 + totalSlides) % totalSlides;
    setActiveIndex(previousIndex);
    if (!isDesktop) {
      scrollToIndex(previousIndex);
    }
  };

  const handleNext = () => {
    const nextIndex = (activeIndex + 1) % totalSlides;
    setActiveIndex(nextIndex);
    if (!isDesktop) {
      scrollToIndex(nextIndex);
    }
  };

  return (
    <section ref={sectionRef} id="depoimentos" className="bg-white">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-7xl flex-col justify-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Depoimentos</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:whitespace-nowrap">
            Confiança comprovada por quem usa o Zello.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Histórias reais de profissionais e pacientes que enxergam no Zello uma jornada digital mais humana e segura.
          </p>
        </div>

        <div className="relative mt-12">
          <div
            ref={containerRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 transition-all duration-300 lg:[&::-webkit-scrollbar]:hidden lg:[scrollbar-width:none]"
          >
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                data-carousel-item
                className="snap-start flex min-h-full w-[280px] flex-none flex-col gap-6 rounded-3xl bg-[#f9fafb] p-8 shadow-sm ring-1 ring-slate-100 transition-all duration-200 hover:-translate-y-2 hover:shadow-xl hover:ring-blue-100 sm:w-[320px] md:w-[340px] lg:w-[360px]"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={testimonial.avatar}
                    alt={`Foto de ${testimonial.name}`}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-sm leading-6 text-slate-600">“{testimonial.message}”</p>
              </article>
            ))}
          </div>

          <div className="pointer-events-none absolute top-1/2 left-[-2.5rem] hidden -translate-y-1/2 items-center lg:flex">
            <button
              type="button"
              onClick={handlePrev}
              className="pointer-events-auto inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-white hover:shadow-xl hover:ring-2 hover:ring-blue-100"
              aria-label="Depoimento anterior"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
          <div className="pointer-events-none absolute top-1/2 right-[-2.5rem] hidden -translate-y-1/2 items-center lg:flex">
            <button
              type="button"
              onClick={handleNext}
              className="pointer-events-auto inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-white hover:shadow-xl hover:ring-2 hover:ring-blue-100"
              aria-label="Próximo depoimento"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


