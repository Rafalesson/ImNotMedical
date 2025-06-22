// Endereço: apps/frontend/src/components/landing/HeroSection.tsx

export function HeroSection() {
  return (
    // MUDANÇA: trocamos h-screen por h-[100dvh] para compatibilidade com mobile
    <section className="relative bg-gray-900 flex h-[100dvh] items-center justify-center text-white scroll-snap-align-start">
      
      <div className="absolute top-0 left-0 h-full w-full">
        <video
          src="/hero_video.mp4"
          autoPlay loop muted playsInline
          className="h-full w-full object-cover"
        />
        <div className="absolute top-0 left-0 h-full w-full bg-black/70" />
      </div>
      
      <div className="relative p-4 text-center z-10">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Cuidado digital, confiança real.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-200">
          A ponte digital entre médicos e pacientes, oferecendo consultas online, atestados e prescrições com total segurança.
        </p>
      </div>

    </section>
  );
}