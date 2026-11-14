"use client";

import React, { useEffect, useRef } from "react";
import { animate, motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { usePathname } from "next/navigation";

const TARGET_SELECTOR = [
  "main > section",
  "main > div > section",
  "section",
  "article",
  "header:not(nav header)",
  "footer",
  "[class*='card']",
  "[class*='Card']",
  "[class*='rounded-xl']",
  "[class*='rounded-2xl']",
  "[class*='rounded-3xl']",
  "[class*='rounded-lg']",
  "[class*='rounded-']",
  "[class*='grid'] > div",
  "[class*='grid'] > a",
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
  "NOSCRIPT",
]);

function shouldSkipElement(el: HTMLElement): boolean {
  if (!el || !(el instanceof HTMLElement)) return true;
  if (el.dataset.fmRisen === "true" || el.dataset.fmObserved === "true") return true;
  if (SKIP_TAGS.has(el.tagName)) return true;
  if (el.closest("[data-no-rise], nav, aside, [role='dialog'], [role='menu'], [role='listbox'], [role='tooltip']")) {
    return true;
  }

  const className = typeof el.className === "string" ? el.className : "";
  if (
    className.includes("fixed") ||
    className.includes("sticky") ||
    className.includes("sr-only") ||
    className.includes("pointer-events-none")
  ) {
    return true;
  }

  const computed = window.getComputedStyle(el);
  if (
    computed.position === "fixed" ||
    computed.position === "sticky" ||
    computed.display === "none" ||
    computed.visibility === "hidden" ||
    computed.display === "inline"
  ) {
    return true;
  }

  const rect = el.getBoundingClientRect();
  if (rect.width < 12 || rect.height < 12) return true;

  // Avoid double-animating huge wrapper roots that span multiple viewports when inner children will animate
  if (
    rect.height > window.innerHeight * 2.2 &&
    (el.tagName === "SECTION" || el.tagName === "DIV" || el.tagName === "ARTICLE")
  ) {
    return true;
  }

  return false;
}

export function ScrollRiseProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const batchQueueRef = useRef<HTMLElement[]>([]);
  const batchTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion) return;

    const flushBatch = () => {
      const batch = batchQueueRef.current.splice(0, batchQueueRef.current.length);
      batchTimerRef.current = null;

      // Sort visual order top-to-bottom, left-to-right for natural cascade
      batch.sort((a, b) => {
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        if (Math.abs(ra.top - rb.top) > 16) return ra.top - rb.top;
        return ra.left - rb.left;
      });

      batch.forEach((el, index) => {
        const staggerDelay = Math.min(index * 0.055, 0.35);
        el.dataset.fmRisen = "true";

        const control = animate(
          el,
          {
            opacity: [0, 1],
            y: [28, 0],
          },
          {
            duration: 0.65,
            delay: staggerDelay,
            ease: [0.22, 1, 0.36, 1],
          }
        );

        control.then(() => {
          el.style.opacity = "";
          el.style.transform = "";
          el.style.willChange = "";
        });
      });
    };

    const enqueueReveal = (el: HTMLElement) => {
      batchQueueRef.current.push(el);
      if (batchTimerRef.current === null) {
        batchTimerRef.current = window.setTimeout(flushBatch, 24);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            const el = entry.target as HTMLElement;
            io.unobserve(el);
            enqueueReveal(el);
          }
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -6% 0px",
        threshold: 0.06,
      }
    );

    observerRef.current = io;

    const scanAndObserve = (root: ParentNode = document) => {
      const candidates = root.querySelectorAll<HTMLElement>(TARGET_SELECTOR);
      candidates.forEach((el) => {
        if (shouldSkipElement(el)) return;

        el.dataset.fmObserved = "true";
        const rect = el.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight * 0.96 && rect.bottom > 0;

        el.style.opacity = "0";
        el.style.transform = "translateY(28px)";
        el.style.willChange = "opacity, transform";

        if (inViewport) {
          enqueueReveal(el);
        } else {
          io.observe(el);
        }
      });
    };

    // Initial scan on route load
    const initialTimer = window.setTimeout(() => {
      scanAndObserve(document);
    }, 30);

    // Watch dynamically loaded content (async fetches, tabs, modals, pagination)
    const mo = new MutationObserver((mutations) => {
      let hasNewNodes = false;
      for (const m of mutations) {
        if (m.addedNodes.length > 0) {
          hasNewNodes = true;
          break;
        }
      }
      if (hasNewNodes) {
        scanAndObserve(document);
      }
    });

    mo.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.clearTimeout(initialTimer);
      if (batchTimerRef.current !== null) {
        window.clearTimeout(batchTimerRef.current);
      }
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname, prefersReducedMotion]);

  return <>{children}</>;
}

export interface MotionRiseProps extends HTMLMotionProps<"div"> {
  delay?: number;
  duration?: number;
  yOffset?: number;
  once?: boolean;
  children: React.ReactNode;
}

export function MotionRise({
  delay = 0,
  duration = 0.65,
  yOffset = 28,
  once = true,
  children,
  ...rest
}: MotionRiseProps) {
  return (
    <motion.div
      data-fm-risen="true"
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "0px 0px -6% 0px", amount: 0.08 }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export interface MotionStaggerProps extends HTMLMotionProps<"div"> {
  staggerChildren?: number;
  delayChildren?: number;
  once?: boolean;
  children: React.ReactNode;
}

export function MotionStagger({
  staggerChildren = 0.08,
  delayChildren = 0.04,
  once = true,
  children,
  ...rest
}: MotionStaggerProps) {
  return (
    <motion.div
      data-fm-risen="true"
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "0px 0px -6% 0px", amount: 0.08 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren,
            delayChildren,
          },
        },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
