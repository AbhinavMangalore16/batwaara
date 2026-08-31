"use client";
import React, { useState } from "react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  subject: z.string().min(3, "Subject must be at least 3 characters.").optional().or(z.literal("")),
  message: z.string().min(5, "Message must be at least 5 characters."),
});

type FieldErrors = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

export function ContactForm() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setServerMessage(null);

    const validation = contactSchema.safeParse({ name, email, subject, message });

    if (!validation.success) {
      const fieldErrors: FieldErrors = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof FieldErrors] = issue.message;
        }
      });
      setErrors(fieldErrors);
      setStatus("idle");
      return;
    }

    setStatus("sending");

    try {
      const res = await fetch("https://formspree.io/f/xgaeavae", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!res.ok) {
        throw new Error("Form submission failed. Please try again.");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setStatus("error");
      setServerMessage(err?.message || "Unable to send message. Try again later.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl bg-slate-900/70 border border-white/10 p-6 md:p-8 backdrop-blur-md shadow-2xl">
      <h2 className="text-xl font-bold text-white font-space">Get in touch</h2>
      <p className="mt-2 max-w-sm text-sm text-slate-400 font-sans">
        Have feedback or need help? Send us a message and we'll reply within 24 hours.
      </p>

      <form className="my-6 space-y-4" onSubmit={handleSubmit} noValidate>
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-xs font-mono uppercase text-slate-300 mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none transition-colors"
          />
          {errors.name && <p className="text-xs text-rose-400 font-mono mt-1">{errors.name}</p>}
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-xs font-mono uppercase text-slate-300 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none transition-colors"
          />
          {errors.email && <p className="text-xs text-rose-400 font-mono mt-1">{errors.email}</p>}
        </div>

        {/* Subject Input */}
        <div>
          <label htmlFor="subject" className="block text-xs font-mono uppercase text-slate-300 mb-1">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="What's this about?"
            className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none transition-colors"
          />
          {errors.subject && <p className="text-xs text-rose-400 font-mono mt-1">{errors.subject}</p>}
        </div>

        {/* Message Textarea */}
        <div>
          <label htmlFor="message" className="block text-xs font-mono uppercase text-slate-300 mb-1">
            Message *
          </label>
          <textarea
            id="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us more..."
            className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none transition-colors resize-none"
          />
          {errors.message && <p className="text-xs text-rose-400 font-mono mt-1">{errors.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold font-space hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 cursor-pointer"
        >
          {status === "sending" ? "Submitting..." : "Send Message"}
        </button>


        {/* Status / Error Messages */}
        <div aria-live="polite" className="mt-2 min-h-[1.25rem] text-center">
          {status === "success" && (
            <p className="text-sm font-mono text-emerald-400 font-bold bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/30">
              ✓ Message sent successfully! We'll reply shortly.
            </p>
          )}
          {status === "error" && (
            <p className="text-sm font-mono text-rose-400 bg-rose-950/40 p-2.5 rounded-lg border border-rose-500/30">
              ✕ {serverMessage}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
