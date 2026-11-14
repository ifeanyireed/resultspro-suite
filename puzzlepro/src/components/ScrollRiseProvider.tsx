"use client";

import React, { useEffect, ReactNode } from "react";
import { animate, motion, useReducedMotion, Variants } from "framer-motion";
import { usePathname } from "next/navigation";

const TARGET_SELECTOR = [
  "section",
  "article",
  "footer",
  "[class*='card']",
  "[class*='rounded-']",
  "[class*='grid'] > div",
  ".frosted-panel",
  ".liquid-glass",
  "h1",
  "h2",
  "h3",
  "p",
  "blockquote",
  "form",
  "table",
  "tbody > tr",
  "ul > li",
  ".rise-on-scroll",
].join(", ");

const SKIP_TAGS = new Set([
  "NAV",
  "ASIDE",
  "SCRIPT",
  "STYLE",
  "SVG",
  "PATH",
  "CANVAS",
  "INPUT",
  "TEXTAREA",
  "SELECT",
  "HEAD",
  "META",
  "LINK",
]);

function shouldSkipElement(el: HTMLElement): boolean {
  if (!el || !(el instanceof HTMLElement)) return true;
  if (el.dataset.fmRisen === "true" || el.dataset.fmObserved === "true") return true;
  if (SKIP_TAGS.has(el.tagName)) return true;
  if (
    el.closest(
      "nav, aside, [data-no-rise], .blocklyWorkspace, [class*='blockly'], svg, canvas"
    )
  ) {
    return true;
  }
  const className = typeof el.className === "string" ? el.className : "";
  if (
    className.includes("blockly") ||
    className.includes("glass-glint") ||
    className.includes("animate-top-bar")
  ) {
    return true;
  }

  const computed = window.getComputedStyle(el);
  if (computed.position === "fixed" || computed.position === "sticky") {
    return true;
  }
  if (computed.display === "none" || computed.visibility === "hidden") {
    return true;
  }

  // Skip full-viewport background wrappers so they don't flash white/blank
  const rect = el.getBoundingClientRect();
  if (
    rect.width >= window.innerWidth * 0.98 &&
    rect.height >= window.innerHeight * 0.92
  ) {
    return true;
  }

  return false;
}

export function ScrollRiseProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || typeof window === "undefined") return;

    let batchCount = 0;
    let batchResetTimer: ReturnType<typeof setTimeout> | null = null;

    const triggerRise = (el: HTMLElement) => {
      if (el.dataset.fmRisen === "true") return;
      el.dataset.fmRisen = "true";

      const staggerDelay = Math.min(batchCount * 0.055, 0.38);
      batchCount += 1;

      if (batchResetTimer) clearTimeout(batchResetTimer);
      batchResetTimer = setTimeout(() => {
        batchCount = 0;
      }, 120);

      const controls = animate(
        el,
        { opacity: [0, 1], y: [28, 0] },
        {
          duration: 0.65,
          delay: staggerDelay,
          ease: [0.22, 1, 0.36, 1],
        }
      );

      controls.then(() => {
        // Clear inline transform after completion so CSS hover transforms remain responsive
        el.style.transform = "";
      });
    };

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            intersectionObserver.unobserve(target);
            triggerRise(target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -6% 0px",
        threshold: 0.08,
      }
    );

    const registerElements = (root: ParentNode = document) => {
      const candidates = root.querySelectorAll<HTMLElement>(TARGET_SELECTOR);
      candidates.forEach((el) => {
        if (shouldSkipElement(el)) return;
        el.dataset.fmObserved = "true";

        const rect = el.getBoundingClientRect();
        const inViewport =
          rect.top < window.innerHeight * 0.96 && rect.bottom > 0;

        if (inViewport) {
          triggerRise(el);
        } else {
          el.style.opacity = "0";
          intersectionObserver.observe(el);
        }
      });
    };

    registerElements(document);

    const mutationObserver = new MutationObserver((mutations) => {
      let hasNewNodes = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          hasNewNodes = true;
          break;
        }
      }
      if (hasNewNodes) {
        registerElements(document);
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Also listen for scroll events inside nested scrollable containers in PuzzlePro
    const handleScrollCapture = () => {
      const unobserved = document.querySelectorAll<HTMLElement>(
        "[data-fm-observed='true']:not([data-fm-risen='true'])"
      );
      unobserved.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
          intersectionObserver.unobserve(el);
          triggerRise(el);
        }
      });
    };

    window.addEventListener("scroll", handleScrollCapture, {
      capture: true,
      passive: true,
    });

    return () => {
      if (batchResetTimer) clearTimeout(batchResetTimer);
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("scroll", handleScrollCapture, {
        capture: true,
      });
    };
  }, [pathname, prefersReducedMotion]);

  return <>{children}</>;
}

export interface MotionRiseProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  once?: boolean;
}

export function MotionRise({
  children,
  className = "",
  delay = 0,
  duration = 0.65,
  yOffset = 28,
  once = true,
}: MotionRiseProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      data-fm-risen="true"
      className={className}
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.12 }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export interface MotionStaggerProps {
  children: ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
  once?: boolean;
}

const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (custom: { staggerChildren: number; delayChildren: number }) => ({
    opacity: 1,
    transition: {
      staggerChildren: custom.staggerChildren,
      delayChildren: custom.delayChildren,
    },
  }),
};

export const motionRiseItemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function MotionStagger({
  children,
  className = "",
  staggerChildren = 0.08,
  delayChildren = 0.04,
  once = true,
}: MotionStaggerProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      data-fm-risen="true"
      className={className}
      variants={staggerContainerVariants}
      custom={{ staggerChildren, delayChildren }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.1 }}
    >
      {children}
    </motion.div>
  );
}
