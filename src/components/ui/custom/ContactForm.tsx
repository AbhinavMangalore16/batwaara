"use client";
import React, { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (value: string) => {
    // Basic email check
    return /\S+@\S+\.\S+/.test(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in name, email and message.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setStatus("sending");

    try {
      // Try posting to an API route; if none exists this may fail and we'll fallback
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "Server error");
        throw new Error(text || "Server error");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setStatus("error");
      setError(err?.message || "Unable to send message. Try again later.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl bg-slate-900/70 border border-white/10 p-6 md:p-8 backdrop-blur-md shadow-2xl">
      <h2 className="text-xl font-bold text-white">Get in touch</h2>
      <p className="mt-2 max-w-sm text-sm text-slate-400">
        Have feedback or need help? Send us a message and we'll reply within 24 hours.
      </p>

      <form className="my-8 space-y-4" onSubmit={handleSubmit} noValidate>
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none transition-colors"
            required
          />
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none transition-colors"
            required
          />
        </div>

        {/* Subject Input */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
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
        </div>

        {/* Message Textarea */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us more..."
            className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none transition-colors resize-none"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 disabled:opacity-60 cursor-pointer"
        >
          {status === "sending" ? "Sending..." : "Send Message"}
        </button>

        {/* Response note */}
        <p className="text-xs text-slate-400 text-center">We'll get back to you within 24 hours.</p>

        {/* Status / Error */}
        <div aria-live="polite" className="mt-2 min-h-[1.25rem] text-center">
          {status === "success" && <p className="text-sm text-emerald-400">Message sent — thank you!</p>}
          {status === "error" && <p className="text-sm text-rose-400">{error}</p>}
          {error && status !== "error" && <p className="text-sm text-rose-400">{error}</p>}
        </div>
      </form>
    </div>
  );
}
