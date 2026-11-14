"use client";

import React, { useEffect, useRef } from "react";
import { animate, motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { usePathname } from "next/navigation";

const TARGET_SELECTOR = [
  "section",
  "article",
  "footer",
  '[class*="card"]',
  '[class*="rounded-"]',
  '[class*="grid"] > div',
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

const SKIP_ANCESTOR_SELECTOR = 'nav, aside, [data-no-rise], [role="dialog"], header.sticky, header.fixed';
const SKIP_TAG_NAMES = new Set([
  "NAV",
  "ASIDE",
  "SCRIPT",
  "STYLE",
  "SVG",
  "CANVAS",
  "INPUT",
  "TEXTAREA",
  "SELECT",
  "OPTION",
  "HEAD",
  "META",
  "LINK",
]);

function shouldSkipElement(el: HTMLElement): boolean {
  if (!el || !(el instanceof HTMLElement)) return true;
  if (el.dataset.fmRisen === "true" || el.dataset.fmObserved === "true") return true;
  if (el.hasAttribute("data-no-rise")) return true;
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

  // Skip full-viewport modal backdrops / overlays
  if (
    el.classList.contains("fixed") ||
    el.classList.contains("sticky") ||
    el.getAttribute("role") === "dialog"
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
    if (prefersReducedMotion || typeof window === "undefined") return;

    let batchQueue: HTMLElement[] = [];
    let batchTimer: number | null = null;

    const flushBatch = () => {
      const currentBatch = batchQueue;
      batchQueue = [];
      batchTimer = null;

      currentBatch.forEach((el, idx) => {
        if (!el.isConnected || el.dataset.fmRisen === "true") return;
        el.dataset.fmRisen = "true";

        const staggerDelay = Math.min(idx * 0.055, 0.35);

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
          if (el.isConnected) {
            el.style.opacity = "";
            el.style.transform = "";
          }
        });
      });
    };

    const enqueueRise = (el: HTMLElement) => {
      batchQueue.push(el);
      if (batchTimer === null) {
        batchTimer = window.setTimeout(flushBatch, 16);
      }
    };

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            intersectionObserver.unobserve(target);
            enqueueRise(target);
          }
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.06,
      }
    );

    const registerElements = (scope: ParentNode) => {
      const elements = scope.querySelectorAll<HTMLElement>(TARGET_SELECTOR);
      elements.forEach((el) => {
        if (shouldSkipElement(el)) return;
        el.dataset.fmObserved = "true";
        el.style.opacity = "0";
        el.style.transform = "translateY(28px)";
        intersectionObserver.observe(el);
      });
    };

    const container = rootRef.current ?? document.body;
    registerElements(container);

    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches && node.matches(TARGET_SELECTOR) && !shouldSkipElement(node)) {
              node.dataset.fmObserved = "true";
              node.style.opacity = "0";
              node.style.transform = "translateY(28px)";
              intersectionObserver.observe(node);
            }
            registerElements(node);
          }
        });
      }
    });

    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
    });

    return () => {
      if (batchTimer !== null) {
        window.clearTimeout(batchTimer);
      }
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

export interface MotionRiseProps extends HTMLMotionProps<"div"> {
  delay?: number;
  duration?: number;
  yOffset?: number;
  once?: boolean;
  children?: React.ReactNode;
}

export function MotionRise({
  delay = 0,
  duration = 0.65,
  yOffset = 28,
  once = true,
  children,
  ...rest
}: MotionRiseProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      data-fm-risen="true"
      initial={prefersReducedMotion ? false : { opacity: 0, y: yOffset }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once, margin: "0px 0px -40px 0px", amount: 0.08 }}
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
  children?: React.ReactNode;
}

export function MotionStagger({
  staggerChildren = 0.08,
  delayChildren = 0.04,
  once = true,
  children,
  ...rest
}: MotionStaggerProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      data-fm-risen="true"
      initial={prefersReducedMotion ? false : "hidden"}
      whileInView={prefersReducedMotion ? undefined : "visible"}
      viewport={{ once, margin: "0px 0px -40px 0px", amount: 0.06 }}
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
