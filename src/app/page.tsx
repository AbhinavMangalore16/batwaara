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
import { Ending } from '@/components/ui/custom/Ending';
import CustomFooter from '@/components/ui/custom/CustomFooter';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

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

      <section id="faq" className="py-12 lg:py-20 bg-[#090d16]">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-3xl lg:text-4xl font-bold text-center text-white">
            Frequently asked questions
          </h3>
          <p className="mt-2 text-center text-slate-400 max-w-2xl mx-auto">
            Common questions about Batwaara — how it works, privacy, and settlements.
          </p>

          <div className="mt-8">
            <Accordion type="multiple" className="space-y-4">
              <AccordionItem value="q-1" className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg">
                <AccordionTrigger className="px-6 text-white hover:text-emerald-400 font-semibold">How does Batwaara split bills?</AccordionTrigger>
                <AccordionContent className="px-6">
                  <p className="text-sm text-slate-300">Create a group, add expenses with participants, and Batwaara computes the net balances between members. We then offer minimal settlement suggestions so everyone pays as little as possible.</p>
                  <p className="mt-3 text-sm text-slate-400">You can mark expenses as shared equally, by percentage, or assign per-person amounts. Export settlements or send payment links directly to participants.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q-2" className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg">
                <AccordionTrigger className="px-6 text-white hover:text-emerald-400 font-semibold">How fast are settlements?</AccordionTrigger>
                <AccordionContent className="px-6">
                  <p className="text-sm text-slate-300">Settlement calculations are instantaneous. Once expenses are saved, the app computes optimized transfers immediately.</p>
                  <p className="mt-3 text-sm text-slate-400">For actual money transfers, Batwaara can generate payment links (UPI, Stripe) or provide a minimal pay list you can use with your preferred payment app.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q-3" className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg">
                <AccordionTrigger className="px-6 text-white hover:text-emerald-400 font-semibold">Is my data private?</AccordionTrigger>
                <AccordionContent className="px-6">
                  <p className="text-sm text-slate-300">We store only information required to compute settlements: group membership, expenses, and minimal metadata. Personal payment credentials are not stored unless you explicitly connect a payment provider.</p>
                  <p className="mt-3 text-sm text-slate-400">You control group visibility and membership. We do not sell your data and follow standard security practices for stored data.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="q-4" className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg">
                <AccordionTrigger className="px-6 text-white hover:text-emerald-400 font-semibold">What payment methods are supported?</AccordionTrigger>
                <AccordionContent className="px-6">
                  <p className="text-sm text-slate-300">Batwaara supports common regional payment links and integrations depending on availability: UPI (India), Stripe/ACH, and direct payment links. Support depends on your region and enabled integrations.</p>
                  <p className="mt-3 text-sm text-slate-400">If you need additional integrations, contact our support and we can prioritize connectors.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <Ending />
      <CustomFooter />
    </div>
  );
}
