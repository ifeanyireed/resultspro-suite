"use client";

import React, { createContext, useContext, useEffect } from "react";
import { animate, motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { usePathname } from "next/navigation";

const ScrollRiseContext = createContext<boolean>(false);

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

const SKIP_ANCESTOR_SELECTOR = [
  "nav",
  "aside",
  "header",
  "[data-no-rise]",
  '[role="dialog"]',
  '[role="menu"]',
  '[role="listbox"]',
  '[role="tooltip"]',
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
  " HEAD",
  "META",
  "LINK",
]);

function shouldSkipElement(el: HTMLElement): boolean {
  if (!el || !(el instanceof HTMLElement)) return true;
  if (el.dataset.fmRisen === "true" || el.dataset.fmObserved === "true") return true;
  if (el.hasAttribute("data-no-rise") || el.getAttribute("aria-hidden") === "true") return true;
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

  // Skip tiny decorative elements (e.g. 1px lines, small badges/icons)
  const rect = el.getBoundingClientRect();
  if (rect.width < 16 && rect.height < 16 && rect.width > 0 && rect.height > 0) {
    return true;
  }

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

    let batchCounter = 0;
    let batchResetTimer: ReturnType<typeof setTimeout> | null = null;

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target as HTMLElement;
          intersectionObserver.unobserve(el);

          if (el.dataset.fmRisen === "true") return;
          el.dataset.fmRisen = "true";

          const staggerIndex = batchCounter % 8;
          batchCounter += 1;

          if (batchResetTimer) clearTimeout(batchResetTimer);
          batchResetTimer = setTimeout(() => {
            batchCounter = 0;
          }, 120);

          const customDelay = el.dataset.riseDelay ? parseFloat(el.dataset.riseDelay) : 0;
          const staggerDelay = customDelay + staggerIndex * 0.055;

          animate(
            el,
            { opacity: [0, 1], y: [28, 0] },
            {
              duration: 0.65,
              delay: staggerDelay,
              ease: [0.22, 1, 0.36, 1],
            }
          ).then(() => {
            el.style.removeProperty("will-change");
          });
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.08,
      }
    );

    const registerCandidates = (root: ParentNode = document) => {
      const elements = root.querySelectorAll<HTMLElement>(TARGET_SELECTOR);
      elements.forEach((el) => {
        if (shouldSkipElement(el)) return;
        el.dataset.fmObserved = "true";
        el.style.opacity = "0";
        el.style.willChange = "opacity, transform";
        intersectionObserver.observe(el);
      });
    };

    // Initial scan on route mount
    const initialTimer = setTimeout(() => {
      registerCandidates(document);
    }, 16);

    // Watch for dynamically rendered DOM nodes on this page
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches && node.matches(TARGET_SELECTOR) && !shouldSkipElement(node)) {
            node.dataset.fmObserved = "true";
            node.style.opacity = "0";
            node.style.willChange = "opacity, transform";
            intersectionObserver.observe(node);
          }
          registerCandidates(node);
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
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
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
}

export function MotionRise({
  children,
  delay = 0,
  duration = 0.65,
  yOffset = 28,
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
      viewport={{ once, amount: 0.12, margin: "0px 0px -40px 0px" }}
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
  children: React.ReactNode;
  staggerChildren?: number;
  delayChildren?: number;
  once?: boolean;
}

export function MotionStagger({
  children,
  staggerChildren = 0.08,
  delayChildren = 0.05,
  once = true,
  ...rest
}: MotionStaggerProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div {...(rest as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
  }

  return (
    <motion.div
      data-fm-risen="true"
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.1 }}
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
