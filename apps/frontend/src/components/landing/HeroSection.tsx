import Link from 'next/link';

export function HeroSection() {
  return (
    <section id="inicio" className="relative flex min-h-[100dvh] w-full items-center overflow-hidden bg-slate-900 text-white">
      <div className="absolute inset-0">
        <video
          src="/assets/home_zello_video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="flex flex-col items-center gap-10 text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-1 text-sm font-medium uppercase tracking-wide text-slate-200 backdrop-blur">
            Telemedicina humana e segura
          </span>
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:whitespace-nowrap">
              Cuidado digital, confiança real.
            </h1>
            <p className="text-lg leading-8 text-slate-100/90 sm:text-xl">
              A ponte entre médicos e pacientes com segurança, agilidade e empatia para cada atendimento.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/cadastro/medico"
              className="inline-flex items-center justify-center rounded-lg border border-white/40 bg-white/10 px-6 py-3 text-sm lg:px-8 lg:py-4 lg:text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
            >
              Sou médico
            </Link>
            <Link
              href="/cadastro/paciente"
              className="inline-flex items-center justify-center rounded-lg border border-white/40 bg-white/10 px-6 py-3 text-sm lg:px-8 lg:py-4 lg:text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
            >
              Sou paciente
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

