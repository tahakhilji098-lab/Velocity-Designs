'use client';

import { useState } from "react";

const portfolioStyles = `
  .noise-overlay {
    position: fixed;
    inset: 0;
    pointer-events: none;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 200px 200px;
  }
`;

const categories = ["All Work", "UI/UX Systems", "Brand Architecture", "Motion Design"];

interface Project {
  title: string;
  summary: string;
  tags: string[];
  category: string;
  gradient: string;
  accentColor: string;
}

const projects: Project[] = [
  {
    title: "Nexus Platform",
    summary: "A full-spectrum design system and interactive dashboard for a fintech leader, unifying data visualization with cinematic motion.",
    tags: ["React / Three.js", "Design System"],
    category: "UI/UX Systems",
    gradient: "from-purple-900/40 via-violet-800/20 to-cyan-900/30",
    accentColor: "#8c4fda",
  },
  {
    title: "Aether Identity",
    summary: "Comprehensive brand architecture including geometric logomark, typography system, and spatial guidelines for a luxury tech brand.",
    tags: ["Brand Identity", "Art Direction"],
    category: "Brand Architecture",
    gradient: "from-amber-900/30 via-purple-900/20 to-rose-900/30",
    accentColor: "#ddb7ff",
  },
  {
    title: "Cyberia Motion",
    summary: "High-energy rhythm edit and dynamic graphics package for a global product launch campaign across digital and broadcast.",
    tags: ["Motion Design", "Post-Production"],
    category: "Motion Design",
    gradient: "from-cyan-900/40 via-blue-800/20 to-violet-900/30",
    accentColor: "#44e2cd",
  },
  {
    title: "Vertex Dashboard",
    summary: "High-fidelity dark-mode SaaS interface with real-time analytics, micro-interactions, and an immersive glassmorphic UI layer.",
    tags: ["React / Tailwind", "UI/UX"],
    category: "UI/UX Systems",
    gradient: "from-emerald-900/30 via-teal-800/20 to-slate-900/40",
    accentColor: "#4ade80",
  },
  {
    title: "Monolith Studios",
    summary: "End-to-end brand relaunch encompassing visual identity, web experience, and cinematic sizzle reel for an entertainment studio.",
    tags: ["Brand Identity", "Web Dev"],
    category: "Brand Architecture",
    gradient: "from-fuchsia-900/30 via-purple-800/20 to-indigo-900/30",
    accentColor: "#a855f7",
  },
  {
    title: "Pulse Campaign",
    summary: "A cross-platform motion campaign blending typographic animation, 3D product visualization, and rhythmic sound design.",
    tags: ["Motion Design", "3D Graphics"],
    category: "Motion Design",
    gradient: "from-rose-900/30 via-pink-800/20 to-orange-900/20",
    accentColor: "#f43f5e",
  },
];

