"use client";

import React, { useEffect } from "react";
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
  "OPTION",
  "HEAD",
  "META",
  "LINK",
]);

const SKIP_ANCESTOR_SELECTOR =
  'nav, aside, [data-no-rise], script, style, svg, canvas, [role="dialog"], [aria-modal="true"]';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

function shouldSkipElement(el: HTMLElement): boolean {
  if (el.dataset.fmRisen === "true" || el.dataset.fmObserving === "true") {
    return true;
  }
  if (SKIP_TAGS.has(el.tagName)) {
    return true;
  }
  if (el.hasAttribute("data-no-rise")) {
    return true;
  }
  if (el.closest(SKIP_ANCESTOR_SELECTOR)) {
    return true;
  }

  const className = typeof el.className === "string" ? el.className : "";
  if (
    className.includes("min-h-screen") ||
    className.includes("h-screen") ||
    className.includes("fixed") ||
    className.includes("sticky")
  ) {
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
  if (rect.width === 0 && rect.height === 0) {
    return true;
  }

  return false;
}

export function ScrollRiseProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion) {
      return;
    }

    let batchCounter = 0;
    let batchResetTimer: ReturnType<typeof setTimeout> | null = null;

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target as HTMLElement;
          intersectionObserver.unobserve(el);
          delete el.dataset.fmObserving;

          if (el.dataset.fmRisen === "true") return;
          el.dataset.fmRisen = "true";

          const staggerDelay = Math.min(batchCounter * 0.055, 0.35);
          batchCounter += 1;

          if (batchResetTimer) clearTimeout(batchResetTimer);
          batchResetTimer = setTimeout(() => {
            batchCounter = 0;
          }, 120);

          const controls = animate(
            el,
            { opacity: [0, 1], y: [28, 0] },
            {
              duration: 0.65,
              delay: staggerDelay,
              ease: EASE_OUT_EXPO,
            }
          );

          controls.then(() => {
            el.style.opacity = "";
            el.style.transform = "";
            el.style.willChange = "";
          });
        });
      },
      {
        threshold: 0.06,
        rootMargin: "0px 0px -24px 0px",
      }
    );

    const registerElement = (el: HTMLElement) => {
      if (shouldSkipElement(el)) return;

      el.dataset.fmObserving = "true";
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      el.style.willChange = "opacity, transform";
      intersectionObserver.observe(el);
    };

    const scanDOM = (root: ParentNode = document) => {
      const elements = root.querySelectorAll<HTMLElement>(TARGET_SELECTOR);
      elements.forEach((el) => registerElement(el));
    };

    // Initial scan on route load / pathname change
    const initialTimer = setTimeout(() => {
      scanDOM(document);
    }, 16);

    // Watch for dynamically rendered DOM nodes (tabs, async data, modals, route transitions)
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches && node.matches(TARGET_SELECTOR)) {
            registerElement(node);
          }
          scanDOM(node);
        });
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(initialTimer);
      if (batchResetTimer) clearTimeout(batchResetTimer);
      mutationObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [pathname, prefersReducedMotion]);

  return <>{children}</>;
}

export interface MotionRiseProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  once?: boolean;
  amount?: number;
}

export function MotionRise({
  children,
  delay = 0,
  duration = 0.65,
  yOffset = 28,
  once = true,
  amount = 0.15,
  ...rest
}: MotionRiseProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={rest.className} style={rest.style as React.CSSProperties}>{children}</div>;
  }

  return (
    <motion.div
      data-fm-risen="true"
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE_OUT_EXPO }}
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

export function MotionStagger({
  children,
  staggerChildren = 0.08,
  delayChildren = 0.04,
  once = true,
  amount = 0.1,
  ...rest
}: MotionStaggerProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={rest.className} style={rest.style as React.CSSProperties}>{children}</div>;
  }

  return (
    <motion.div
      data-fm-risen="true"
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

export default ScrollRiseProvider;
