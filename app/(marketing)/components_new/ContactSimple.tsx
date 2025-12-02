"use client";

import { motion } from "framer-motion";

export default function ContactSimple() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@arvado.ca";
  const actionUrl = `https://formsubmit.co/${contactEmail}`;
  return (
    <section id="contact" className="relative overflow-hidden py-24">
      <div className="mx-auto w-full max-w-5xl px-6 lg:px-8">
        <div className="text-center">
          <span className="tag mb-4">Contact</span>
          <h2 className="section-heading">Tell us what you want to launch</h2>
          <p className="section-subtitle">We’ll reply within one business day with next steps.</p>
        </div>
        <motion.form
          action={actionUrl}
          method="POST"
          className="mx-auto mt-10 max-w-2xl space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_subject" value="New Arvado inquiry" />
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-white/50">Name</label>
            <input
              required
              name="name"
              placeholder="Your name"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-white/50">Email</label>
            <input
              required
              type="email"
              name="email"
              placeholder="you@brand.com"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-white/50">What do you need?</label>
            <textarea
              name="message"
              rows={4}
              placeholder="Tell us what you want to launch or optimize."
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
          >
            Send message
          </button>
          <p className="text-xs text-white/40">By submitting you agree to secure handling of your data.</p>
        </motion.form>
      </div>
    </section>
  );
}


