'use client';

import { CustomNavbar } from '@/components/ui/custom/CustomNavbar';
import { Hero } from '@/components/ui/custom/Hero';
import { HeroProduct } from '@/components/ui/custom/HeroProduct';
import { FeaturesSection } from '@/components/ui/custom/FeaturesSection';
import IntegrationsSection from '@/components/ui/custom/IntegrationsSection';
import PricingSection from '@/components/ui/custom/PricingSection';
import { TestimonialTitle } from '@/components/ui/custom/TestimonialTitle';
import { CustomTestimonies } from '@/components/ui/custom/CustomTestimonies';
import ContactSection from '@/components/ui/custom/ContactSection';
import { LandingFAQ } from '@/components/landing/LandingFAQ';
import { CinematicFooter } from '@/components/ui/motion-footer';

export default function LandingPage() {
  return (
    <div className="w-full bg-[#090d16] text-white">
      <CustomNavbar />
      <Hero />
      <HeroProduct />

      <section id="features">
        <FeaturesSection />
      </section>

      <section id="integrations">
        <IntegrationsSection />
      </section>

      <section id="pricing">
        <PricingSection />
      </section>

      <section id="testimonials">
        <TestimonialTitle />
      </section>

      <CustomTestimonies />

      <section id="contact">
        <ContactSection />
      </section>

      <LandingFAQ />

      <CinematicFooter />
    </div>
  );
}
