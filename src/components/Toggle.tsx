"use client";
import { AnimatePresence, easeOut, motion } from "motion/react";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const Toggle = () => {
  const [dark, setDark] = useState(false);

  const switchTheme = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark", !dark);

    localStorage.setItem("theme", !dark ? "dark" : "light");
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      const isDark = storedTheme === "dark";
      setDark(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDark(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  const handleToggle = () => {
    if (!document.startViewTransition) {
      switchTheme();
      localStorage.setItem("theme", dark ? "light" : "dark");
    } else {
      document.startViewTransition(() => switchTheme());
    }
  };

  return (
    <div>
      <div>
        <button
          onClick={handleToggle}
          className="p-2 shadow-sm rounded-full text-black dark:text-white font-bold cursor-pointer"
        >
          <AnimatePresence mode="wait" initial={false}>
            {dark ? (
              <motion.div
                key="sun"
                initial={{ rotate: 45, scale: 0.8, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: -45, scale: 0.8, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 900,
                  damping: 60,
                  ease: easeOut,
                }}
              >
                <Sun size={15} />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: 45, scale: 0.8, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: -45, scale: 0.8, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 900,
                  damping: 60,
                  ease: easeOut,
                }}
              >
                <Moon size={15} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
};

export default Toggle;
