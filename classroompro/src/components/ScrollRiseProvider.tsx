"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import { usePathname } from "next/navigation";

const ScrollRiseContext = createContext<boolean>(false);
const RISE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const TARGET_SELECTOR = [".rise-on-scroll", "[data-rise]"].join(", ");

const SKIP_ANCESTOR_SELECTOR = [
  "nav",
  "aside",
  "header",
  "form",
  "[data-no-rise]",
  "[data-fm-risen]",
  '[role="dialog"]',
  '[aria-modal="true"]',
  '[role="menu"]',
  '[role="listbox"]',
  '[role="tooltip"]',
  ".no-rise",
].join(", ");

const SKIP_TAG_NAMES = new Set([
  "NAV",
  "ASIDE",
  "HEADER",
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
  "HEAD",
  "META",
  "LINK",
  "NOSCRIPT",
]);

function shouldSkipElement(el: HTMLElement): boolean {
  if (!el || !(el instanceof HTMLElement)) return true;
  if (el.dataset.fmRisen === "true" || el.dataset.fmObserved === "true") return true;
  if (
    el.hasAttribute("data-no-rise") ||
    el.hasAttribute("data-fm-risen") ||
    el.getAttribute("aria-hidden") === "true"
  ) {
    return true;
  }
  if (SKIP_TAG_NAMES.has(el.tagName)) return true;
  if (el.closest(SKIP_ANCESTOR_SELECTOR)) return true;

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

  return false;
}

export function ScrollRiseProvider({ children }: { children: React.ReactNode }) {
  const isNested = useContext(ScrollRiseContext);
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (isNested || prefersReducedMotion || typeof window === "undefined") {
      return;
    }

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
      const currentBatch = batchQueue;
      batchQueue = [];
      batchTimer = null;

      currentBatch.forEach((el, idx) => {
        pendingElements.delete(el);
        if (!el.isConnected || el.dataset.fmRisen === "true") {
          restoreInlineStyles(el);
          return;
        }
        el.dataset.fmRisen = "true";

        const customDelay = el.dataset.riseDelay ? parseFloat(el.dataset.riseDelay) : 0;
        const staggerDelay = customDelay + Math.min(idx * 0.055, 0.35);

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

    const enqueueRise = (el: HTMLElement) => {
      batchQueue.push(el);
      if (batchTimer === null) {
        batchTimer = window.requestAnimationFrame(flushBatch);
      }
    };

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          intersectionObserver.unobserve(el);
          enqueueRise(el);
        });
      },
      {
        root: null,
        rootMargin: "0px 0px 0px 0px",
        threshold: 0,
      }
    );

    const registerCandidates = (root: ParentNode = document) => {
      const elements = root.querySelectorAll<HTMLElement>(TARGET_SELECTOR);
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;

      elements.forEach((el) => {
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
          enqueueRise(el);
        } else {
          intersectionObserver.observe(el);
        }
      });
    };

    const initialFrame = window.requestAnimationFrame(() => {
      registerCandidates(document);
    });

    let mutationFrame: number | null = null;
    const mutationObserver = new MutationObserver((mutations) => {
      let hasAddedNodes = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          hasAddedNodes = true;
          break;
        }
      }
      if (!hasAddedNodes) return;

      if (mutationFrame !== null) {
        window.cancelAnimationFrame(mutationFrame);
      }
      mutationFrame = window.requestAnimationFrame(() => {
        registerCandidates(document);
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.cancelAnimationFrame(initialFrame);
      if (batchTimer !== null) window.cancelAnimationFrame(batchTimer);
      if (mutationFrame !== null) window.cancelAnimationFrame(mutationFrame);
      intersectionObserver.disconnect();
      mutationObserver.disconnect();

      pendingElements.forEach((el) => {
        delete el.dataset.fmObserved;
        restoreInlineStyles(el);
      });
      pendingElements.clear();
    };
  }, [pathname, prefersReducedMotion, isNested]);

  if (isNested) {
    return <>{children}</>;
  }

  return (
    <ScrollRiseContext.Provider value={true}>
      {children}
    </ScrollRiseContext.Provider>
  );
}

export interface MotionRiseProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  once?: boolean;
  amount?: "some" | "all" | number;
}

export function MotionRise({
  children,
  delay = 0,
  duration = 0.65,
  yOffset = 28,
  once = true,
  amount = "some",
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
  children: React.ReactNode;
  staggerChildren?: number;
  delayChildren?: number;
  once?: boolean;
  amount?: "some" | "all" | number;
}

export function MotionStagger({
  children,
  staggerChildren = 0.08,
  delayChildren = 0.05,
  once = true,
  amount = "some",
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
