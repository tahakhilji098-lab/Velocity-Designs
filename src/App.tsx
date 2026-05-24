import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { Triangle, Search, Bell, Sparkles, PencilRuler, Monitor, PlayCircle, Mail, AtSign, Share2, ArrowRight } from "lucide-react";
import ServicesPage from "./pages/Services";
import PricingPage from "./pages/Pricing";
import AboutPage from "./pages/About";
import PortfolioPage from "./pages/Portfolio";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    mq.addEventListener("change", handler as EventListener);
    return () => mq.removeEventListener("change", handler as EventListener);
  }, [breakpoint]);
  return isMobile;
}

const CursorFollower = () => {
  const isMobile = useIsMobile();
  const dotRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [label, setLabel] = useState('');
  const hoveredRef = useRef(false);

  useEffect(() => {
    if (isMobile) return;
    const dot = dotRef.current;
    if (!dot) return;
    let mouseX = 0, mouseY = 0, currentX = 0, currentY = 0;

    const onMouseMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };

    const onMouseOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('[data-cursor]');
      if (el && !hoveredRef.current) {
        hoveredRef.current = true;
        const type = el.getAttribute('data-cursor');
        setIsHovered(true);
        setLabel(type === 'project' ? 'View Project' : 'Explore');
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('[data-cursor]');
      if (el && hoveredRef.current) {
        hoveredRef.current = false;
        setIsHovered(false);
        setLabel('');
      }
    };

    const animate = () => {
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;
      dot.style.left = `${currentX}px`;
      dot.style.top = `${currentY}px`;
      requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    requestAnimationFrame(animate);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div
      ref={dotRef}
      className="fixed pointer-events-none z-[9999] flex items-center justify-center"
      style={{
        width: isHovered ? 100 : 14,
        height: isHovered ? 100 : 14,
        borderRadius: '50%',
        background: isHovered ? 'rgba(221,183,255,0.08)' : 'rgba(221,183,255,0.35)',
        border: `1px solid ${isHovered ? 'rgba(221,183,255,0.25)' : 'rgba(221,183,255,0.5)'}`,
        backdropFilter: isHovered ? 'blur(8px)' : 'none',
        WebkitBackdropFilter: isHovered ? 'blur(8px)' : 'none',
        transform: 'translate(-50%, -50%)',
        transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1), height 0.4s cubic-bezier(0.16,1,0.3,1), background 0.4s ease, border 0.4s ease',
      }}
    >
      {isHovered && (
        <span className="text-[10px] font-bold text-[#ddb7ff] uppercase tracking-[0.2em] whitespace-nowrap select-none">
          {label}
        </span>
      )}
    </div>
  );
};

