// Endereço: apps/frontend/src/app/page.tsx (versão final para scroll snap)

import { Header } from '@/components/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { Footer } from '@/components/Footer'; 


export default function LandingPage() {
  return (
    // Usamos um Fragment (<>) pois o Header agora é fixo e não precisa estar no mesmo container de layout.
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <Footer />

      </main>
    </>
  );
}