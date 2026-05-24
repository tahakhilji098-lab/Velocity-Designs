import { useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const pricingStyles = `
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes pulse-slow {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.05); }
  }
  .card-entrance-1 { animation: fadeSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 100ms forwards; opacity: 0; }
  .card-entrance-2 { animation: fadeSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 250ms forwards; opacity: 0; }
  .card-entrance-3 { animation: fadeSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 400ms forwards; opacity: 0; }
`;

const tiers = [
  {
    name: "Ignition",
    price: "$2,500",
    period: "/ mo",
    target: "Best for early-stage startups.",
    features: [
      "Brand Identity System",
      "2 Landing Pages",
      "UI/UX Wireframing",
      "Basic Motion Graphics",
      "Async Comms",
    ],
    highlighted: false,
  },
  {
    name: "Velocity",
    price: "$4,500",
    period: "/ mo",
    target: "Best for scaling companies needing full-stack design.",
    features: [
      "Everything in Ignition",
      "Full Web App UI/UX",
      "Advanced Cinematic Motion",
      "Design System Management",
      "Dedicated Slack Channel",
    ],
    highlighted: true,
  },
  {
    name: "Orbit",
    price: "Custom",
    period: "",
    target: "Best for large teams needing dedicated design ops.",
    features: [
      "Everything in Velocity",
      "Unlimited Design Requests",
      "3D Asset Creation",
      "Priority Rendering",
      "Weekly Strategy Calls",
    ],
    highlighted: false,
  },
];

const faqs = [
  {
    q: "What is the typical turnaround time?",
    a: "Most projects kick off with an initial deliverable within 48–72 hours of kickoff. Full-scope engagements are delivered in phased sprints ranging from one to three weeks depending on complexity. We prioritize async throughput over synchronous bottlenecks.",
  },
  {
    q: "How does async communication work?",
    a: "We operate on a structured async model via a dedicated Slack channel. You post briefs, feedback, and requests on your timeline — we pick them up and execute within agreed service windows. No endless meetings, no context-switching chaos.",
  },
  {
    q: "Can I pause or cancel my subscription?",
    a: "Absolutely. All subscriptions run month-to-month with zero lock-in. You can pause at any time with 7 days' notice and resume when your pipeline demands it. Your deliverables and assets remain yours, always.",
  },
  {
    q: "What scope does the monthly retainer cover?",
    a: "Each tier defines a clear scope of output — from brand identity and landing pages in Ignition, to full web app UI/UX and 3D asset creation in Orbit. Scope creep is handled transparently via change requests before any work begins.",
  },
];

const CheckIcon = () => (
  <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
    <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </div>
);

function PricingCard({ tier, index }: { tier: typeof tiers[0]; index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(mouseY, { stiffness: 120, damping: 20 });
  const rotateY = useSpring(mouseX, { stiffness: 120, damping: 20 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = -(e.clientY - centerY) / (rect.height / 2);

    mouseX.set(x * 6);
    mouseY.set(y * 6);

    const pctX = ((e.clientX - rect.left) / rect.width) * 100;
    const pctY = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--spot-x", `${pctX}%`);
    e.currentTarget.style.setProperty("--spot-y", `${pctY}%`);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const entranceClass = tier.highlighted
    ? "card-entrance-2"
    : index === 0
    ? "card-entrance-1"
    : "card-entrance-3";

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        "--spot-x": "50%",
        "--spot-y": "50%",
      } as React.CSSProperties}
      className={`relative ${entranceClass} ${tier.highlighted ? "scale-105" : ""}`}
    >
      {/* Most Popular Badge — sits above the card, not clipped */}
      {tier.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30">
          <span className="inline-block bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-purple-500/20 animate-[pulse-slow_3s_ease-in-out_infinite]">
            MOST POPULAR
          </span>
        </div>
      )}

      <div
        className="relative bg-[#0a0a0f]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col h-full shadow-2xl overflow-hidden"
        style={
          tier.highlighted
            ? { borderColor: "rgba(168,85,247,0.3)", boxShadow: "0 0 60px rgba(140,79,218,0.25), 0 25px 50px rgba(0,0,0,0.4)" }
            : {}
        }
      >
        {/* Reactive highlight spot */}
        <div
          className="absolute inset-0 pointer-events-none z-0 rounded-3xl"
          style={{
            background: "radial-gradient(circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(168,85,247,0.12) 0%, transparent 60%)",
          }}
        />

        {/* Top glass reflection */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent z-20" />

        {/* Card Header */}
        <div className="mb-6 relative z-10" style={{ transform: "translateZ(30px)" }}>
          <h3 className="font-plus-jakarta text-xl font-extrabold text-white mb-2 tracking-tight">
            {tier.name}
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="font-plus-jakarta text-5xl font-bold text-white">
              {tier.price}
            </span>
            {tier.period && (
              <span className="text-neutral-500 text-lg font-medium">{tier.period}</span>
            )}
          </div>
          <p className="text-neutral-500 text-sm mt-2 font-medium">{tier.target}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 mb-6 relative z-10" style={{ transform: "translateZ(20px)" }} />

        {/* Feature List */}
        <ul className="flex flex-col gap-4 flex-grow mb-8 relative z-10" style={{ transform: "translateZ(20px)" }}>
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <CheckIcon />
              <span className="text-white/80 text-sm font-medium">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
          {tier.highlighted ? (
            <div className="relative overflow-hidden p-[1px] rounded-full group/btn w-full">
              <div className="absolute inset-[-200%] bg-[conic-gradient(from_0deg,transparent_70%,#a855f7_100%)] animate-[spin_4s_linear_infinite] group-hover:animate-[spin_1.5s_linear_infinite]" />
              <button className="relative block w-full px-8 py-3.5 bg-[#000511] group-hover/btn:bg-purple-950 rounded-full text-sm font-bold text-white tracking-wider transition-all duration-300 group-hover/btn:text-purple-200 group-hover/btn:shadow-[0_0_40px_rgba(168,85,247,0.5)] cursor-pointer">
                Get Started
              </button>
            </div>
          ) : (
            <button className="w-full px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-purple-950 rounded-full text-sm font-bold text-white tracking-wider transition-all duration-300 cursor-pointer">
              Get Started
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Pricing() {
  return (
    <div className="min-h-screen bg-[#000511] relative selection:bg-purple-500/30 selection:text-white overflow-hidden">
      <style>{pricingStyles}</style>

      {/* Ambient Glow Orb */}
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#8c4fda] blur-[120px] opacity-20 pointer-events-none z-0" />

      {/* Hero Section */}
      <section className="relative pt-40 pb-16 px-6 overflow-hidden" id="pricing-hero">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block px-5 py-2 rounded-full border border-purple-500/20 bg-purple-500/[0.06] text-[10px] font-bold tracking-[0.25em] text-purple-400 mb-8 uppercase drop-shadow-[0_0_12px_rgba(140,79,218,0.5)] backdrop-blur-sm"
          >
            TRANSPARENT PRICING
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-plus-jakarta text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold text-white tracking-tight leading-[1.08]"
          >
            SCALABLE DESIGN.<br />PREDICTABLE INVESTMENT.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-neutral-400 max-w-2xl mx-auto mt-4 text-center text-base"
          >
            Choose the perfect velocity for your brand. No hidden fees, no complex contracts. Just premium digital execution.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-12 w-24 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent origin-center"
          />
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="relative px-6 pb-32 pt-40 overflow-hidden" id="pricing-grid">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 mb-24 relative z-10">
          {tiers.map((tier, index) => (
            <PricingCard key={tier.name} tier={tier} index={index} />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════ */}
      <section className="relative px-6 pb-32 overflow-hidden" id="pricing-faq">
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-block px-5 py-2 rounded-full border border-purple-500/20 bg-purple-500/[0.06] text-[10px] font-bold tracking-[0.25em] text-purple-400 mb-6 uppercase drop-shadow-[0_0_12px_rgba(140,79,218,0.5)] backdrop-blur-sm">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-plus-jakarta text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Answers You Need
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto mt-4 text-base leading-relaxed font-medium">
              Everything you're wondering about working with a high-end design subscription agency.
            </p>
          </motion.div>

          <FAQAccordion />
        </div>
      </section>
    </div>
  );
}

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="space-y-0">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;

        return (
          <div
            key={i}
            className="group border-b border-white/5 cursor-pointer select-none"
            onClick={() => toggle(i)}
          >
            <div className="flex items-center justify-between py-5 px-1 transition-colors duration-300 group-hover:bg-white/[0.01]">
              <span className="font-plus-jakarta text-base font-semibold text-white/90 tracking-tight pr-4">
                {faq.q}
              </span>
              <div
                className={`shrink-0 w-6 h-6 flex items-center justify-center transition-transform duration-400 ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                <svg className="w-4 h-4 text-purple-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="8" y1="2" x2="8" y2="14" />
                  <line x1="2" y1="8" x2="14" y2="8" />
                </svg>
              </div>
            </div>

            <div
              className={`grid transition-all duration-400 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-gray-400 text-sm leading-relaxed pb-5 px-1">
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