const MagneticWrapper = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const elRef = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent) => {
    const el = elRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const dist = Math.sqrt(x * x + y * y);
    const maxDist = 140;
    if (dist < maxDist) {
      const strength = (1 - dist / maxDist) * 0.3;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    }
  };

  const onMouseLeave = () => {
    const el = elRef.current;
    if (!el) return;
    el.style.transform = '';
  };

  // Touch feedback: momentary scale on tap
  const onTouchStart = (e: React.TouchEvent) => {
    const el = elRef.current;
    if (!el) return;
    el.style.transform = 'scale(0.97)';
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const el = elRef.current;
    if (!el) return;
    el.style.transform = '';
  };

  return (
    <div
      ref={elRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className={className}
      style={{ transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      {children}
    </div>
  );
};

/**
 * Scroll manager - scrolls to top on route changes
 */
const ScrollManager = () => {
  const location = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);
  return null;
};


const customStyles = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes navbarDropIn {
    from { opacity: 0; transform: translateY(-20px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes heroFadeUp {
    from { opacity: 0; transform: translateY(40px); filter: blur(4px); }
    to { opacity: 1; transform: translateY(0); filter: blur(0); }
  }
  @keyframes subheadFadeUp {
    from { opacity: 0; transform: translateY(40px); filter: blur(2px); }
    to { opacity: 1; transform: translateY(0); filter: blur(0); }
  }
  @keyframes buttonLiftIn {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-navbar-drop { animation: navbarDropIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .animate-hero-fade { animation: heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 0.2s; opacity: 0; }
  .animate-subhead-fade { animation: subheadFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 1.0s; opacity: 0; }
  .animate-button-lift { animation: buttonLiftIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; animation-delay: 1.4s; opacity: 0; }
  @keyframes grid-pulse {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.8); opacity: 1; }
  }
  @keyframes play-pulse {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.2); opacity: 0.7; }
  }
  @keyframes bokeh-drift {
    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.15; }
    25% { transform: translate(8px, -12px) scale(1.1); opacity: 0.35; }
    50% { transform: translate(-6px, 10px) scale(0.95); opacity: 0.25; }
    75% { transform: translate(10px, 6px) scale(1.05); opacity: 0.3; }
  }
  .energy-path { fill: none; stroke: url(#energyGrad); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
  .energy-path-vert { fill: none; stroke: url(#vertGrad); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
  .focus-glow {
    border-color: rgba(221, 183, 255, 0.35) !important;
    box-shadow: 0 0 25px rgba(221, 183, 255, 0.12), 0 0 50px rgba(221, 183, 255, 0.06), inset 0 0 15px rgba(221, 183, 255, 0.03) !important;
  }
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    25% { background-position: 100% 0%; }
    50% { background-position: 100% 100%; }
    75% { background-position: 0% 100%; }
    100% { background-position: 0% 50%; }
  }
  .step-active {
    box-shadow: 0 0 60px rgba(221,183,255,0.5), 0 0 120px rgba(221,183,255,0.15), inset 0 0 30px rgba(221,183,255,0.1) !important;
    border-color: rgba(221,183,255,0.5) !important;
  }
  @keyframes glow-pulse {
    0%, 100% { transform: scale(0.9); opacity: 0.5; }
    50% { transform: scale(1.2); opacity: 0.9; }
  }
  .animate-glow-pulse { animation: glow-pulse 4s ease-in-out infinite; }
`;

interface CyberOrbProps {
  className?: string;
  size?: string;
  orbType?: "large" | "small";
  delay?: number;
  blur?: boolean;
  style?: React.CSSProperties;
}

const CyberOrb = ({
  className = "",
  size = "w-16 h-16",
  orbType = "small",
  delay = 0,
  blur = false,
  style = {}
}: CyberOrbProps) => {
  const isLarge = orbType === "large";
  const imgStyle = isLarge
    ? { width: "190%", height: "190%", left: "-71.6%", top: "-60.2%" }
    : { width: "400%", height: "400%", left: "-44%", top: "-60%" };

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [-8, 8, -8] }}
      transition={{
        duration: 4 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }}
      className={`absolute rounded-full overflow-hidden flex items-center justify-center pointer-events-none select-none ${size} ${blur ? "blur-[2px]" : ""} ${className}`}
      style={{
        boxShadow: "0 0 30px rgba(132, 43, 210, 0.45)",
        zIndex: 5,
        ...style
      }}
    >
      <img
        src="/refine_it.jpeg"
        alt="Cyber Orb"
        className="absolute max-w-none mix-blend-screen"
        style={imgStyle}
      />
    </motion.div>
  );
};

/**
 * Navbar — Floating glass capsule pill
 */
const Navbar = () => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[100] w-[94%] md:w-[92%] max-w-5xl"
      id="main-nav"
    >
      <div
        className="w-full px-4 md:px-6 py-2.5 md:py-3 bg-[#07070a]/50 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-between shadow-[0_0_30px_rgba(144,39,249,0.15)]"
        id="navbar-capsule"
      >
        {/* Left — Brand */}
        <Link to="/" className="flex items-center gap-2 md:gap-2.5 cursor-pointer group shrink-0 min-w-0" id="logo-container">
          <div
            className="w-6 h-6 md:w-7 md:h-7 group-hover:drop-shadow-[0_0_14px_rgba(150,80,255,1)] shrink-0"
            style={{
              backgroundImage: "url('/logo1.png')",
              backgroundSize: "contain",
              backgroundPosition: "left center",
              backgroundRepeat: "no-repeat",
              filter: "drop-shadow(0 0 8px rgba(150,80,255,0.5))",
              transition: "filter 0.3s ease",
            }}
          />
          <span
            className="font-plus-jakarta text-sm md:text-base font-extrabold tracking-wider text-white/95 whitespace-nowrap"
            id="logo-wordmark"
          >
            Velocity Designs
          </span>
        </Link>

        {/* Center — Navigation Links */}
        <div className="hidden md:flex items-center gap-x-8" id="nav-links">
          {["Services", "Portfolio", "About", "Pricing"].map((label) => {
            const path = `/${label.toLowerCase()}`;
            return (
              <Link
                key={label}
                to={path}
                className="relative group text-gray-400 text-sm tracking-wide font-medium hover:text-white transition-colors duration-300"
              >
                {label}
                <span
                  className="absolute -bottom-[3px] left-1/2 w-full h-[1.5px] bg-[#44e2cd]/70 rounded-full -translate-x-1/2 scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-out origin-center"
                  style={{ boxShadow: '0 0 8px rgba(68,226,205,0.6)' }}
                />
              </Link>
            );
          })}
        </div>

        {/* Right — Get Started CTA */}
        <div className="flex justify-end shrink-0">
          <button
            className="relative overflow-hidden group/btn px-3.5 md:px-5 py-1.5 md:py-1.5 rounded-full text-xs md:text-sm font-semibold text-white tracking-wide cursor-pointer
              bg-white/[0.02] backdrop-blur-sm border border-[#ddb7ff]/40
              hover:border-[#ddb7ff]/70 transition-all duration-500"
            id="get-started-btn"
            style={{ boxShadow: '0 0 15px rgba(221,183,255,0.05)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(68,226,205,0.15), 0 0 60px rgba(221,183,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 15px rgba(221,183,255,0.05)';
            }}
          >
            <span
              className="absolute inset-0 bg-gradient-to-r from-[#44e2cd]/10 to-[#ddb7ff]/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-full"
            />
            <span className="relative z-10 whitespace-nowrap">Get Started</span>
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

/**
 * Interactive 3D Canvas Planet with orbital satellite and breathe effect
 */
/**
 * GSAP character-by-character split reveal heading
 */
const HeroSplitTextReveal = ({ text1, text2 }: { text1: string; text2: string }) => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    const chars = containerRef.current.querySelectorAll('.char');
    gsap.fromTo(chars, 
      { opacity: 0, y: 50, rotateX: -80, z: -60 },
      { 
        opacity: 1, 
        y: 0, 
        rotateX: 0, 
        z: 0, 
        duration: 0.9, 
        stagger: 0.035, 
        ease: "power4.out",
        delay: 0.7
      }
    );
  }, []);

  const renderWords = (text: string) => {
    const words = text.split(' ');
    return words.map((word, i) => (
      <span key={i} className="inline-block mr-[0.25em] whitespace-nowrap">
        {word.split('').map((char, j) => (
          <span key={j} className="char inline-block transform-style-preserve-3d">{char}</span>
        ))}
      </span>
    ));
  };

  return (
    <h1
      ref={containerRef}
      className="font-inter font-extrabold leading-none tracking-tighter text-white uppercase mb-6 flex flex-col items-center perspective-1000 select-none"
      style={{
        fontSize: "clamp(2.2rem, 7.5vw, 6rem)",
        textShadow: "0 0 20px rgba(68,226,205,0.2), 0 0 60px rgba(68,226,205,0.08)",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
      id="hero-headline"
    >
      <span className="block">{renderWords(text1)}</span>
      <span className="block mt-2">{renderWords(text2)}</span>
    </h1>
  );
};

const heroStaggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const heroChildVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/**
 * Hero Section — Centered overlay layout with looping video background
 */
const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.loop = true;
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;
      videoRef.current.play().catch((err) => {
        console.log("Video play was prevented or failed:", err);
      });
    }
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#020204]"
      id="hero-section"
    >
      {/* Background Video Wrapper */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-[1]"
        id="hero-video-wrapper"
      >
        <video
          ref={videoRef}
          src="/animated.mp4"
          muted
          playsInline
          autoPlay
          loop
          style={{ objectFit: "cover" }}
          className="w-full h-full opacity-60 md:opacity-70"
        />
      </div>

      {/* Directional and Radial dark overlays for ultimate contrast & cinematic depth */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        id="hero-overlay"
        style={{
          background:
            "radial-gradient(circle at center, rgba(6,6,18,0.1) 0%, rgba(2,2,4,0.9) 80%), linear-gradient(to bottom, rgba(2,2,4,0.4) 0%, transparent 15%, transparent 85%, rgba(2,2,4,1) 100%)",
        }}
      />

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center justify-center text-center pt-20 md:pt-24">
        
        {/* Entrance Animation Container */}
        <motion.div
          initial={{ y: "100vh", opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{
            duration: 1.4,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="flex flex-col items-center justify-center text-center w-full"
          id="hero-content-outer"
        >
          {/* Nested Motion Div for Weightless Perpetual Floating */}
          <motion.div
            animate={{ y: [-8, 8, -8] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex flex-col items-center justify-center text-center w-full"
            id="hero-content-inner"
          >
            <motion.div
              variants={heroStaggerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center w-full"
            >
              {/* Main Heading */}
              <motion.div variants={heroChildVariants} className="w-full px-2">
                <HeroSplitTextReveal text1="DESIGN BEYOND" text2="GRAVITY." />
              </motion.div>

              {/* Sub-heading */}
              <motion.p
                variants={heroChildVariants}
                className="mt-4 md:mt-6 max-w-2xl mx-auto text-white/80 text-fluid-hero-sub mb-8 md:mb-10 leading-relaxed font-medium font-inter select-none px-4"
                id="hero-subheadline"
              >
                Breaking free from traditional limitations. Shaping powerful visual ecosystems and compelling digital edits that demand attention.
              </motion.p>

              {/* Glassmorphic Button with soft purple glow */}
              <motion.div variants={heroChildVariants} id="hero-actions">
                <motion.button
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 0 35px rgba(132,43,210,0.4)",
                    borderColor: "rgba(132,43,210,0.6)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="font-plus-jakarta font-bold tracking-widest text-xs md:text-sm uppercase text-white bg-white/2 border border-white/5 hover:bg-white/5 px-8 py-3.5 md:px-12 md:py-5 rounded-full shadow-[0_0_20px_rgba(132,43,210,0.15)] transition-all duration-300 backdrop-blur-xl cursor-pointer"
                  id="hero-launch-workspace-btn"
                >
                  Launch Workspace
                </motion.button>
              </motion.div>
            </motion.div>

          </motion.div>
        </motion.div>
        
      </div>
    </section>
  );
};

const TrustedBy = () => {
  const brands = [
    { name: "Stripe", icon: null },
    { name: "Microsoft", icon: <Triangle className="w-4 h-4 fill-current rotate-180" /> },
    { name: "Apple", icon: <span className="text-lg"></span> },
    { name: "Google", icon: null },
    { name: "Figma", icon: <PencilRuler className="w-4 h-4" /> }
  ];

  // Duplicate logos array twice to ensure seamless looping scroll coverage
  const duplicatedBrands = [...brands, ...brands, ...brands, ...brands];

  return (
    <section className="relative w-full h-[50px] md:h-[60px] flex items-center overflow-hidden border-y border-white/5 bg-[#020204]" id="trusted-by">
      {/* Viewport Boundary Gradient Fade Masking (Left & Right) */}
      <div className="absolute inset-y-0 left-0 w-[60px] md:w-[150px] bg-gradient-to-r from-[#020204] via-[#020204]/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-[60px] md:w-[150px] bg-gradient-to-l from-[#020204] via-[#020204]/80 to-transparent z-10 pointer-events-none" />

      {/* Stylesheet injector for custom marquee animation */}
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        .marquee-track {
          display: flex;
          align-items: center;
          gap: 6rem;
          width: max-content;
          animation: marquee-scroll 25s linear infinite;
        }
      `}</style>

      {/* Infinite scrolling track */}
      <div className="marquee-track px-12">
        {duplicatedBrands.map((brand, i) => (
          <div
            key={i}
            className="flex items-center gap-2 md:gap-2.5 text-white/35 hover:text-white/80 transition-colors duration-500 cursor-default select-none whitespace-nowrap text-sm md:text-lg font-bold"
            id={`brand-logo-${i}`}
          >
            {brand.icon && <span className="opacity-70 scale-95">{brand.icon}</span>}
            <span className={brand.name === "Stripe" ? "italic tracking-tighter" : "tracking-tight"}>
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

const Dashboard = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;
    const card = cardRef.current;
    if (!card) return;

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 12;
      mouseY = y * -12;
    };

    const onMouseLeave = () => { mouseX = 0; mouseY = 0; };

    const tick = () => {
      currentX += (mouseX - currentX) * 0.06;
      currentY += (mouseY - currentY) * 0.06;
      card.style.transform = `rotateX(${currentY}deg) rotateY(${currentX}deg)`;
      requestAnimationFrame(tick);
    };

    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);
    const raf = requestAnimationFrame(tick);

    return () => {
      card.removeEventListener('mousemove', onMouseMove);
      card.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(raf);
    };
  }, [isMobile]);

  return (
    <section className="py-16 md:py-32 px-4 md:px-6 relative bg-transparent flex justify-center overflow-hidden" id="dashboard-section" style={{ perspective: '1200px' }}>
      {/* Pulsating ambient glow behind dashboard — hidden on mobile for performance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 hidden md:block">
        <div className="w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-purple-600/30 blur-[80px] md:blur-[120px] rounded-full animate-glow-pulse" />
      </div>

      {/* Glassmorphic dashboard container — no solid background */}
      <div
        ref={cardRef}
        id="dashboard-container"
        data-cursor="explore"
        className="w-full max-w-5xl mx-auto relative z-10 rounded-xl md:rounded-2xl backdrop-blur-xl bg-white/2 border border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] cursor-pointer"
        style={{ transformStyle: isMobile ? '' : 'preserve-3d' }}
      >
        <img
          src="/ui.jpeg"
          alt="Velocity OS Dashboard Preview"
          className="w-full h-auto block rounded-xl md:rounded-2xl relative z-10 bg-transparent"
        />
      </div>
    </section>
  );
};

const useSpotlight = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const onMouseMove = (e: React.MouseEvent) => {
    const el = glowRef.current;
    const card = cardRef.current;
    if (!el || !card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.background = `radial-gradient(500px circle at ${x}% ${y}%, rgba(221,183,255,0.15) 0%, transparent 45%)`;
  };

  const onMouseEnter = () => {
    if (glowRef.current) glowRef.current.style.opacity = '1';
    setHovered(true);
  };

  const onMouseLeave = () => {
    if (glowRef.current) {
      glowRef.current.style.opacity = '0';
      glowRef.current.style.background = 'transparent';
    }
    setHovered(false);
  };

  return { cardRef, glowRef, hovered, handlers: { onMouseMove, onMouseEnter, onMouseLeave } };
};

const PenWritingSvg = ({ hovered }: { hovered: boolean }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 overflow-visible">
    <path d="M28 10 L32 14 L24 22 L20 18 Z" fill="#ddb7ff" />
    <path d="M8 34 Q16 26 24 34 Q32 42 40 32" stroke="#ddb7ff" strokeWidth="2.5" fill="none" strokeLinecap="round"
      style={{
        strokeDasharray: 50,
        strokeDashoffset: hovered ? 0 : 50,
        transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    />
    <circle cx="16" cy="26" r="2" fill="#ddb7ff"
      style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'scale(1)' : 'scale(0)', transition: 'all 0.3s ease 0.2s', transformOrigin: '16px 26px' }}
    />
    <circle cx="32" cy="24" r="1.5" fill="#44e2cd"
      style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'scale(1)' : 'scale(0)', transition: 'all 0.3s ease 0.4s', transformOrigin: '32px 24px' }}
    />
  </svg>
);

