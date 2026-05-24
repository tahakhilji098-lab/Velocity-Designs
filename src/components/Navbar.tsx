import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { label: "Services", path: "/services" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "About", path: "/about" },
  { label: "Pricing", path: "/pricing" },
];

const menuVariants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  open: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

const linkVariants = {
  closed: { opacity: 0, x: -16 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.1 + i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  }),
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = () => setIsOpen(false);

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
              backgroundImage: "url('/logo.png')",
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

        {/* Center — Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-x-8" id="nav-links">
          {navLinks.map(({ label, path }) => (
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
          ))}
        </div>

        {/* Right — Get Started CTA + Mobile Hamburger */}
        <div className="flex items-center gap-3">
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

          {/* Hamburger — visible only on mobile */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="md:hidden relative z-[110] flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="md:hidden mt-3 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 overflow-hidden shadow-[0_0_40px_rgba(144,39,249,0.2)]"
            style={{ originY: 0 }}
          >
            <div className="flex flex-col px-4 py-4 gap-1">
              {navLinks.map(({ label, path }, i) => (
                <motion.div
                  key={label}
                  variants={linkVariants}
                  custom={i}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  <Link
                    to={path}
                    onClick={handleLinkClick}
                    className="block px-4 py-3 rounded-xl text-gray-300 font-medium text-sm tracking-wide
                      hover:text-white hover:bg-white/5 hover:shadow-[0_0_20px_rgba(68,226,205,0.15)]
                      transition-all duration-300"
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
