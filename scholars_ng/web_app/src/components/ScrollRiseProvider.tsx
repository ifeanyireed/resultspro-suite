"use client";

import React, { useEffect, useRef } from "react";
import { animate, motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { usePathname } from "next/navigation";

const RISE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const TARGET_SELECTOR = [
  "section > div > div",
  "article",
  "footer > div",
  ".card",
  ".card-nets",
  '[class*="card"]',
  '[class*="rounded-xl"]',
  '[class*="rounded-2xl"]',
  '[class*="rounded-3xl"]',
  '[class*="rounded-["]',
  '[class*="grid"] > div',
  ".bento-grid > div",
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
  ".overline",
  ".overline-dark",
  ".rise-on-scroll",
  "[data-rise]",
].join(", ");

const SKIP_TAGS = new Set([
  "NAV",
  "ASIDE",
  "SCRIPT",
  "STYLE",
  "SVG",
  "CANVAS",
  "INPUT",
  "TEXTAREA",
  "SELECT",
  "HEAD",
  "META",
  "LINK",
  "BUTTON",
]);

function hasFixedOrStickyAncestor(el: HTMLElement): boolean {
  let curr: HTMLElement | null = el;
  while (curr && curr !== document.body && curr !== document.documentElement) {
    if (
      curr.tagName === "NAV" ||
      curr.tagName === "ASIDE" ||
      curr.hasAttribute("data-no-rise") ||
      curr.getAttribute("role") === "banner" ||
      curr.getAttribute("role") === "dialog" ||
      curr.classList.contains("fixed") ||
      curr.classList.contains("sticky")
    ) {
      return true;
    }
    const pos = window.getComputedStyle(curr).position;
    if (pos === "fixed" || pos === "sticky") {
      return true;
    }
    curr = curr.parentElement;
  }
  return false;
}

function shouldSkipElement(el: HTMLElement): boolean {
  if (!el || !(el instanceof HTMLElement)) return true;
  if (el.dataset.fmRisen === "true" || el.dataset.fmObserved === "true") return true;
  if (SKIP_TAGS.has(el.tagName)) return true;
  if (el.hasAttribute("data-no-rise") || el.getAttribute("aria-hidden") === "true") return true;
  if (hasFixedOrStickyAncestor(el)) return true;

  const computed = window.getComputedStyle(el);
  if (
    computed.position === "fixed" ||
    computed.position === "sticky" ||
    computed.position === "absolute" ||
    computed.display === "none" ||
    computed.visibility === "hidden" ||
    computed.opacity === "0"
  ) {
    return true;
  }

  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return true;

  // Skip giant full-page layout wrappers (> 2.5x viewport height) so their inner children animate individually
  const vh = window.innerHeight || 800;
  if (rect.height > vh * 2.2 && el.children.length > 1) return true;

  return false;
}

export interface MotionRiseProps extends HTMLMotionProps<"div"> {
  children?: React.ReactNode;
  delay?: number;
  yOffset?: number;
  duration?: number;
  once?: boolean;
}

export function MotionRise({
  children,
  delay = 0,
  yOffset = 28,
  duration = 0.65,
  once = true,
  ...rest
}: MotionRiseProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div {...(rest as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
  }

  return (
    <motion.div
      data-fm-risen="true"
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.08, margin: "0px 0px -32px 0px" }}
      transition={{ duration, delay, ease: RISE_EASE }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export interface MotionStaggerProps extends HTMLMotionProps<"div"> {
  children?: React.ReactNode;
  staggerChildren?: number;
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
}

export function MotionStagger({
  children,
  staggerChildren = 0.08,
  stagger,
  delayChildren = 0.05,
  once = true,
  ...rest
}: MotionStaggerProps) {
  const effectiveStagger = stagger ?? staggerChildren;
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div {...(rest as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
  }

  return (
    <motion.div
      data-fm-risen="true"
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.08 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: effectiveStagger, delayChildren },
        },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function ScrollRiseProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion) return;

    const root = rootRef.current ?? document.body;
    let batchCounter = 0;
    let batchResetTimer: ReturnType<typeof setTimeout> | null = null;

    const triggerRise = (el: HTMLElement) => {
      if (el.dataset.fmRisen === "true") return;
      el.dataset.fmRisen = "true";

      const staggerDelay = Math.min((batchCounter % 8) * 0.055, 0.38);
      batchCounter += 1;

      if (batchResetTimer) clearTimeout(batchResetTimer);
      batchResetTimer = setTimeout(() => {
        batchCounter = 0;
      }, 140);

      animate(
        el,
        { opacity: [0, 1], y: [28, 0] },
        {
          duration: 0.65,
          delay: staggerDelay,
          ease: RISE_EASE,
        }
      ).then(() => {
        el.style.opacity = "";
        el.style.transform = "";
        el.style.willChange = "";
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            io.unobserve(target);
            triggerRise(target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -36px 0px",
        threshold: 0.01,
      }
    );

    const registerElements = (scope: ParentNode = root) => {
      const candidates = scope.querySelectorAll<HTMLElement>(TARGET_SELECTOR);
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      candidates.forEach((el) => {
        if (shouldSkipElement(el)) return;

        el.dataset.fmObserved = "true";
        const rect = el.getBoundingClientRect();

        if (rect.top < viewportHeight * 0.94 && rect.bottom > 0) {
          triggerRise(el);
        } else {
          el.style.opacity = "0";
          el.style.transform = "translateY(28px)";
          el.style.willChange = "opacity, transform";
          io.observe(el);
        }
      });
    };

    const rafId = window.requestAnimationFrame(() => {
      registerElements(root);
    });

    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches?.(TARGET_SELECTOR) && !shouldSkipElement(node)) {
              node.dataset.fmObserved = "true";
              const rect = node.getBoundingClientRect();
              const vh = window.innerHeight || document.documentElement.clientHeight;
              if (rect.top < vh * 0.94 && rect.bottom > 0) {
                triggerRise(node);
              } else {
                node.style.opacity = "0";
                node.style.transform = "translateY(28px)";
                node.style.willChange = "opacity, transform";
                io.observe(node);
              }
            }
            registerElements(node);
          }
        });
      }
    });

    mo.observe(root, { childList: true, subtree: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      if (batchResetTimer) clearTimeout(batchResetTimer);
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname, prefersReducedMotion]);

  return (
    <div ref={rootRef} className="fm-scroll-rise-root">
      {children}
    </div>
  );
}

export default ScrollRiseProvider;