const UIGridSvg = ({ hovered }: { hovered: boolean }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 overflow-visible">
    <rect x="4" y="4" width="40" height="28" rx="4" stroke="#44e2cd" strokeWidth="2" fill="none" />
    <line x1="18" y1="8" x2="18" y2="28" stroke="#44e2cd" strokeWidth="1.5" />
    <line x1="30" y1="8" x2="30" y2="28" stroke="#44e2cd" strokeWidth="1.5" />
    <line x1="10" y1="16" x2="38" y2="16" stroke="#44e2cd" strokeWidth="1.5" />
    <line x1="10" y1="24" x2="38" y2="24" stroke="#44e2cd" strokeWidth="1.5" />
    <line x1="24" y1="32" x2="24" y2="38" stroke="#44e2cd" strokeWidth="2" />
    <line x1="18" y1="38" x2="30" y2="38" stroke="#44e2cd" strokeWidth="2" />
    {[[18,16],[30,16],[18,24],[30,24]].map(([cx, cy], i) => (
      <circle key={i} cx={cx} cy={cy} r="2.5" fill="#44e2cd"
        style={{
          opacity: hovered ? 1 : 0.2,
          transform: hovered ? 'scale(1.6)' : 'scale(0.8)',
          transformOrigin: `${cx}px ${cy}px`,
          transition: `all 0.3s ease ${0.1 + i * 0.1}s`,
          animation: hovered ? `grid-pulse 1.8s ease-in-out infinite ${i * 0.3}s` : 'none',
        }}
      />
    ))}
  </svg>
);

