"use client";

import React, { useEffect, useRef } from "react";
import { animate, motion, useReducedMotion, type Variants } from "framer-motion";
import { usePathname } from "next/navigation";

const RISE_SELECTOR = [
  "section",
  "article",
  "footer",
  "header:not([data-no-rise])",
  '[class*="card"]',
  '[class*="Card"]',
  '[class*="rounded-"]',
  '[class*="grid"] > div',
  "h1",
  "h2",
  "h3",
  "h4",
  "p",
  "blockquote",
  "form",
  "table",
  "tbody > tr",
  "ul > li",
  "ol > li",
  "dl > div",
  "figure",
  ".rise-on-scroll",
  "[data-rise]",
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
  "OPTION",
  "HEAD",
  "META",
  "LINK",
  "NOSCRIPT",
]);

function shouldSkipElement(el: HTMLElement): boolean {
  if (!el || !(el instanceof HTMLElement)) return true;
  if (el.dataset.fmRisen === "true" || el.dataset.fmObserved === "true") return true;
  if (SKIP_TAGS.has(el.tagName)) return true;
  if (el.closest("nav, aside, [data-no-rise], [role='dialog'], [aria-modal='true']")) {
    return true;
  }

  const computed = window.getComputedStyle(el);
  if (
    computed.position === "fixed" ||
    computed.position === "sticky" ||
    computed.display === "none" ||
    computed.visibility === "hidden"
  ) {
    return true;
  }

  const rect = el.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return true;

  // Avoid double-animating huge layout wrappers that encompass the whole viewport height
  if (
    (el.tagName === "DIV" || el.tagName === "SECTION") &&
    rect.height > window.innerHeight * 2.2 &&
    el.children.length > 3
  ) {
    return true;
  }

  return false;
}

export function ScrollRiseProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion) return;

    let batchQueue: HTMLElement[] = [];
    let batchTimer: number | null = null;

    const flushBatch = () => {
      const currentBatch = batchQueue;
      batchQueue = [];
      batchTimer = null;

      currentBatch.forEach((el, idx) => {
        if (el.dataset.fmRisen === "true") return;
        el.dataset.fmRisen = "true";

        const staggerDelay = Math.min(idx * 0.055, 0.35);

        animate(
          el,
          { opacity: [0, 1], y: [28, 0] },
          {
            duration: 0.65,
            delay: staggerDelay,
            ease: [0.22, 1, 0.36, 1],
          }
        ).then(() => {
          el.style.willChange = "";
        });
      });
    };

    const enqueueRise = (el: HTMLElement) => {
      batchQueue.push(el);
      if (batchTimer === null) {
        batchTimer = window.requestAnimationFrame(flushBatch);
      }
    };

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            intersectionObserver.unobserve(target);
            enqueueRise(target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -6% 0px",
        threshold: 0.08,
      }
    );

    const registerElements = (scope: ParentNode = document) => {
      const candidates = scope.querySelectorAll<HTMLElement>(RISE_SELECTOR);
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      candidates.forEach((el) => {
        if (shouldSkipElement(el)) return;

        el.dataset.fmObserved = "true";
        const rect = el.getBoundingClientRect();

        // If already scrolled well above the viewport, leave it visible without re-animating
        if (rect.bottom < 0) {
          el.dataset.fmRisen = "true";
          return;
        }

        // Set initial pre-rise state
        el.style.opacity = "0";
        el.style.transform = "translateY(28px)";
        el.style.willChange = "opacity, transform";

        // If currently in viewport on load/route transition, trigger entrance rise right away
        if (rect.top < viewportHeight * 0.96) {
          enqueueRise(el);
        } else {
          intersectionObserver.observe(el);
        }
      });
    };

    // Initial scan on mount / pathname change
    const initialFrame = window.requestAnimationFrame(() => {
      registerElements(rootRef.current || document);
    });

    // Observe dynamic DOM mutations (async query data, tabs, modals, client transitions)
    let mutationFrame: number | null = null;
    const mutationObserver = new MutationObserver((mutations) => {
      let hasAddedNodes = false;
      for (const m of mutations) {
        if (m.addedNodes.length > 0) {
          hasAddedNodes = true;
          break;
        }
      }
      if (!hasAddedNodes) return;

      if (mutationFrame !== null) {
        window.cancelAnimationFrame(mutationFrame);
      }
      mutationFrame = window.requestAnimationFrame(() => {
        registerElements(rootRef.current || document);
      });
    });

    mutationObserver.observe(rootRef.current || document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.cancelAnimationFrame(initialFrame);
      if (batchTimer !== null) window.cancelAnimationFrame(batchTimer);
      if (mutationFrame !== null) window.cancelAnimationFrame(mutationFrame);
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname, prefersReducedMotion]);

  return (
    <div ref={rootRef} className="contents">
      {children}
    </div>
  );
}

export interface MotionRiseProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  once?: boolean;
  amount?: number;
}

export function MotionRise({
  children,
  className,
  delay = 0,
  duration = 0.65,
  yOffset = 28,
  once = true,
  amount = 0.15,
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
      viewport={{ once, amount }}
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

const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: (staggerChildren: number = 0.08) => ({
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren: 0.04,
    },
  }),
};

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export interface MotionStaggerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
  amount?: number;
}

export function MotionStagger({
  children,
  className,
  staggerDelay = 0.08,
  once = true,
  amount = 0.12,
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
      custom={staggerDelay}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return (
          <motion.div data-fm-risen="true" variants={staggerItemVariants}>
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default ScrollRiseProvider;
