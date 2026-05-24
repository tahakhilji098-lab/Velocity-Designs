import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

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

interface DashboardImageProps {
  src: string;
  alt?: string;
  className?: string;
}

const DashboardImage = ({
  src,
  alt = "Dashboard Preview",
  className = "",
}: DashboardImageProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });
  const rawRotateX = useTransform(scrollYProgress, [0, 1], [30, 0]);
  const rotateX = useSpring(rawRotateX, { stiffness: 80, damping: 20 });

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

    card.addEventListener("mousemove", onMouseMove);
    card.addEventListener("mouseleave", onMouseLeave);
    const raf = requestAnimationFrame(tick);

    return () => {
      card.removeEventListener("mousemove", onMouseMove);
      card.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(raf);
    };
  }, [isMobile]);

  return (
    <section ref={sectionRef} className={className}>
      <motion.div
        style={{ rotateX, perspective: "1000px" }}
        className="w-full"
      >
        <div
          ref={cardRef}
          className="w-full rounded-2xl overflow-hidden cursor-pointer"
          style={{ transformStyle: "preserve-3d" }}
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-auto block"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default DashboardImage;