const PlayPulseSvg = ({ hovered }: { hovered: boolean }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 overflow-visible">
    <circle cx="24" cy="24" r="18" stroke="#842bd2" strokeWidth="1.5"
      style={{
        opacity: hovered ? 0.5 : 0,
        transform: hovered ? 'scale(1)' : 'scale(0.85)',
        transformOrigin: '24px 24px',
        transition: 'all 0.4s ease',
        animation: hovered ? 'play-pulse 2s ease-in-out infinite' : 'none',
      }}
    />
    <circle cx="24" cy="24" r="14" stroke="#842bd2" strokeWidth="1"
      style={{
        opacity: hovered ? 0.7 : 0,
        transform: hovered ? 'scale(1)' : 'scale(0.9)',
        transformOrigin: '24px 24px',
        transition: 'all 0.4s ease 0.1s',
        animation: hovered ? 'play-pulse 2s ease-in-out infinite 0.5s' : 'none',
      }}
    />
    <polygon points="18,14 34,24 18,34" fill="#842bd2"
      style={{
        transform: hovered ? 'scale(1.12)' : 'scale(1)',
        transformOrigin: '24px 24px',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        filter: hovered ? 'drop-shadow(0 0 8px rgba(132,43,210,0.6))' : 'none',
      }}
    />
  </svg>
);

const MagneticButton = ({ children, accent = "#ddb7ff" }: { children: React.ReactNode; accent?: string }) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const onMouseMove = (e: React.MouseEvent) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  };

  const onMouseLeave = () => {
    const btn = btnRef.current;
    if (!btn) return;
    btn.style.transform = 'translate(0, 0)';
    setIsHovered(false);
  };

  return (
    <button
      ref={btnRef}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={onMouseLeave}
      className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white/80 hover:text-white cursor-pointer overflow-hidden transition-colors duration-300 group/btn"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <span
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          border: `1px solid ${accent}`,
          borderRadius: 'inherit',
          clipPath: isHovered
            ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
            : 'polygon(0 0, 0 0, 0 100%, 0 100%)',
          transition: 'clip-path 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
      <span className="relative z-10 flex items-center gap-2">
        {children}
        <ArrowRight className="w-4 h-4 transition-all duration-300" style={{
          transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
          opacity: isHovered ? 1 : 0.5,
        }} />
      </span>
    </button>
  );
};

const WireframeCube = () => (
  <svg viewBox="0 0 80 80" className="w-32 h-32 overflow-visible" fill="none">
    <defs>
      <filter id="cyberGlow">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#cyberGlow)">
      <path d="M40 8 L68 28 L40 48 L12 28 Z" stroke="#44e2cd" strokeWidth="1.2" strokeOpacity="0.6" />
      <path d="M40 8 L68 28 L40 48 L12 28 Z" stroke="#44e2cd" strokeWidth="2.5" strokeOpacity="0.2" strokeLinejoin="round" />
      <path d="M12 28 L40 64 L68 28" stroke="#44e2cd" strokeWidth="1" strokeOpacity="0.35" />
      <path d="M40 8 L40 64" stroke="#44e2cd" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="2 3" />
      <line x1="6" y1="28" x2="74" y2="28" stroke="#44e2cd" strokeWidth="0.3" strokeOpacity="0.15" />
      <line x1="6" y1="48" x2="74" y2="48" stroke="#44e2cd" strokeWidth="0.3" strokeOpacity="0.1" />
    </g>
    <circle cx="40" cy="8" r="2" fill="#44e2cd" filter="url(#cyberGlow)" />
    <circle cx="68" cy="28" r="1.5" fill="#44e2cd" filter="url(#cyberGlow)" />
    <circle cx="40" cy="48" r="1.5" fill="#44e2cd" filter="url(#cyberGlow)" />
    <circle cx="12" cy="28" r="1.5" fill="#44e2cd" filter="url(#cyberGlow)" />
    <circle cx="40" cy="64" r="2" fill="#44e2cd" filter="url(#cyberGlow)" />
  </svg>
);

const MiniDashboard = () => (
  <svg viewBox="0 0 80 60" className="w-full max-w-[220px] h-28 overflow-visible" fill="none">
    <rect x="2" y="2" width="76" height="56" rx="4" stroke="rgba(221,183,255,0.3)" strokeWidth="0.5" />
    <rect x="4" y="4" width="72" height="8" rx="2" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
    <circle cx="10" cy="8" r="1.5" fill="rgba(255,255,255,0.15)" />
    <line x1="16" y1="8" x2="40" y2="8" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeLinecap="round" />
    <rect x="4" y="16" width="22" height="18" rx="2" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
    <rect x="7" y="22" width="16" height="2" rx="1" fill="rgba(221,183,255,0.15)" />
    <rect x="7" y="22" width="10" height="2" rx="1" fill="rgba(221,183,255,0.4)" />
    <rect x="7" y="27" width="16" height="2" rx="1" fill="rgba(221,183,255,0.15)" />
    <rect x="7" y="27" width="6" height="2" rx="1" fill="rgba(221,183,255,0.3)" />
    <rect x="28" y="16" width="22" height="18" rx="2" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
    <rect x="31" y="22" width="16" height="2" rx="1" fill="rgba(221,183,255,0.15)" />
    <rect x="31" y="22" width="7" height="2" rx="1" fill="rgba(221,183,255,0.35)" />
    <rect x="31" y="27" width="16" height="2" rx="1" fill="rgba(221,183,255,0.15)" />
    <rect x="31" y="27" width="12" height="2" rx="1" fill="rgba(221,183,255,0.4)" />
    <rect x="52" y="16" width="24" height="18" rx="2" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
    <rect x="55" y="22" width="18" height="2" rx="1" fill="rgba(221,183,255,0.15)" />
    <rect x="55" y="22" width="5" height="2" rx="1" fill="rgba(221,183,255,0.4)" />
    <rect x="55" y="27" width="18" height="2" rx="1" fill="rgba(221,183,255,0.15)" />
    <rect x="55" y="27" width="14" height="2" rx="1" fill="rgba(221,183,255,0.3)" />
    <rect x="4" y="38" width="72" height="18" rx="2" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
    <rect x="7" y="43" width="28" height="3" rx="1.5" fill="rgba(221,183,255,0.1)" />
    <rect x="7" y="43" width="18" height="3" rx="1.5" fill="rgba(221,183,255,0.25)" />
    <rect x="7" y="49" width="28" height="3" rx="1.5" fill="rgba(221,183,255,0.1)" />
    <rect x="7" y="49" width="12" height="3" rx="1.5" fill="rgba(221,183,255,0.25)" />
  </svg>
);

const AudioWaveform = () => (
  <svg viewBox="0 0 80 50" className="w-full max-w-[200px] h-28 overflow-visible" fill="none">
    {[4, 6, 5, 9, 7, 12, 8, 15, 10, 18, 11, 14, 9, 12, 7, 10, 6, 8, 4, 5].map((h, i) => (
      <rect key={i} x={4 + i * 3.8} y={25 - h} width="1.8" height={h * 2} rx="0.9" fill="#842bd2"
        style={{ opacity: 0.25 + (h / 18) * 0.5 }}
      />
    ))}
    <rect x="42" y="7" width="2.2" height="36" rx="1.1" fill="#842bd2" opacity="0.65" filter="url(#cyberGlow)" />
    <rect x="47" y="12" width="2" height="26" rx="1" fill="#842bd2" opacity="0.35" filter="url(#cyberGlow)" />
    <rect x="52" y="17" width="1.6" height="16" rx="0.8" fill="#842bd2" opacity="0.2" filter="url(#cyberGlow)" />
  </svg>
);