const ProjectCard = ({ project }: { project: Project }) => (
  <div className="project-card group relative">
    {/* Card Container */}
    <div className="bg-white/[0.01] backdrop-blur-2xl border border-white/[0.05] rounded-3xl overflow-hidden relative shadow-2xl flex flex-col transition-all duration-500 group-hover:border-cyan-500/30 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
      {/* Top glass reflection */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.10] to-transparent z-20" />

      {/* Upper Media Frame (65%) */}
      <div className="aspect-[16/10] w-full overflow-hidden relative bg-neutral-900/40">
        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`}>
          {/* Abstract decorative elements */}
          <div className="absolute top-4 left-4 w-8 h-8 rounded-lg border border-white/10 bg-white/[0.03] backdrop-blur-sm" />
          <div className="absolute bottom-6 right-6 w-16 h-16 rounded-full border border-white/8 bg-white/[0.02]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-white/[0.06]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/[0.04]" />
          <div className="absolute top-[30%] right-[20%] w-px h-16 bg-gradient-to-b from-white/10 to-transparent" />
          <div className="absolute bottom-[25%] left-[15%] w-px h-10 bg-gradient-to-t from-white/10 to-transparent" />
          <div className="absolute top-[20%] left-[10%] w-[40%] h-px bg-gradient-to-r from-white/10 to-transparent -rotate-12" />
          <div className="absolute top-[15%] right-[25%] w-1.5 h-1.5 rounded-full bg-white/20" />
          <div className="absolute bottom-[20%] left-[30%] w-1 h-1 rounded-full bg-white/15" />
          <div className="absolute top-[60%] right-[15%] w-1 h-1 rounded-full bg-white/10" />
        </div>
      </div>

      {/* Lower Metadata Card (35%) */}
      <div className="p-6 flex flex-col gap-2 bg-gradient-to-b from-transparent to-black/40 relative z-10">
        {/* Tags row */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border border-white/10 text-neutral-400 bg-white/[0.03]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Project title + arrow icon */}
        <div className="flex items-center justify-between mt-1">
          <h3 className="font-plus-jakarta text-lg font-extrabold text-white tracking-tight">
            {project.title}
          </h3>
          <svg
            className="w-4 h-4 text-neutral-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" />
          </svg>
        </div>

        {/* Summary */}
        <p className="text-neutral-500 leading-relaxed text-xs font-medium">
          {project.summary}
        </p>
      </div>
    </div>
  </div>
);

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("All Work");

  const filteredProjects = activeCategory === "All Work"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-[#030303] text-white pt-32 selection:bg-purple-500/30 selection:text-white overflow-x-hidden">
      <style>{portfolioStyles}</style>

      {/* Noise Overlay */}
      <div className="noise-overlay z-[-1]" />

      {/* Ambient Lighting Orbs */}
      <div className="fixed top-[-250px] right-[-180px] w-[800px] h-[800px] rounded-full bg-[#8c4fda] blur-[150px] opacity-[0.15] pointer-events-none -z-10" />
      <div className="fixed bottom-[10%] left-[-200px] w-[600px] h-[600px] rounded-full bg-[#44e2cd] blur-[120px] opacity-[0.07] pointer-events-none -z-10" />
      <div className="fixed top-[40%] left-[15%] w-[400px] h-[400px] rounded-full bg-[#a855f7] blur-[100px] opacity-[0.04] pointer-events-none -z-10" />

      {/* HERO / HEADER */}
      <section className="relative pt-40 pb-16 px-6 overflow-hidden" id="portfolio-hero">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(140,79,218,0.12)_0%,transparent_60%)] pointer-events-none z-0" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block px-5 py-2 rounded-full border border-purple-500/20 bg-purple-500/[0.06] text-[10px] font-bold tracking-[0.25em] text-purple-400 mb-8 uppercase drop-shadow-[0_0_12px_rgba(140,79,218,0.5)] backdrop-blur-sm">
            SELECTED WORKS
          </span>

          <h1 className="font-plus-jakarta text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold text-white tracking-tight leading-[1.08]">
            CRAFTING DIGITAL MONUMENTS.<br />SHAPING NEXT-GEN INTERFACES.
          </h1>

          <p className="text-neutral-400 max-w-2xl mx-auto mt-6 text-center text-base md:text-lg leading-relaxed font-medium">
            A curated vault of high-fidelity visual architectures, immersive interfaces, and raw cinematic energy engineered for industry leaders.
          </p>

          <div className="mx-auto mt-12 w-24 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase border transition-all duration-300 cursor-pointer ${
                  activeCategory === cat
                    ? "text-white bg-white/10 border-purple-500/60 shadow-[0_0_25px_rgba(168,85,247,0.4)]"
                    : "text-neutral-400 border-white/5 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECT SHOWCASE GRID */}
      <section className="relative px-6 pb-32 overflow-hidden" id="portfolio-grid">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(140,79,218,0.06)_0%,transparent_55%)] pointer-events-none z-0" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto mt-8 mb-24 relative z-10">
          {filteredProjects?.map((project, index) => (
            <div key={project.title} className={index % 2 === 1 ? 'md:translate-y-12' : ''}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {filteredProjects?.length === 0 && (
          <div className="text-center py-20 relative z-10">
            <p className="text-neutral-500 text-sm font-medium">No projects match this category.</p>
          </div>
        )}
      </section>

      {/* BOTTOM CTA */}
      <section className="relative px-6 pb-32 overflow-hidden" id="portfolio-cta">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(140,79,218,0.10)_0%,transparent_50%)] pointer-events-none z-0" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-plus-jakarta text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
            Want to Create Something Iconic?
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-base leading-relaxed font-medium mb-12">
            Let's build a project that redefines what's possible. Your vision, our craft.
          </p>

          <div className="inline-block relative overflow-hidden p-[1px] rounded-full group">
            <div className="absolute inset-[-200%] bg-[conic-gradient(from_0deg,transparent_70%,#a855f7_100%)] animate-[spin-slow_4s_linear_infinite] group-hover:animate-[spin-slow_1.5s_linear_infinite]" />
            <button className="relative block px-12 py-4 bg-[#000511] rounded-full text-sm font-bold text-white tracking-widest uppercase transition-all duration-300 group-hover:text-purple-200 group-hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] cursor-pointer">
              Start a Project
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
