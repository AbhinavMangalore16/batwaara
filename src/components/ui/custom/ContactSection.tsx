"use client";

import React from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin } from "lucide-react";
import { IconBrandTwitter, IconBrandLinkedin, IconBrandGithub } from "@tabler/icons-react";
import { PointerHighlight } from "../pointer-highlight";
import { GlowingEffect } from "../glowing-effect";
import { ContactForm } from "./ContactForm";

export function ContactSection() {
  return (
    <section className="relative w-full py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-[#090d16]">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            The best way to grow is to <br/> <center><PointerHighlight> collaborate </PointerHighlight></center>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Reach out and let's start a conversation.
          </p>
        </motion.div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Contact Info & Map */}
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Contact Details Cards */}
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/60 border border-white/10 hover:border-white/20 transition-all backdrop-blur-md">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Email</h3>
                  <a href="mailto:hello@batwara.com" className="text-slate-400 hover:text-emerald-400 transition-colors">
                    collab@batwara.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/60 border border-white/10 hover:border-white/20 transition-all backdrop-blur-md">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Phone</h3>
                  <a href="tel:+919876543210" className="text-slate-400 hover:text-cyan-400 transition-colors">
                    +91 98765 43210
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/60 border border-white/10 hover:border-white/20 transition-all backdrop-blur-md">
                <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Location</h3>
                  <p className="text-slate-400">
                    D3.
                    Redwood, <br/>
                    Manayata Tech Park, <br/>
                    Nagavara, Bengaluru,<br/>
                    Karnataka-560045
                  </p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-64 rounded-xl overflow-hidden border border-white/10">
              <iframe
                src="https://www.google.com/maps?q=13.049052594494697,77.61990976250847&z=15&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Batwara Office Location"
              />
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-400 transition-all border border-white/5"
                  aria-label="Twitter"
                >
                  <IconBrandTwitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-cyan-500/20 hover:text-cyan-400 transition-all border border-white/5"
                  aria-label="LinkedIn"
                >
                  <IconBrandLinkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-emerald-500/20 hover:text-emerald-400 transition-all border border-white/5"
                  aria-label="GitHub"
                >
                  <IconBrandGithub className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <ContactForm/>
        
        </div>

        {/* FAQ or CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 lg:mt-16 text-center"
        >
          <p className="text-slate-400 mb-4">
            Prefer to chat? Check our <a href="#faq" className="text-emerald-400 hover:text-emerald-300 transition-colors">FAQ</a> or email us directly at support@batwara.com
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default ContactSection;