const BentoCard = ({ title, desc, accent, gridClass, Graphic }: {
  title: string; desc: string; accent: string; gridClass: string;
  Graphic: React.FC;
}) => {
  const { cardRef, glowRef, hovered, handlers } = useSpotlight();
  const borderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (borderRef.current) gsap.set(borderRef.current, { opacity: 0 });
  }, []);

  const onMouseEnter = (e: React.MouseEvent) => {
    handlers.onMouseEnter();
    if (borderRef.current) gsap.to(borderRef.current, { opacity: 1, duration: 0.4, ease: 'power2.out' });
  };

  const onMouseLeave = (e: React.MouseEvent) => {
    handlers.onMouseLeave();
    if (borderRef.current) gsap.to(borderRef.current, { opacity: 0, duration: 0.4, ease: 'power2.out' });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handlers.onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-cursor="explore"
      className={`bento-card ${gridClass} relative overflow-hidden group cursor-pointer rounded-2xl md:rounded-3xl`}
      style={{
        background: 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(255,255,255,0.1)',
        transform: hovered ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* GSAP hover border glow — cyan-to-purple gradient */}
      <div
        ref={borderRef}
        className="absolute inset-0 rounded-3xl p-[1px] pointer-events-none z-0"
        style={{
          background: 'linear-gradient(135deg, #44e2cd, #ddb7ff)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Spotlight background glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-3xl pointer-events-none z-0"
        style={{ opacity: 0, background: 'transparent', transition: 'opacity 0.3s ease' }}
      />

      <div className="relative z-10 p-6 md:p-10 flex flex-col h-full">
        {/* Full-width decorative graphic */}
        <div className="w-full h-32 md:h-44 mb-6 md:mb-8 flex items-center justify-center bg-white/[0.01] rounded-xl md:rounded-2xl border border-white/5 overflow-hidden">
          <Graphic />
        </div>

        <h3 className="font-plus-jakarta text-xl md:text-3xl font-extrabold mb-3 md:mb-4 text-white/95 tracking-tight">{title}</h3>
        <p className="text-gray-400 leading-relaxed text-xs md:text-sm font-medium flex-grow">{desc}</p>
        <div className="mt-6 md:mt-8">
          <MagneticButton accent={accent}>Learn More</MagneticButton>
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  const sectionRef = useRef(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const yParallax = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  useEffect(() => {
    if (!gridRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.bento-card',
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, gridRef.current);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-32 px-4 md:px-6 overflow-hidden relative" id="services">
      <motion.div style={{ y: yParallax }} className="absolute -left-10 top-24 z-10 hidden lg:block pointer-events-none select-none">
        <CyberOrb orbType="small" size="w-24 h-24" delay={0.5} className="shadow-[0_0_45px_rgba(132,43,210,0.5)]" />
      </motion.div>

      <div className="max-w-container-max mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-24 px-2">
          <h2 className="font-plus-jakarta text-3xl md:text-5xl font-extrabold tracking-tighter text-white/95 mb-3 md:mb-4">Our Capabilities</h2>
          <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium">High-speed execution meets pixel-perfect refinement across every digital touchpoint.</p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 bento-grid">
          <BentoCard
            title="High-Fidelity UI/UX"
            desc="Hyper-intuitive web and mobile user interfaces, comprehensive design systems, interactive Figma prototypes, and user flows optimized strictly for high conversion."
            accent="#44e2cd"
            gridClass="md:col-span-1"
            Graphic={MiniDashboard}
          />
          <BentoCard
            title="Brand Architecture"
            desc="AI-enhanced brand identities, complex vector illustrations, dynamic advertising creatives, and high-impact physical or digital marketing collaterals."
            accent="#ddb7ff"
            gridClass="md:col-span-1"
            Graphic={WireframeCube}
          />
          <BentoCard
            title="Post-Production Engineering"
            desc="Elite-tier video post-production, multi-layered photo manipulation, motion graphics, audio mastering, sound polishing, and algorithmic cinematic color grading."
            accent="#842bd2"
            gridClass="md:col-span-1"
            Graphic={AudioWaveform}
          />
        </div>
      </div>
    </section>
  );
};

const BokehField = () => {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      y: 5 + Math.random() * 90,
      size: 30 + Math.random() * 80,
      duration: 12 + Math.random() * 16,
      delay: Math.random() * 8,
    })),
  []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: 'rgba(144, 39, 249, 0.08)',
            filter: 'blur(40px)',
            animation: `bokeh-drift ${p.duration}s ease-in-out infinite ${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

const DeckCard = ({ index, title, category, desc, accent, children, tooltipEl }: {
  index: number; title: string; category: string; desc: string; accent: string;
  children: React.ReactNode; tooltipEl: React.RefObject<HTMLDivElement | null>;
}) => {
  const innerRef = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: React.MouseEvent) => {
    const el = innerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    el.style.transform = `perspective(1000px) rotateX(${(y - 0.5) * -12}deg) rotateY(${(x - 0.5) * 12}deg) scale3d(1.02, 1.02, 1.02)`;
    el.style.boxShadow = '0 20px 60px rgba(144,39,249,0.15), 0 0 40px rgba(144,39,249,0.05)';
    if (tooltipEl.current) {
      tooltipEl.current.style.left = `${e.clientX + 18}px`;
      tooltipEl.current.style.top = `${e.clientY - 12}px`;
      tooltipEl.current.style.opacity = '1';
      tooltipEl.current.style.transform = 'scale(1)';
    }
  };

  const onMouseLeave = () => {
    const el = innerRef.current;
    if (!el) return;
    el.style.transform = '';
    el.style.boxShadow = '';
    if (tooltipEl.current) {
      tooltipEl.current.style.opacity = '0';
      tooltipEl.current.style.transform = 'scale(0.95)';
    }
  };

  return (
    <div
      className="deck-card absolute w-full max-w-[320px] sm:max-w-[380px] md:max-w-[420px]"
      style={{ zIndex: 10 - index }}
    >
      <div
        ref={innerRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        data-cursor="project"
        className="w-full rounded-3xl overflow-hidden cursor-pointer transition-shadow duration-500"
        style={{
          background: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.05)',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        <div className="pointer-events-none">{children}</div>

        <div className="absolute inset-0 rounded-3xl p-[1px] pointer-events-none -z-10"
          style={{
            background: `linear-gradient(135deg, ${accent}33, transparent)`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#020204]/95 via-[#020204]/50 to-transparent opacity-0 md:hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-4 md:p-8">
          <span className="text-[10px] md:text-xs uppercase font-extrabold tracking-widest" style={{ color: accent }}>{category}</span>
          <h4 className="text-base md:text-xl font-plus-jakarta font-extrabold text-white mt-1">{title}</h4>
          <p className="text-[10px] md:text-xs text-white/60 leading-relaxed font-medium mt-1 md:mt-2">{desc}</p>
          <div className="mt-2 md:mt-4">
            <MagneticButton accent={accent}>Learn More</MagneticButton>
          </div>
        </div>
      </div>
    </div>
  );
};

const Portfolio = () => {
  const sectionRef = useRef(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const tooltipEl = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const yParallax = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  useEffect(() => {
    if (!deckRef.current) return;
    const isMobile = window.innerWidth < 768;
    const offsetX = isMobile ? 60 : 130;
    const offsetY = isMobile ? 20 : 45;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.deck-card',
        {
          x: (i) => i === 0 ? 0 : i === 1 ? -6 : 6,
          y: (i) => i === 0 ? 0 : i === 1 ? 4 : -4,
          scale: (i) => i === 0 ? 1 : 0.92,
          rotation: (i) => i === 0 ? 0 : i === 1 ? 4 : -4,
          opacity: 0.5,
        },
        {
          x: (i) => i === 0 ? 0 : i === 1 ? offsetX : -offsetX,
          y: (i) => i === 0 ? 0 : i === 1 ? offsetY : -offsetY,
          scale: 1,
          rotation: (i) => i === 0 ? 0 : i === 1 ? 6 : -6,
          opacity: 1,
          z: (i) => i === 0 ? 80 : 40,
          stagger: 0.25,
          duration: 1.2,
          ease: 'elastic.out(1, 0.4)',
          scrollTrigger: {
            trigger: deckRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, deckRef.current);
    return () => ctx.revert();
  }, []);

  const onSectionMouseMove = (e: React.MouseEvent) => {
    if (!tooltipEl.current || tooltipEl.current.style.opacity === '0') return;
    tooltipEl.current.style.left = `${e.clientX + 18}px`;
    tooltipEl.current.style.top = `${e.clientY - 12}px`;
  };

  return (
    <section ref={sectionRef} className="py-20 md:py-32 px-4 md:px-6 relative overflow-hidden" id="portfolio">
      <BokehField />

      <div
        ref={tooltipEl}
        className="fixed pointer-events-none z-50 px-4 py-2 rounded-full text-sm font-semibold text-white whitespace-nowrap"
        style={{
          opacity: 0,
          transform: 'scale(0.95)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
          background: 'rgba(144, 39, 249, 0.25)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        View Case Study
      </div>

      <motion.div style={{ y: yParallax }} className="absolute -right-4 top-12 z-10 hidden lg:block pointer-events-none select-none">
        <CyberOrb orbType="small" size="w-24 h-24" delay={1.5} className="shadow-[0_0_45px_rgba(68,226,205,0.5)]" />
      </motion.div>

      <div className="max-w-container-max mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-24 px-2">
          <h2 className="font-plus-jakarta text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4">Our Latest Masterpieces</h2>
          <p className="text-on-surface-variant text-sm md:text-lg max-w-2xl mx-auto">
            High-contrast visual deliverables spanning bleeding-edge UI designs, identity kits, and marketing web mockups.
          </p>
        </div>

        <div
          ref={deckRef}
          onMouseMove={onSectionMouseMove}
          className="relative flex items-center justify-center min-h-[420px] sm:min-h-[520px] md:min-h-[560px]"
        >
          <DeckCard
            index={0}
            title="Nova Fintech App"
            category="Mobile UI Design"
            desc="Hyper-minimal finance tracking app interface with responsive chart widgets and glowing glassmorphic elements."
            accent="#44e2cd"
            tooltipEl={tooltipEl}
          >
            <div className="flex items-center justify-center p-4 md:p-8 bg-gradient-to-tr from-[#000511] to-[#0a0f1c] select-none min-h-[260px] md:min-h-[380px]">
              <div className="w-[160px] md:w-[180px] h-[300px] md:h-[340px] rounded-[24px] md:rounded-[30px] border border-white/5 bg-white/[0.01] backdrop-blur-xl p-3 md:p-4 relative overflow-hidden flex flex-col gap-3 md:gap-4 shadow-2xl">
                <div className="w-16 h-3 bg-white/5 rounded-full mx-auto mb-2" />
                <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5 flex flex-col gap-2">
                  <span className="text-[8px] text-white/40 uppercase tracking-widest font-bold">Total Balance</span>
                  <span className="text-xl font-bold font-plus-jakarta text-white">$45,210.80</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-[#44e2cd]/10 rounded-lg border border-[#44e2cd]/20 flex flex-col">
                    <span className="text-[6px] text-[#44e2cd] font-bold uppercase">Income</span>
                    <span className="text-xs font-bold text-white">+12.4%</span>
                  </div>
                  <div className="p-2 bg-[#842bd2]/10 rounded-lg border border-[#842bd2]/20 flex flex-col">
                    <span className="text-[6px] text-[#842bd2] font-bold uppercase">Expense</span>
                    <span className="text-xs font-bold text-white">-4.2%</span>
                  </div>
                </div>
                <div className="flex-grow p-3 bg-white/[0.01] rounded-xl border border-white/5 flex flex-col justify-between">
                  <span className="text-[8px] text-white/40 font-bold uppercase">Transactions</span>
                  <div className="flex items-center justify-between text-[10px] text-white/80">
                    <span>Vielocity Ltd</span>
                    <span className="font-bold text-[#44e2cd]">+$1,200</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-white/80">
                    <span>Stripe Inc</span>
                    <span className="font-bold">-$45</span>
                  </div>
                </div>
              </div>
            </div>
          </DeckCard>

          <DeckCard
            index={1}
            title="Aether Nexus Kit"
            category="Brand Identity"
            desc="Futuristic identity kit featuring organic shapes, custom modern typography guidelines, and bold brand elements."
            accent="#ddb7ff"
            tooltipEl={tooltipEl}
          >
            <div className="flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-[#00020a] to-[#0a0f1c] select-none min-h-[260px] md:min-h-[380px]">
              <div className="w-[260px] md:w-[280px] h-[170px] md:h-[190px] rounded-xl md:rounded-2xl border border-white/5 bg-white/[0.01] p-4 md:p-6 relative overflow-hidden flex flex-col justify-between shadow-2xl">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-gradient-to-tr from-[#ddb7ff] to-[#842bd2]" />
                    <span className="text-xs font-bold text-white font-plus-jakarta tracking-wide">Aether Nexus</span>
                  </div>
                  <span className="text-[8px] text-white/40 font-bold uppercase tracking-widest">Brand Kit v1.0</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded bg-[#ddb7ff] flex items-center justify-center text-[8px] text-black font-bold">#DDB</div>
                  <div className="w-8 h-8 rounded bg-[#842bd2] flex items-center justify-center text-[8px] text-white font-bold">#842</div>
                  <div className="w-8 h-8 rounded bg-[#44e2cd] flex items-center justify-center text-[8px] text-black font-bold">#44E</div>
                  <div className="w-8 h-8 rounded bg-[#020204] border border-white/5 flex items-center justify-center text-[8px] text-white font-bold">#020</div>
                </div>
                <div className="text-[10px] text-white/60 font-medium">
                  "Organic fluid dynamics meet mathematical precision."
                </div>
              </div>
            </div>
          </DeckCard>

          <DeckCard
            index={2}
            title="Helios Dashboard V2"
            category="Web App UI"
            desc="Premium dark-mode web application design optimized for data heavy applications with beautiful analytics widgets."
            accent="#842bd2"
            tooltipEl={tooltipEl}
          >
            <div className="flex items-center justify-center p-4 md:p-6 bg-gradient-to-bl from-[#000511] to-[#0f1423] select-none min-h-[260px] md:min-h-[380px]">
              <div className="w-[260px] md:w-[300px] h-[180px] md:h-[200px] rounded-xl border border-white/5 bg-[#020204]/85 p-3 md:p-4 relative overflow-hidden flex flex-col gap-2 md:gap-3 shadow-2xl">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  </div>
                  <span className="text-[9px] text-[#842bd2] font-bold tracking-widest uppercase">HELIOS OS</span>
                </div>
                <div className="grid grid-cols-3 gap-2 flex-grow">
                  <div className="p-2 bg-white/[0.01] rounded-lg border border-white/5 flex flex-col justify-between">
                    <span className="text-[6px] text-white/40 uppercase">Users</span>
                    <span className="text-sm font-bold text-white">12.8k</span>
                  </div>
                  <div className="p-2 bg-white/[0.01] rounded-lg border border-white/5 flex flex-col justify-between">
                    <span className="text-[6px] text-white/40 uppercase">Conversion</span>
                    <span className="text-sm font-bold text-white">4.82%</span>
                  </div>
                  <div className="p-2 bg-white/[0.01] rounded-lg border border-white/5 flex flex-col justify-between">
                    <span className="text-[6px] text-white/40 uppercase">Growth</span>
                    <span className="text-sm font-bold text-[#44e2cd]">+24%</span>
                  </div>
                </div>
                <div className="h-10 bg-white/[0.01] rounded-lg border border-white/5 p-1 relative flex items-end">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#842bd2]/10 to-transparent" />
                  <svg className="w-full h-full text-[#842bd2] opacity-80" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M0,30 L10,25 L20,28 L30,15 L40,20 L50,8 L60,14 L70,5 L80,12 L90,2 L100,10 L100,30 Z" fill="rgba(132, 43, 210, 0.2)" />
                    <path d="M0,30 L10,25 L20,28 L30,15 L40,20 L50,8 L60,14 L70,5 L80,12 L90,2 L100,10" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
          </DeckCard>
        </div>
      </div>
    </section>
  );
};

const Process = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 60, damping: 25 });

  const steps = [
    { num: "01", title: "Deep Discovery", sub: "Drop requirements and raw files directly into your secure Stitch-powered dashboard for immediate analysis." },
    { num: "02", title: "Strategic Planning", sub: "Our custom AI model immediately generates dozens of base layouts mapping every design decision." },
    { num: "03", title: "Creative Execution", sub: "An elite designer takes the wheel, polishing and hand-crafting production-ready masterpieces." },
    { num: "04", title: "Delivery & Scale", sub: "Download your fully layered source files and ready-to-deploy assets optimized for any platform." }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const pulseVariants = {
    rest: { scale: 1, borderColor: "rgba(255,255,255,0.08)" },
    hover: {
      scale: 1.02,
      borderColor: "rgba(168,85,247,0.5)",
      boxShadow: "0 0 30px rgba(168,85,247,0.15), 0 0 60px rgba(168,85,247,0.05)",
      transition: { type: "spring", stiffness: 300, damping: 15 },
    },
  };

  return (
    <section ref={sectionRef} className="py-20 md:py-32 px-4 md:px-6 relative overflow-hidden" id="process">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-plus-jakarta text-3xl md:text-5xl font-extrabold mb-12 md:mb-20 uppercase tracking-tighter text-white/95 text-center"
        >
          Process Architecture
        </motion.h2>

        <div className="relative max-w-3xl mx-auto px-2 md:px-0">
          {/* Vertical connecting line — hidden on mobile */}
          <motion.div
            style={{ scaleY: lineScale, originY: 0 }}
            className="hidden md:block absolute left-[31px] top-0 w-px h-full bg-gradient-to-b from-violet-400 via-violet-500/50 to-violet-400/20 z-0"
          />

          <div className="relative z-10 space-y-8 md:space-y-14">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="flex flex-col md:flex-row gap-4 md:gap-10 items-start"
              >
                {/* Step number circle */}
                <div className="flex flex-row md:flex-col items-center gap-3 md:pt-4 shrink-0">
                  <motion.div
                    initial="rest"
                    whileHover="hover"
                    whileTap={{ scale: 1.05 }}
                    variants={pulseVariants}
                    className="w-10 h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center relative z-10 bg-white/5 backdrop-blur-md border border-white/10"
                  >
                    <span className="text-xs md:text-base font-extrabold font-plus-jakarta text-white/80">
                      {step.num}
                    </span>
                  </motion.div>
                  {i < steps.length - 1 && (
                    <div className="block md:hidden flex-1 w-px h-5 bg-gradient-to-b from-violet-400/50 to-transparent mx-auto" />
                  )}
                </div>

                {/* Glassmorphism card */}
                <motion.div
                  initial="rest"
                  whileHover="hover"
                  variants={pulseVariants}
                  className="flex-1 w-full p-5 md:p-8 rounded-xl md:rounded-2xl bg-white/5 backdrop-blur-md border border-white/10"
                >
                  <h3 className="font-plus-jakarta text-base md:text-2xl font-bold text-white mb-2 md:mb-3 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-medium">
                    {step.sub}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const orbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;
    const section = sectionRef.current;
    if (!section) return;

    let mx = 0.5, my = 0.5;

    const onMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mx = (e.clientX - rect.left) / rect.width;
      my = (e.clientY - rect.top) / rect.height;
    };

    const tick = () => {
      orbRefs.current.forEach((orb, i) => {
        if (!orb) return;
        const depth = 1 + i * 0.6;
        const dx = (mx - 0.5) * depth * 40;
        const dy = (my - 0.5) * depth * 40;
        orb.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      requestAnimationFrame(tick);
    };

    section.addEventListener('mousemove', onMouseMove);
    const raf = requestAnimationFrame(tick);

    return () => {
      section.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(raf);
    };
  }, [isMobile]);

  return (
    <section ref={sectionRef} className="py-24 md:py-40 px-4 md:px-6 text-center relative overflow-hidden bg-[#020204]" id="cta-section">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[1000px] h-[500px] md:h-[1000px] bg-gradient-to-r from-[#842bd2]/25 to-[#44e2cd]/15 blur-[120px] md:blur-[200px] rounded-full pointer-events-none" />

      <div ref={el => { orbRefs.current[0] = el; }} className="absolute bottom-[15%] left-[8%] lg:left-[20%] z-20 hidden md:block">
        <CyberOrb orbType="small" size="w-20 h-20" delay={0.2} className="shadow-[0_0_35px_rgba(132,43,210,0.45)]" />
      </div>
      <div ref={el => { orbRefs.current[1] = el; }} className="absolute bottom-[30%] left-[4%] lg:left-[15%] z-20 hidden md:block">
        <CyberOrb orbType="small" size="w-14 h-14" delay={1.4} className="shadow-[0_0_25px_rgba(68,226,205,0.45)]" />
      </div>
      <div ref={el => { orbRefs.current[2] = el; }} className="absolute bottom-[12%] right-[8%] lg:right-[20%] z-20 hidden md:block">
        <CyberOrb orbType="small" size="w-24 h-24" delay={0.8} className="shadow-[0_0_40px_rgba(68,226,205,0.45)]" />
      </div>
      <div ref={el => { orbRefs.current[3] = el; }} className="absolute bottom-[28%] right-[4%] lg:right-[14%] z-20 hidden md:block">
        <CyberOrb orbType="small" size="w-16 h-16" delay={2} className="shadow-[0_0_30px_rgba(132,43,210,0.45)]" />
      </div>
      <div ref={el => { orbRefs.current[4] = el; }} className="absolute bottom-[4%] md:bottom-[6%] left-[40%] md:left-[43%] z-20 hidden md:block">
        <CyberOrb orbType="small" size="w-10 h-10" delay={0.6} className="shadow-[0_0_20px_rgba(132,43,210,0.3)]" />
      </div>
      <div ref={el => { orbRefs.current[5] = el; }} className="absolute bottom-[5%] md:bottom-[7%] right-[40%] md:right-[42%] z-20 hidden md:block">
        <CyberOrb orbType="small" size="w-9 h-9" delay={1.6} className="shadow-[0_0_20px_rgba(68,226,205,0.3)]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="relative w-24 h-24 mx-auto mb-10" id="cta-avian-logo-wrapper">
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-10 flex justify-center items-center gap-1 opacity-70 z-0 pointer-events-none">
            <CyberOrb orbType="small" size="w-10 h-10" delay={0.3} className="relative -translate-y-1" />
            <CyberOrb orbType="small" size="w-12 h-12" delay={0.9} className="relative translate-y-1 shadow-[0_0_20px_rgba(132,43,210,0.55)]" />
            <CyberOrb orbType="small" size="w-10 h-10" delay={0.5} className="relative -translate-y-1" />
          </div>
          <div
            className="rounded-full shadow-[0_0_40px_rgba(132,43,210,0.4)] relative z-20 transition-transform hover:scale-110 duration-500 cursor-pointer w-24 h-24"
            style={{
              backgroundImage: "url('/logo1.png')",
              backgroundSize: "auto 100%",
              backgroundPosition: "left center",
              backgroundRepeat: "no-repeat",
            }}
            id="cta-avian-logo"
          />
        </div>

        <h2 className="font-plus-jakarta text-fluid-cta font-extrabold mb-12 md:mb-16 tracking-tighter text-white px-2">
          Ready to Transform Your Digital Presence?
        </h2>

        <div
          className="bg-white/2 backdrop-blur-xl p-1.5 md:p-2 rounded-2xl md:rounded-full border border-white/10 flex flex-col md:flex-row items-center max-w-2xl mx-auto shadow-2xl relative z-30 transition-all duration-500"
          id="cta-input-group"
          onFocus={(e) => e.currentTarget.classList.add('focus-glow')}
          onBlur={(e) => e.currentTarget.classList.remove('focus-glow')}
        >
          <input
            type="email"
            placeholder="Enter your professional email..."
            className="flex-grow bg-transparent w-full md:w-auto px-4 md:px-8 py-3 md:py-4 outline-none text-on-surface placeholder:text-on-surface-variant/40 text-sm md:text-lg rounded-full"
            id="cta-email"
          />
          <div className="w-full md:w-auto">
            <button
              data-cursor="explore"
              className="relative overflow-hidden group w-full md:w-auto text-white font-bold px-6 md:px-12 py-3 md:py-4 rounded-full active:scale-95 transition-all duration-500 cursor-pointer"
              id="cta-join-btn"
              style={{
                background: 'rgba(255,255,255,0.02)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)',
                border: '1px solid rgba(68,226,205,0.35)',
                boxShadow: '0 0 20px rgba(68,226,205,0.08)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(68,226,205,0.7)';
                e.currentTarget.style.boxShadow = '0 0 40px rgba(68,226,205,0.25), 0 0 80px rgba(68,226,205,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(68,226,205,0.35)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(68,226,205,0.08)';
              }}
            >
              {/* Liquid purple gradient wash on hover */}
              <span
                className="absolute inset-0 bg-gradient-to-r from-[#842bd2]/50 via-[#ddb7ff]/20 to-transparent -skew-x-12 pointer-events-none"
                style={{ transform: 'translateX(-120%)', transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(120%)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(-120%)'}
              />
              <span className="relative z-10">Start a Project</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 md:py-16 px-4 md:px-10 border-t border-white/5 bg-[#020204] flex flex-col items-center gap-8 md:gap-12" id="main-footer">
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10">
        <div className="flex flex-col gap-4">
          <div className="font-plus-jakarta text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <div
              className="rounded-full shadow-[0_0_15px_rgba(132,43,210,0.25)]"
              style={{
                width: "28px",
                height: "28px",
                backgroundImage: "url('/logo1.png')",
                backgroundSize: "auto 28px",
                backgroundPosition: "0px 0px",
                backgroundRepeat: "no-repeat",
              }}
              id="footer-brand-logo-cropped"
            />
            Velocity Designs
          </div>
          <p className="text-on-surface-variant text-[10px] uppercase tracking-[0.3em] font-bold">Copyright © 2026 Velocity Designs. All rights reserved.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:gap-10 text-[10px] md:text-xs font-bold tracking-widest text-on-surface-variant uppercase">
          {["Services", "About", "Terms of Service", "Privacy Policy"].map(item => (
            <a key={item} href="#" className="hover:text-primary transition-colors whitespace-nowrap">{item}</a>
          ))}
        </div>

        <div className="flex gap-6 text-on-surface-variant">
          {[AtSign, Share2, Triangle, Sparkles].map((Icon, i) => (
            <MagneticWrapper key={i}>
              <Icon className="w-6 h-6 cursor-pointer hover:text-primary transition-colors" />
            </MagneticWrapper>
          ))}
        </div>
      </div>
    </footer>
  );
};

const useLenisScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
    });
    lenis.on('scroll', () => ScrollTrigger.update());
    const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
};

export default function App() {
  useLenisScroll();

  return (
    <>
      {/* Cinematic neo-noir ambient lighting — scaled down on mobile */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" id="ambient-lights">
        <div className="absolute -top-[20%] -left-[8%] w-[400px] md:w-[900px] h-[400px] md:h-[900px] bg-[#842bd2]/15 blur-[80px] md:blur-[150px] rounded-full will-change-transform" />
        <div className="absolute top-[30%] -right-[10%] w-[300px] md:w-[700px] h-[300px] md:h-[700px] bg-[#44e2cd]/10 blur-[80px] md:blur-[150px] rounded-full will-change-transform" />
        <div className="absolute bottom-[10%] left-[20%] w-[350px] md:w-[800px] h-[350px] md:h-[800px] bg-[#ddb7ff]/8 blur-[80px] md:blur-[150px] rounded-full will-change-transform" />
        <div className="absolute top-[15%] left-[35%] w-[250px] md:w-[600px] h-[250px] md:h-[600px] bg-[#d946ef]/10 blur-[80px] md:blur-[150px] rounded-full will-change-transform" />
        <div className="absolute bottom-[25%] -right-[5%] w-[200px] md:w-[550px] h-[200px] md:h-[550px] bg-[#06b6d4]/10 blur-[80px] md:blur-[150px] rounded-full will-change-transform" />
      </div>
      <BrowserRouter>
      <CursorFollower />
      <Navbar />
      <ScrollManager />
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen relative selection-bg-primary/30 selection-text-white bg-[#020204]" id="root-container">
            <style>{customStyles}</style>
            <main id="main-content">
              <Hero />
              <TrustedBy />
              <Dashboard />
              <Services />
              <Portfolio />
              <Process />
              <CTA />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/services" element={
          <div className="min-h-screen relative selection-bg-primary/30 selection-text-white bg-[#020204]">
            <style>{customStyles}</style>
            <ServicesPage />
            <Footer />
          </div>
        } />
        <Route path="/pricing" element={
          <div className="min-h-screen relative selection-bg-primary/30 selection-text-white bg-[#020204]">
            <style>{customStyles}</style>
            <PricingPage />
            <Footer />
          </div>
        } />
        <Route path="/portfolio" element={
          <div className="min-h-screen relative selection-bg-primary/30 selection-text-white bg-[#020204]">
            <style>{customStyles}</style>
            <PortfolioPage />
            <Footer />
          </div>
        } />
        <Route path="/about" element={
          <div className="min-h-screen relative selection-bg-primary/30 selection-text-white bg-[#020204]">
            <style>{customStyles}</style>
            <AboutPage />
            <Footer />
          </div>
        } />
      </Routes>
    </BrowserRouter>
    </>
  );
}
