import React, { useCallback, useMemo } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext.jsx";

const AmbientBackground = () => {
  const shouldReduceMotion = useReducedMotion();
  const { isDark } = useTheme();

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const options = useMemo(() => {
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 15 : 40;

    return {
      background: {
        color: { value: "transparent" },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: { enable: !isMobile, mode: "repulse" },
          resize: true,
        },
        modes: {
          repulse: { distance: 100, duration: 0.4 },
        },
      },
      particles: {
        color: { value: isDark ? "#818cf8" : "#6366f1" },
        links: {
          color: isDark ? "#818cf8" : "#6366f1",
          distance: 150,
          enable: !isMobile, // Disable links on mobile for performance
          opacity: 0.2,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: { default: "bounce" },
          random: false,
          speed: 1,
          straight: false,
        },
        number: {
          density: { enable: true, area: 800 },
          value: particleCount,
        },
        opacity: { value: 0.3 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 3 } },
      },
      detectRetina: true,
    };
  }, [isDark]);

  if (shouldReduceMotion) return null;

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={options}
      className="ambient-particles"
    />
  );
};

export default AmbientBackground;
