"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import { usePathname } from "next/navigation";

const RISE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const TARGET_SELECTOR = [".rise-on-scroll", "[data-rise]"].join(", ");

const SKIP_ANCESTOR_SELECTOR =
  'nav, aside, form, [data-no-rise], [data-fm-risen], [role="dialog"], [aria-modal="true"], [role="menu"], [role="listbox"], [role="tooltip"], .no-rise';

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
  "BUTTON",
  "FORM",
  "NOSCRIPT",
]);

function shouldSkipElement(el: HTMLElement): boolean {
  if (!el || !(el instanceof HTMLElement)) return true;
  if (el.dataset.fmRisen === "true" || el.dataset.fmObserved === "true") return true;
  if (el.hasAttribute("data-no-rise") || el.hasAttribute("data-fm-risen")) return true;
  if (SKIP_TAGS.has(el.tagName)) return true;
  if (el.closest(SKIP_ANCESTOR_SELECTOR)) return true;

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
  if (rect.width === 0 && rect.height === 0) return true;

  return false;
}

export function ScrollRiseProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion) return;

    let batchQueue: HTMLElement[] = [];
    let batchTimer: number | null = null;
    const pendingElements = new Set<HTMLElement>();

    const restoreInlineStyles = (el: HTMLElement) => {
      if (!el.isConnected) return;
      el.style.opacity = "";
      el.style.transform = "";
      el.style.willChange = "";
    };

    const flushBatch = () => {
      const batch = batchQueue;
      batchQueue = [];
      batchTimer = null;

      batch.sort((a, b) => {
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        if (Math.abs(ra.top - rb.top) > 16) return ra.top - rb.top;
        return ra.left - rb.left;
      });

      batch.forEach((el, index) => {
        pendingElements.delete(el);
        if (!el.isConnected || el.dataset.fmRisen === "true") {
          restoreInlineStyles(el);
          return;
        }
        el.dataset.fmRisen = "true";

        const staggerDelay = Math.min(index * 0.055, 0.35);

        animate(
          el,
          { opacity: [0, 1], y: [28, 0] },
          {
            duration: 0.65,
            delay: staggerDelay,
            ease: RISE_EASE,
          }
        )
          .then(() => {
            restoreInlineStyles(el);
          })
          .catch(() => {
            restoreInlineStyles(el);
          });
      });
    };

    const enqueueReveal = (el: HTMLElement) => {
      batchQueue.push(el);
      if (batchTimer === null) {
        batchTimer = window.requestAnimationFrame(flushBatch);
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
        rootMargin: "0px 0px 0px 0px",
        threshold: 0,
      }
    );

    const scanAndObserve = (root: ParentNode = document) => {
      const candidates = root.querySelectorAll<HTMLElement>(TARGET_SELECTOR);
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;

      candidates.forEach((el) => {
        if (shouldSkipElement(el)) return;

        el.dataset.fmObserved = "true";
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0) {
          el.dataset.fmRisen = "true";
          return;
        }

        pendingElements.add(el);
        el.style.opacity = "0";
        el.style.transform = "translateY(28px)";
        el.style.willChange = "opacity, transform";

        if (rect.top < viewportHeight) {
          enqueueReveal(el);
        } else {
          io.observe(el);
        }
      });
    };

    const initialFrame = window.requestAnimationFrame(() => {
      scanAndObserve(document);
    });

    let mutationFrame: number | null = null;
    const mo = new MutationObserver((mutations) => {
      let hasNewNodes = false;
      for (const m of mutations) {
        if (m.addedNodes.length > 0) {
          hasNewNodes = true;
          break;
        }
      }
      if (!hasNewNodes) return;

      if (mutationFrame !== null) {
        window.cancelAnimationFrame(mutationFrame);
      }
      mutationFrame = window.requestAnimationFrame(() => {
        scanAndObserve(document);
      });
    });

    mo.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.cancelAnimationFrame(initialFrame);
      if (batchTimer !== null) window.cancelAnimationFrame(batchTimer);
      if (mutationFrame !== null) window.cancelAnimationFrame(mutationFrame);
      io.disconnect();
      mo.disconnect();

      pendingElements.forEach((el) => {
        delete el.dataset.fmObserved;
        restoreInlineStyles(el);
      });
      pendingElements.clear();
    };
  }, [pathname, prefersReducedMotion]);

  return <>{children}</>;
}

export interface MotionRiseProps extends HTMLMotionProps<"div"> {
  delay?: number;
  duration?: number;
  yOffset?: number;
  once?: boolean;
  amount?: "some" | "all" | number;
  children: React.ReactNode;
}

export function MotionRise({
  delay = 0,
  duration = 0.65,
  yOffset = 28,
  once = true,
  amount = "some",
  children,
  ...rest
}: MotionRiseProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    if (isInView) {
      setHasRevealed(true);
      return;
    }

    const checkVisibility = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      if ((rect.width > 0 || rect.height > 0) && rect.top < viewportHeight) {
        setHasRevealed(true);
      }
    };

    const rafId = window.requestAnimationFrame(checkVisibility);
    return () => window.cancelAnimationFrame(rafId);
  }, [isInView]);

  if (prefersReducedMotion) {
    return (
      <motion.div
        data-fm-risen="true"
        data-no-rise="true"
        initial={false}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }

  const shouldShow = once ? hasRevealed || isInView : isInView;

  return (
    <motion.div
      ref={ref}
      data-fm-risen="true"
      data-no-rise="true"
      initial={{ opacity: 0, y: yOffset }}
      animate={shouldShow ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
      transition={{
        duration,
        delay,
        ease: RISE_EASE,
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
  amount?: "some" | "all" | number;
  children: React.ReactNode;
}

export function MotionStagger({
  staggerChildren = 0.08,
  delayChildren = 0.04,
  once = true,
  amount = "some",
  children,
  ...rest
}: MotionStaggerProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    if (isInView) {
      setHasRevealed(true);
      return;
    }

    const checkVisibility = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      if ((rect.width > 0 || rect.height > 0) && rect.top < viewportHeight) {
        setHasRevealed(true);
      }
    };

    const rafId = window.requestAnimationFrame(checkVisibility);
    return () => window.cancelAnimationFrame(rafId);
  }, [isInView]);

  if (prefersReducedMotion) {
    return (
      <motion.div
        data-fm-risen="true"
        data-no-rise="true"
        initial={false}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }

  const shouldShow = once ? hasRevealed || isInView : isInView;

  return (
    <motion.div
      ref={ref}
      data-fm-risen="true"
      data-no-rise="true"
      initial="hidden"
      animate={shouldShow ? "visible" : "hidden"}
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

export default ScrollRiseProvider;
