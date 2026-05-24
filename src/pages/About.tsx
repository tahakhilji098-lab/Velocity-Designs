import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const aboutPageStyles = `
  @keyframes float-slow {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  @keyframes pulse-node {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.15); }
  }
  @keyframes line-dash {
    0% { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: -20; }
  }
  @keyframes shimmer-sweep {
    0% { transform: translateX(-100%) skewX(-15deg); }
    100% { transform: translateX(300%) skewX(-15deg); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .noise-overlay {
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 200px 200px;
  }
`;

const coreValues = [
  {
    title: "Obsessive Execution",
    desc: "A focus on flawless precision across every single design asset token, code string, and animation timestamp. Every pixel interrogated, every curve perfected.",
    accent: "#ddb7ff",
  },
  {
    title: "Futuristic Aesthetics",
    desc: "Rejecting traditional layouts in pursuit of next-generation, high-fidelity dark environments and neo-noir spatial visuals. We define the unfamiliar.",
    accent: "#44e2cd",
  },
  {
    title: "Uncompromising Velocity",
    desc: "Striking market boundaries with extreme production momentum without cutting corner-case details. Speed married to precision — moving fast, breaking nothing.",
    accent: "#8c4fda",
  },
];

const scrollVariants = {
  hidden: { opacity: 0, y: 40, rotateX: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const GlassCardStack = () => (
  <div className="relative h-[380px] w-full flex items-center justify-center">
    {/* Card 3 — bottom layer */}
    <div
      className="absolute w-[85%] h-[280px] rounded-3xl bg-white/[0.01] backdrop-blur-xl border border-white/5 shadow-2xl animate-[float-slow_6s_ease-in-out_infinite_1s]"
      style={{ transform: "rotate(6deg) translateY(18px)" }}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600/5 to-cyan-500/5" />
      <div className="absolute top-3 left-5 w-12 h-2 rounded-full bg-white/5" />
      <div className="absolute top-10 left-5 w-24 h-1 rounded-full bg-white/5" />
      <div className="absolute top-14 left-5 w-16 h-1 rounded-full bg-white/3" />
      <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full border border-purple-500/20" />
    </div>

    {/* Card 2 — middle layer */}
    <div
      className="absolute w-[90%] h-[300px] rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] shadow-2xl animate-[float-slow_5s_ease-in-out_infinite_0.5s]"
      style={{ transform: "rotate(3deg) translateY(8px)" }}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/5 to-purple-600/5" />
      <div className="absolute top-4 left-6 w-16 h-2 rounded-full bg-white/5" />
      <div className="absolute top-12 left-6 w-32 h-1 rounded-full bg-white/5" />
      <div className="absolute top-16 left-6 w-20 h-1 rounded-full bg-white/3" />
      <div className="absolute top-24 left-6 w-28 h-1 rounded-full bg-white/[0.02]" />
      <div className="absolute bottom-6 right-6 w-6 h-6 rounded-full border border-cyan-400/20 shadow-[0_0_20px_rgba(68,226,205,0.1)]" />
      <div className="absolute top-1/2 right-8 w-px h-16 bg-gradient-to-b from-cyan-400/10 to-transparent" />
    </div>

    {/* Card 1 — top layer (hero card) */}
    <div
      className="absolute w-[95%] h-[320px] rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-2xl animate-[float-slow_4s_ease-in-out_infinite]"
      style={{ transform: "rotate(0deg) translateY(0px)" }}
    >
      {/* Cyan glow accent */}
      <div className="absolute -top-1 -left-1 w-[calc(100%+8px)] h-[calc(100%+8px)] rounded-3xl bg-gradient-to-br from-cyan-400/5 via-transparent to-magenta-500/5 opacity-50 pointer-events-none" />
      {/* Glass reflection line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
      {/* Content skeleton */}
      <div className="p-6 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(68,226,205,0.5)] animate-[pulse-node_2s_ease-in-out_infinite]" />
          <div className="w-20 h-2 rounded-full bg-white/10" />
        </div>
        <div className="w-3/4 h-3 rounded-full bg-white/10 mt-2" />
        <div className="w-1/2 h-2 rounded-full bg-white/5 mt-1" />
        <div className="w-2/3 h-2 rounded-full bg-white/5 mt-1" />
        <div className="w-1/3 h-2 rounded-full bg-white/5 mt-1" />
        {/* Bottom stat indicators */}
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400/60" />
            <div className="w-12 h-1.5 rounded-full bg-white/5" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60" />
            <div className="w-10 h-1.5 rounded-full bg-white/5" />
          </div>
        </div>
      </div>
      {/* Bottom glow line */}
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
    </div>
  </div>
);

export default function AboutPage() {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const cards = cardsRef.current?.children;
    if (!cards || cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 85%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#000511] relative selection:bg-purple-500/30 selection:text-white overflow-hidden" id="about-page">
      <style>{aboutPageStyles}</style>

      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Ambient Lighting Orbs */}
      <div className="absolute top-[-200px] left-[-200px] w-[700px] h-[700px] rounded-full bg-[#8c4fda] blur-[140px] opacity-[0.12] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[-150px] w-[600px] h-[600px] rounded-full bg-[#44e2cd] blur-[120px] opacity-[0.07] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full bg-[#3b82f6] blur-[100px] opacity-[0.04] pointer-events-none z-0" />

      {/* ═══════════════════════════════════════════
          HERO / HEADER
      ═══════════════════════════════════════════ */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden" id="about-hero">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(140,79,218,0.12)_0%,transparent_60%)] pointer-events-none z-0" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block px-5 py-2 rounded-full border border-purple-500/20 bg-purple-500/[0.06] text-[10px] font-bold tracking-[0.25em] text-purple-400 mb-8 uppercase drop-shadow-[0_0_12px_rgba(140,79,218,0.5)] backdrop-blur-sm"
          >
            OUR MANIFESTO
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-plus-jakarta text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold text-white tracking-tight leading-[1.08]"
          >
            ENGINEERING EMOTION.<br />DRIVING RADICAL VELOCITY.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-neutral-400 max-w-2xl mx-auto mt-6 text-center text-base md:text-lg leading-relaxed font-medium"
          >
            We are an elite squad of designers, interactive engineers, and motion artists rewriting the visual standard for digital products. We don't build standard software frames; we forge immersive premium realities.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-12 w-24 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent origin-center"
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SPLIT-SCREEN STORYTELLING GRID
      ═══════════════════════════════════════════ */}
      <section className="relative px-6 pb-32 overflow-hidden" id="about-narrative" style={{ perspective: "1200px" }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(140,79,218,0.06)_0%,transparent_55%)] pointer-events-none z-0" />

        <motion.div
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={scrollVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl mx-auto mt-8 items-center relative z-10"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Left Column - The Creed */}
          <div className="space-y-6">
            <span className="text-[10px] font-bold tracking-[0.25em] text-purple-400 uppercase block">
              OUR CREED
            </span>
            <h2 className="font-plus-jakarta text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-snug">
              Born from an obsession with dark elegance and fluid engineering, we reject ordinary user experiences.
            </h2>
            <p className="text-neutral-400 leading-relaxed text-base font-medium">
              Every pixel, every transition, every micro-interaction is a deliberate act of craft. We don't follow trends — we set them. Our studio operates at the intersection of high-fashion visual design and bleeding-edge interactive engineering, delivering digital artifacts that command attention.
            </p>
            <p className="text-neutral-500 leading-relaxed text-base font-medium">
              With a foundation rooted in cinematic post-production and systems-level design thinking, we bring a rare hybrid skillset to every engagement. We think in systems, execute in sprints, and deliver in full fidelity.
            </p>
          </div>

          {/* Right Column - Glassmorphic Card Stack */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <GlassCardStack />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          CORE VALUES PANEL (3-Grid)
      ═══════════════════════════════════════════ */}
      <section className="relative px-6 pb-32 overflow-hidden" id="about-values" style={{ perspective: "1200px" }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_60%,rgba(68,226,205,0.06)_0%,transparent_55%)] pointer-events-none z-0" />
        <div className="absolute bottom-[-120px] left-[-120px] w-[500px] h-[500px] rounded-full bg-[#44e2cd] blur-[100px] opacity-[0.05] pointer-events-none z-0" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-5 py-2 rounded-full border border-purple-500/20 bg-purple-500/[0.06] text-[10px] font-bold tracking-[0.25em] text-purple-400 mb-6 uppercase drop-shadow-[0_0_12px_rgba(140,79,218,0.5)] backdrop-blur-sm">
              CORE VALUES
            </span>
            <h2 className="font-plus-jakarta text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              What Drives Us
            </h2>
            <p className="text-neutral-400 max-w-xl mx-auto mt-4 text-base leading-relaxed font-medium">
              Three uncompromising principles that define every project we touch.
            </p>
          </motion.div>

          {/* Value Cards */}
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <div
                key={value.title}
                className="group relative opacity-0"
                style={{ transform: "translateY(40px)" }}
              >
                {/* Spinning Neon Border — cyan gradient glow */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
                  <div
                    className="absolute inset-[-200%] animate-[spin-slow_4s_linear_infinite]"
                    style={{ background: "conic-gradient(from 0deg, transparent 60%, rgba(6,182,212,0.5) 80%, rgba(68,226,205,0.7) 100%)" }}
                  />
                </div>

                {/* Card Body */}
                <div
                  className="relative bg-white/[0.02] border border-white/[0.05] backdrop-blur-2xl rounded-3xl p-8 overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_60px_rgba(6,182,212,0.2)] group-hover:border-cyan-400/30 h-full flex flex-col z-10"
                >
                  {/* Top glass reflection */}
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.10] to-transparent z-20" />

                  {/* Hover shimmer */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none z-10 overflow-hidden rounded-3xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:animate-[shimmer-sweep_0.9s_ease-out_forwards]" style={{ transform: "skewX(-15deg)" }} />
                  </div>

                  {/* Accent number indicator */}
                  <div className="flex items-center gap-3 mb-6">
                    <span
                      className="text-5xl font-plus-jakarta font-black tracking-tighter leading-none text-white/30 transition-all duration-500 group-hover:text-fuchsia-500 group-hover:drop-shadow-[0_0_12px_rgba(217,70,239,0.6)]"
                    >
                      {`0${index + 1}`}
                    </span>
                    <div className="h-[1px] flex-grow bg-gradient-to-r from-white/10 to-transparent" />
                  </div>

                  {/* Title */}
                  <h3 className="font-plus-jakarta text-xl font-extrabold text-white mb-4 tracking-tight relative z-10">
                    {value.title}
                  </h3>

                  {/* Description */}
                  <p className="text-neutral-400 leading-relaxed text-sm font-medium flex-grow relative z-10">
                    {value.desc}
                  </p>

                  {/* Accent bottom bar — cyan on hover */}
                  <div className="mt-6 h-[3px] rounded-full overflow-hidden bg-white/5 relative z-10">
                    <div
                      className="h-full rounded-full transition-all duration-700 group-hover:w-full w-0"
                      style={{ backgroundColor: "#44e2cd", boxShadow: "0 0 10px rgba(68,226,205,0.5)" }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          THE ARCHITECTS
      ═══════════════════════════════════════════ */}
      <section className="relative px-6 pb-32 overflow-hidden" id="about-architects" style={{ perspective: "1200px" }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,rgba(140,79,218,0.05)_0%,transparent_55%)] pointer-events-none z-0" />
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] rounded-full bg-[#ddb7ff] blur-[120px] opacity-[0.04] pointer-events-none z-0" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mb-16 relative z-10"
        >
          <span className="inline-block px-5 py-2 rounded-full border border-purple-500/20 bg-purple-500/[0.06] text-[10px] font-bold tracking-[0.25em] text-purple-400 uppercase drop-shadow-[0_0_12px_rgba(140,79,218,0.5)] backdrop-blur-sm">
            THE ARCHITECTS
          </span>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-16 items-center relative z-10">
          {/* Left — Cinematic portrait placeholder (3/5 width) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="md:col-span-3 relative"
          >
            {/* Portrait frame */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-900 via-[#0a0a14] to-neutral-950 border border-white/[0.06] shadow-2xl">
              {/* Dark atmospheric gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 z-10" />
              {/* Purple rim light from bottom-right */}
              <div className="absolute -bottom-[30%] -right-[30%] w-[80%] h-[80%] rounded-full bg-purple-600/20 blur-[100px] pointer-events-none" />
              {/* Cyan rim light from top-left */}
              <div className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none" />
              {/* Subtle noise grain overlay */}
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: "200px 200px" }} />
              {/* Vignette */}
              <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.5)] rounded-3xl pointer-events-none z-10" />
              {/* Silhouette / figure outline */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[85%]">
                {/* Abstract figure shape */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[55%] h-[75%] rounded-t-[40%] bg-gradient-to-t from-white/[0.04] to-transparent border border-white/[0.04] border-b-0" />
                <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[28%] h-[28%] rounded-full bg-white/[0.03] border border-white/[0.04]" />
              </div>
              {/* Badge — Creative Director */}
              <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-[pulse-node_2s_ease-in-out_infinite]" />
                <span className="text-[9px] font-bold tracking-widest uppercase text-gray-400">Creative Director</span>
              </div>
            </div>
          </motion.div>

          {/* Right — Biography (2/5 width) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="md:col-span-2 space-y-6"
          >
            <h2 className="font-plus-jakarta text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-snug">
              The Mind Behind the<br />
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Machine</span>
            </h2>

            <p className="text-gray-400 leading-relaxed text-base font-medium">
              Systems aren't built by committees. They're forged by a single vision that refuses to compromise. Every framework, every animation curve, every micro-interaction in our portfolio passes through one obsessive mind before it reaches your screen.
            </p>

            <p className="text-gray-400 leading-relaxed text-base font-medium">
              Trained at the intersection of industrial design and cinematic post-production, our lead architect brings a rare hybrid discipline — treating user interfaces as inhabitable spaces rather than flat surfaces, and code as a structural material rather than a technical afterthought.
            </p>

            <div className="h-px bg-gradient-to-r from-purple-500/30 via-cyan-400/20 to-transparent" />

            {/* Glowing purple signature */}
            <div className="pt-2">
              <svg
                className="w-48 h-12"
                viewBox="0 0 240 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <filter id="sigGlow">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Signature path — stylized cursive */}
                <path
                  d="M12 36 C 18 28, 24 20, 32 24 C 40 28, 38 36, 46 28 
                     C 54 20, 60 14, 68 22 C 76 30, 72 38, 80 30 
                     C 88 22, 94 16, 102 24 C 110 32, 108 38, 116 28 
                     C 124 18, 130 14, 138 22 C 146 30, 142 36, 150 26 
                     C 158 16, 164 12, 172 20 C 180 28, 178 34, 186 26 
                     C 194 18, 200 14, 208 22 C 216 30, 220 34, 228 26"
                  stroke="url(#sigGrad)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  filter="url(#sigGlow)"
                  opacity="0.85"
                />
                <linearGradient id="sigGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ddb7ff" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#8c4fda" />
                </linearGradient>
              </svg>
              <p className="text-[9px] font-bold tracking-[0.3em] text-purple-400/60 uppercase mt-1">
                Founder &amp; Lead Architect
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          BOTTOM CTA
      ═══════════════════════════════════════════ */}
      <section className="relative px-6 pb-32 overflow-hidden" id="about-cta">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(140,79,218,0.10)_0%,transparent_50%)] pointer-events-none z-0" />

        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: 5 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
          style={{ perspective: "800px" }}
        >
          <h2 className="font-plus-jakarta text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
            Ready to Build the Future?
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-base leading-relaxed font-medium mb-12">
            Join forces with us and forge something that transcends the ordinary. Your vision, our velocity.
          </p>

          {/* CTA Button — rotating neon-purple border */}
          <div className="inline-block relative overflow-hidden p-[1px] rounded-full group">
            <div className="absolute inset-[-200%] bg-[conic-gradient(from_0deg,transparent_70%,#a855f7_100%)] animate-[spin-slow_4s_linear_infinite] group-hover:animate-[spin-slow_1.5s_linear_infinite]" />
            <button className="relative block px-12 py-4 bg-[#000511] rounded-full text-sm font-bold text-white tracking-widest uppercase transition-all duration-300 group-hover:text-purple-200 group-hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] cursor-pointer">
              Start a Project
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
