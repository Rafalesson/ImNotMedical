// Endereço: apps/frontend/src/app/page.tsx (versão refatorada e orquestradora)

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/landing/HeroSection"; // 1. IMPORTAMOS NOSSA NOVA SEÇÃO

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      {/* Adicionamos flex e flex-col para que ele possa controlar o crescimento de seus filhos */}
      <main className="flex flex-col flex-grow">
        <HeroSection />

        {/* QUANDO FORMOS CRIAR AS PRÓXIMAS SEÇÕES, BASTA CHAMÁ-LAS AQUI:
          <FeaturesSection />
          <HowItWorksSection />
          <TestimonialsSection />
        */}
      </main>

      <Footer />
    </div>
  );
}
