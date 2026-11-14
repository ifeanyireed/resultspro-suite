"use client";

import React, { useEffect, useRef } from "react";
import { animate, motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { usePathname } from "next/navigation";

const RISE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const TARGET_SELECTOR = [
  "section",
  "article",
  "header:not(nav header)",
  "footer",
  '[class*="card"]',
  '[class*="grid"] > div',
  "h1",
  "h2",
  "h3",
  "h4",
  "p",
  "blockquote",
  "form",
  "table",
  "ul > li",
  "ol > li",
  ".rise-on-scroll",
  "[data-rise]",
].join(", ");

const SKIP_TAGS = new Set([
  "NAV",
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "SVG",
  "PATH",
  "CANVAS",
  "INPUT",
  "TEXTAREA",
  "SELECT",
  "OPTION",
]);

function shouldSkipElement(el: HTMLElement): boolean {
  if (!el || !(el instanceof HTMLElement)) return true;
  if (SKIP_TAGS.has(el.tagName)) return true;
  if (el.dataset.fmRisen === "true" || el.dataset.fmObserved === "true") return true;
  if (el.hasAttribute("data-no-rise") || el.closest("[data-no-rise]")) return true;
  if (el.closest("nav")) return true;

  const computed = window.getComputedStyle(el);
  if (computed.position === "fixed" || computed.position === "sticky") return true;
  if (computed.display === "none" || computed.visibility === "hidden") return true;

  // Skip elements inside fixed overlays (e.g. floating chat widget or modals)
  let parent = el.parentElement;
  while (parent && parent !== document.body) {
    const parentPos = window.getComputedStyle(parent).position;
    if (parentPos === "fixed") return true;
    parent = parent.parentElement;
  }

  return false;
}

export interface MotionRiseProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  yOffset?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
}

/**
 * Reusable declarative Framer Motion wrapper that rises into position on load / scroll.
 */
export function MotionRise({
  children,
  delay = 0,
  yOffset = 28,
  duration = 0.65,
  once = true,
  amount = 0.15,
  ...rest
}: MotionRiseProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      data-no-rise="true"
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: RISE_EASE }}
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
  amount?: number;
}

/**
 * Reusable declarative Framer Motion stagger container for lists and grids.
 */
export function MotionStagger({
  children,
  staggerChildren = 0.08,
  delayChildren = 0.05,
  once = true,
  amount = 0.12,
  ...rest
}: MotionStaggerProps) {
  return (
    <motion.div
      data-no-rise="true"
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
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

/**
 * Global Framer Motion scroll-and-entrance rise provider.
 * Automatically discovers on-screen and below-the-fold page elements across all routes
 * and animates them rising smoothly into position as they enter the viewport.
 */
export default function ScrollRiseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const ioRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (prefersReducedMotion) {
      document.querySelectorAll<HTMLElement>("[data-fm-observed]").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.dataset.fmRisen = "true";
      });
      return;
    }

    const triggerRise = (el: HTMLElement, staggerDelay: number) => {
      if (el.dataset.fmRisen === "true") return;
      el.dataset.fmRisen = "true";

      animate(
        el,
        { opacity: [0, 1], y: [28, 0] },
        {
          duration: 0.65,
          delay: staggerDelay,
          ease: RISE_EASE,
        }
      ).then(() => {
        el.style.willChange = "auto";
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        let batchIndex = 0;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          observer.unobserve(el);

          const staggerDelay = Math.min(batchIndex * 0.055, 0.33);
          batchIndex += 1;
          triggerRise(el, staggerDelay);
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -6% 0px",
        threshold: 0.06,
      }
    );

    ioRef.current = observer;

    const registerElements = (root: ParentNode = document) => {
      const candidates = root.querySelectorAll<HTMLElement>(TARGET_SELECTOR);
      let initialBatchIndex = 0;

      candidates.forEach((el) => {
        if (shouldSkipElement(el)) return;

        el.dataset.fmObserved = "true";
        el.style.opacity = "0";
        el.style.transform = "translateY(28px)";
        el.style.willChange = "opacity, transform";

        const rect = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        // If already in or above the viewport on load/navigation, animate immediately with a gentle stagger
        if (rect.top < viewportHeight * 0.94 && rect.bottom > 0) {
          const staggerDelay = Math.min(initialBatchIndex * 0.05, 0.35);
          initialBatchIndex += 1;
          triggerRise(el, staggerDelay);
        } else {
          observer.observe(el);
        }
      });
    };

    // Initial scan after layout paint
    const rafId = window.requestAnimationFrame(() => {
      registerElements(document);
    });

    // Observe dynamic DOM additions (client components, tab switches, async data)
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches?.(TARGET_SELECTOR) && !shouldSkipElement(node)) {
              node.dataset.fmObserved = "true";
              node.style.opacity = "0";
              node.style.transform = "translateY(28px)";
              node.style.willChange = "opacity, transform";
              observer.observe(node);
            }
            registerElements(node);
          }
        });
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      mutationObserver.disconnect();
      observer.disconnect();
      ioRef.current = null;
    };
  }, [pathname, prefersReducedMotion]);

  return <>{children}</>;
}
