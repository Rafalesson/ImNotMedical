// Endereço: apps/frontend/src/components/landing/HeroSection.tsx (versão com CSS corrigido)

// Não precisamos mais do Link ou do LogIn aqui.

export function HeroSection() {
  return (
    // 1. O container da seção continua 'relative'. Isso é a nossa "mesa de trabalho".
    <section className="relative flex flex-grow items-center justify-center text-white">

      {/* 2. VÍDEO E OVERLAY - A BASE DA NOSSA PILHA */}
      {/* Eles estão em um 'div' absoluto que preenche toda a seção. */}
      <div className="absolute top-0 left-0 h-full w-full">
        <video
          src="/hero_video.mp4"
          autoPlay
          loop
          muted
          playsInline
          // O vídeo agora simplesmente preenche seu container.
          className="h-full w-full object-cover"
        />
        {/* A camada escura fica sobre o vídeo, dentro do mesmo container. */}
        <div className="absolute top-0 left-0 h-full w-full bg-black/70" />
      </div>

      {/* 3. CONTEÚDO - O TOPO DA NOSSA PILHA */}
      {/* Adicionamos 'relative' aqui para garantir que ele crie seu próprio contexto 
          de empilhamento e fique na frente dos outros elementos 'absolute'. */}
      <div className="relative p-4 text-center">
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