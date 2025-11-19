"use client";

import { Sparkles, Cpu, LineChart, Workflow } from "lucide-react";
import { Reveal } from "../lib/scroll-motion";

const services = [
  {
    id: 1,
    category: "Web & Product",
    title: "Premium Web Experiences",
    description:
      "Design systems, conversion copy, and elite polish—shipped in weeks, not quarters.",
    points: [
      "Next.js + Tailwind, built for speed",
      "Component libraries that actually scale",
      "Story-driven landing pages that convert",
    ],
    icon: Sparkles,
    bulletClass: "bg-cyan-400",
  },
  {
    id: 2,
    category: "AI Systems",
    title: "AI Assistants & Automations",
    description:
      "Agents that book, qualify, and route—deeply integrated into the tools you already live in.",
    points: [
      "Voice & chat concierge for inbound",
      "CRM + calendar + ticketing integrations",
      "Automations that remove busywork, not humans",
    ],
    icon: Cpu,
    bulletClass: "bg-purple-400",
  },
  {
    id: 3,
    category: "Acquisition",
    title: "Growth Campaigns",
    description:
      "Paid social, local SEO, and reputation flows engineered for pipeline, not vanity metrics.",
    points: [
      "Meta & Google Ads built around offers",
      "Localized SEO and content playbooks",
      "Review generation and monitoring",
    ],
    icon: LineChart,
    bulletClass: "bg-emerald-400",
  },
  {
    id: 4,
    category: "Retention",
    title: "Lifecycle Systems",
    description:
      "Onboarding, loyalty, and referral systems that keep customers engaged long after the first sale.",
    points: [
      "Email & SMS journeys that feel human",
      "Insight reporting that isn't a spreadsheet dump",
      "Attribution you can actually explain",
    ],
    icon: Workflow,
    bulletClass: "bg-amber-400",
  },
];

export default function ValueGrid() {
  return (
    <section id="services" className="relative overflow-visible py-24 md:py-32">
      {/* Shared cinematic background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-cyan-500/12 blur-3xl" />
        <div className="absolute bottom-[-260px] right-[-120px] h-[520px] w-[520px] rounded-full bg-violet-500/35 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="h-full w-full [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:80px_80px]" />
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 lg:px-8">
        {/* Header stays the same */}
        <Reveal className="text-center mb-16 md:mb-20">
          <span className="tag mb-4">What we deliver</span>
          <h2 className="section-heading">
            A single team for full-stack growth
          </h2>
          <p className="section-subtitle">
            One partner across web, AI, and performance so your momentum never
            stalls.
          </p>
        </Reveal>

        {/* Tile grid (distinct from Process layout) */}
        <div className="grid gap-8 md:grid-cols-2 lg:gap-10">
          {services.map((service, index) => (
            <Reveal key={service.id} delay={index * 0.08}>
              <article className="service-card service-card-hover group">
                <div className="service-card-halo" />
                <div className="service-card-sweep" />

                <div className="service-card-inner px-7 py-6 md:px-8 md:py-7">
                  {/* top row: icon + meta */}
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div className="inline-flex items-center gap-3">
                      <div className="service-card-corner flex h-8 w-8 items-center justify-center border border-white/15 bg-slate-900/80">
                        <service.icon className="h-3.5 w-3.5 text-slate-100" />
                      </div>
                      <div className="service-meta">
                        <span className="opacity-70 mr-3">
                          {service.id.toString().padStart(2, "0")}
                        </span>
                        <span>{service.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* title + body */}
                  <h3 className="text-lg md:text-xl font-medium tracking-[0.16em] text-slate-50 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm md:text-[0.95rem] text-slate-300/85 leading-relaxed mb-5 max-w-md">
                    {service.description}
                  </p>

                  {/* bullets with coloured dashes (keep existing colours!) */}
                  <ul className="space-y-2.5 text-sm md:text-[0.95rem] text-slate-200/90">
                    {service.points.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span
                          className={`mt-[0.55rem] h-px w-5 rounded-full ${service.bulletClass}`}
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
