import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/* ─── Hero Particle Field (Canvas 3D Warp) ─── */
const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    
    const particles: any[] = [];
    const particleCount = 400;
    
    let mouse = { x: w/2, y: h/2 };
    
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * w,
        size: Math.random() * 1.5 + 0.5
      });
    }
    
    let animationFrameId: number;
    const render = () => {
      ctx.fillStyle = 'rgba(3, 3, 3, 0.2)';
      ctx.fillRect(0, 0, w, h);
      
      const speed = 2 + (Math.abs(mouse.x - w/2) + Math.abs(mouse.y - h/2)) * 0.01;
      const cx = w/2;
      const cy = h/2;
      
      particles.forEach(p => {
        p.z -= speed;
        if (p.z <= 0) {
          p.z = w;
          p.x = Math.random() * w;
          p.y = Math.random() * h;
        }
        
        const k = 128.0 / p.z;
        const px = (p.x - cx) * k + cx;
        const py = (p.y - cy) * k + cy;
        
        if (px >= 0 && px <= w && py >= 0 && py <= h) {
          const s = p.size * k;
          ctx.beginPath();
          ctx.arc(px, py, s, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(140, 79, 218, ${1 - p.z / w})`;
          ctx.fill();
        }
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    
    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};

/* ─── Magnetic Button ─── */
const MagneticButton = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current!.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x * 0.2, y: position.y * 0.2 }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

/* ─── Bento Card (Magnetic Tilt & Glowing Border) ─── */
const BentoCard = ({ children, className, colSpan }: { children: React.ReactNode, className?: string, colSpan?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = ((y - centerY) / centerY) * -10;
    const tiltY = ((x - centerX) / centerX) * 10;
    setTilt({ x: tiltX, y: tiltY });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={colSpan}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setTilt({ x: 0, y: 0 }); }}
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ transformStyle: "preserve-3d" }}
        className={`relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-md interactive group w-full h-full ${className}`}
      >
        {/* Glowing Tracking Border */}
        <div 
          className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(140, 79, 218, 0.15), transparent 40%)`
          }}
        />
        <div className="relative z-10 w-full h-full p-6 md:p-8 flex flex-col shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── Visual Components for Cards ─── */
const WireframeVisual = () => (
  <div className="w-full h-full min-h-[200px] flex items-center justify-center relative overflow-hidden group">
    <motion.svg 
      viewBox="0 0 100 100" 
      className="w-32 h-32 text-cyan-500/40 drop-shadow-[0_0_15px_rgba(68,226,205,0.4)]"
      animate={{ rotateZ: 360, rotateX: 20, rotateY: 30 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <polygon points="50,10 90,90 10,90" fill="none" stroke="currentColor" strokeWidth="1" />
      <polygon points="50,90 90,10 10,10" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-50" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" className="opacity-70" />
      <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
    </motion.svg>
  </div>
);

const DashboardVisual = () => {
  return (
    <div className="w-full h-full min-h-[200px] flex items-center justify-center p-4 relative group perspective-1000">
      <div className="w-full max-w-sm aspect-video rounded-xl bg-[#09090b] border border-white/10 shadow-2xl overflow-hidden flex flex-col relative transform transition-transform duration-700 group-hover:scale-105 group-hover:rotate-1">
        <div className="h-6 border-b border-white/10 bg-white/[0.02] flex items-center px-3 gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
          <div className="w-2 h-2 rounded-full bg-green-500/50" />
        </div>
        <div className="flex-1 p-4 grid grid-cols-3 gap-3">
          <div className="col-span-2 space-y-3">
            <div className="h-2 rounded bg-white/10 w-3/4 animate-pulse" />
            <div className="h-2 rounded bg-white/5 w-1/2" />
            <div className="h-2 rounded bg-white/5 w-5/6" />
            <div className="mt-4 p-2 rounded bg-emerald-500/10 border border-emerald-500/20 font-mono text-[8px] text-emerald-400">
              <span className="inline-block overflow-hidden whitespace-nowrap border-r border-emerald-400 pr-1 animate-[typing_3s_steps(30,end)_infinite]">
                &gt; System optimized...
              </span>
            </div>
          </div>
          <div className="col-span-1 border-l border-white/10 pl-3 flex flex-col gap-3 justify-center">
             <div className="w-full aspect-square rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

const VideoVisual = () => {
  return (
    <div className="w-full h-full min-h-[200px] relative overflow-hidden rounded-xl group bg-black">
      <video 
        src="/animated.mp4" 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen transition-all duration-700 group-hover:opacity-100 group-hover:scale-110"
      />
      {/* Glitch overlay on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 mix-blend-color-dodge transition-opacity duration-300 pointer-events-none overflow-hidden">
        <div className="absolute inset-[-100%] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] animate-[spin_10s_linear_infinite]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-4 left-4 font-mono text-[10px] text-white/50 group-hover:text-white transition-colors duration-300 tracking-widest uppercase flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        REC
      </div>
    </div>
  );
};

/* ─── GSAP Text Reveal ─── */
const SplitTextReveal = ({ text }: { text: string }) => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    const chars = containerRef.current.querySelectorAll('.char');
    gsap.fromTo(chars, 
      { opacity: 0, y: 50, rotateX: -90, z: -100 },
      { 
        opacity: 1, 
        y: 0, 
        rotateX: 0, 
        z: 0, 
        duration: 1.2, 
        stagger: 0.03, 
        ease: "back.out(1.7)",
        delay: 0.2
      }
    );
  }, []);

  const words = text.split(' ');
  return (
    <h1 ref={containerRef} className="font-plus-jakarta text-4xl md:text-5xl lg:text-[4rem] xl:text-7xl font-black text-white tracking-tighter leading-[1.05] perspective-1000">
      {words.map((word, i) => (
        <span key={i} className="inline-block mr-[0.25em] whitespace-nowrap">
          {word.split('').map((char, j) => (
            <span key={j} className="char inline-block transform-style-preserve-3d">{char}</span>
          ))}
        </span>
      ))}
    </h1>
  );
};

/* ─── Process Architecture Pipeline ─── */
const ProcessArchitecture = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!pathRef.current || !containerRef.current) return;
    
    const path = pathRef.current;
    const length = path.getTotalLength();
    
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top center",
      end: "bottom center",
      animation: gsap.to(path, { strokeDashoffset: 0, ease: "none" }),
      scrub: 1
    });
    
    const steps = containerRef.current.querySelectorAll('.process-step');
    steps.forEach((step) => {
      gsap.fromTo(step, 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: step,
            start: "top 85%",
          }
        }
      );
    });
  }, []);

  const stepsData = [
    { num: "01", title: "Deep Discovery", desc: "Understanding brand DNA and psychographics.", color: "#ddb7ff" },
    { num: "02", title: "Prototyping", desc: "Rapid concept iteration and design sprints.", color: "#44e2cd" },
    { num: "03", title: "Velocity Build", desc: "Polishing design tokens and production-grade code.", color: "#8c4fda" },
    { num: "04", title: "Deployment", desc: "Secure launch protocols with automated CI/CD.", color: "#4ade80" },
  ];

  return (
    <div ref={containerRef} className="relative py-32 max-w-5xl mx-auto px-6">
      <div className="absolute top-0 bottom-0 left-[48px] md:left-1/2 md:-translate-x-1/2 w-[4px] z-0">
        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <path 
            ref={pathRef}
            d="M 2 0 L 2 10000"
            stroke="url(#gradient)" 
            strokeWidth="4" 
            fill="none" 
            className="drop-shadow-[0_0_10px_rgba(140,79,218,0.8)]"
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8c4fda" />
              <stop offset="50%" stopColor="#44e2cd" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="space-y-24 md:space-y-40 relative z-10">
        {stepsData.map((step, i) => {
          const isEven = i % 2 === 0;
          return (
            <div key={i} className={`process-step flex flex-col md:flex-row items-center gap-8 md:gap-16 ${isEven ? 'md:flex-row-reverse' : ''}`}>
              <div className="w-16 h-16 shrink-0 rounded-full bg-black border-[3px] flex items-center justify-center relative group" style={{ borderColor: step.color }}>
                <div className="absolute inset-0 rounded-full blur-[15px] opacity-40 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundColor: step.color }} />
                <span className="relative font-black text-xl font-mono text-white group-hover:scale-125 transition-transform duration-500" style={{ textShadow: `0 0 10px ${step.color}` }}>
                  {step.num}
                </span>
              </div>
              
              <div className={`flex-1 w-full interactive bg-white/[0.02] backdrop-blur-md border border-white/[0.05] p-8 rounded-2xl hover:border-white/20 transition-all duration-500 ${isEven ? 'md:text-right' : ''}`}>
                <h3 className="text-3xl font-extrabold text-white mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-neutral-400 transition-all" style={{ textShadow: `0 0 20px ${step.color}40` }}>
                  {step.title}
                </h3>
                <p className="text-neutral-400 text-lg font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   SERVICES PAGE COMPONENT
═══════════════════════════════════════════════════ */
export default function ServicesPage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-[#030303] min-h-screen text-white overflow-hidden selection:bg-purple-500/30 font-sans">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDEwaDQwTTAgMjBoNDBNMCAzMGg0ME0xMCAwVjQwTTIwIDBWNDBNMzAgMFY0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-600/10 blur-[150px] mix-blend-screen" />
      </div>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden interactive">
          <ParticleField />
          <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="px-6 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-bold tracking-[0.3em] text-purple-300 mb-8 uppercase backdrop-blur-md animate-[pulse-slow_3s_ease-in-out_infinite] shadow-[0_0_20px_rgba(140,79,218,0.4)]"
            >
              Our Capabilities
            </motion.div>
            
            <SplitTextReveal text="ELITE DIGITAL DESIGN. UNMATCHED VELOCITY." />
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-8 text-neutral-400 max-w-2xl text-lg md:text-xl font-medium leading-relaxed"
            >
              We bridge the gap between abstract concept and premium execution. Elevating brands into immersive digital experiences.
            </motion.p>
          </div>
        </section>

        {/* SERVICES BENTO GRID */}
        <section className="py-32 px-6 max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-6">
            {/* Card 1: Brand Architecture */}
            <BentoCard colSpan="md:col-span-2" className="flex flex-col justify-between">
              <div className="relative z-10 max-w-md">
                <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 text-cyan-400 shadow-[0_0_15px_rgba(68,226,205,0.2)]">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                </div>
                <h3 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Brand Architecture</h3>
                <p className="text-neutral-400 font-medium leading-relaxed">
                  Crafting unforgettable visual ecosystems using strict geometric grid layouts, high-end logomarks, and custom typography.
                </p>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-60 pointer-events-none">
                <WireframeVisual />
              </div>
            </BentoCard>

            {/* Card 2: UI/UX */}
            <BentoCard colSpan="md:col-span-1" className="flex flex-col justify-between">
              <div className="relative z-10 mb-6">
                 <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-3 tracking-tight">High-Fidelity UI/UX</h3>
                <p className="text-neutral-400 text-sm font-medium leading-relaxed">
                  Engineering immersive, dark-mode-first interfaces optimized for fluid interactions.
                </p>
              </div>
              <div className="h-40 w-full relative">
                <DashboardVisual />
              </div>
            </BentoCard>

            {/* Card 3: Cinematic Post-Production */}
            <BentoCard colSpan="md:col-span-3" className="flex flex-col md:flex-row justify-between items-center gap-8 overflow-hidden p-0">
              <div className="relative z-10 flex flex-col justify-center md:w-1/2 md:h-full">
                <div className="w-14 h-14 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-tight">Cinematic Motion</h3>
                <p className="text-neutral-400 font-medium leading-relaxed max-w-sm">
                  Dynamic graphics system design, sound orchestration, and high-energy rhythm edits moving beyond templates.
                </p>
              </div>
              <div className="relative md:absolute w-full md:w-2/3 h-48 md:h-full right-0 bottom-0 md:top-0 z-0 mask-image-linear">
                <VideoVisual />
              </div>
            </BentoCard>
          </div>
        </section>

        {/* PROCESS ARCHITECTURE */}
        <section className="relative z-10 bg-black/40 border-y border-white/5 backdrop-blur-xl">
           <div className="text-center pt-32 px-6">
            <span className="inline-block px-5 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-[10px] font-bold tracking-[0.25em] text-cyan-400 mb-6 uppercase shadow-[0_0_15px_rgba(68,226,205,0.3)]">
              Pipeline
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Process Architecture
            </h2>
          </div>
          <ProcessArchitecture />
        </section>

        {/* CTA SECTION */}
        <section className="py-40 px-6 flex flex-col items-center justify-center text-center relative z-10 interactive">
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-12 leading-tight">
            READY TO ARCHITECT<br/>YOUR NEXT SYSTEM?
          </h2>
          <MagneticButton className="bg-white text-black px-14 py-6 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-neutral-200 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300">
            Initiate Project
          </MagneticButton>
        </section>
      </main>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-preserve-3d { transform-style: preserve-3d; }
        .mask-image-linear { -webkit-mask-image: linear-gradient(to right, transparent, black 40%); mask-image: linear-gradient(to right, transparent, black 40%); }
        @media (max-width: 768px) {
          .mask-image-linear { -webkit-mask-image: linear-gradient(to top, transparent, black 40%); mask-image: linear-gradient(to top, transparent, black 40%); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
