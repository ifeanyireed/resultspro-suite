"use client";

import React, { useEffect } from "react";
import { animate, motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { usePathname } from "next/navigation";

const TARGET_SELECTOR = [
  "section",
  "article",
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
  ".rise-on-scroll",
].join(", ");

const SKIP_SELECTOR = [
  "nav",
  'header[role="banner"]',
  "[data-no-rise]",
  "[data-no-rise] *",
  "script",
  "style",
  "svg",
  "canvas",
  "input",
  "textarea",
  "select",
].join(", ");

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

function shouldSkipElement(el: HTMLElement): boolean {
  if (el.dataset.fmRisen === "true" || el.dataset.fmObserved === "true") {
    return true;
  }
  if (el.matches(SKIP_SELECTOR) || el.closest("nav, [data-no-rise], header[role='banner']")) {
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

export interface MotionRiseProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  yOffset?: number;
  duration?: number;
  amount?: number;
}

export function MotionRise({
  children,
  delay = 0,
  yOffset = 28,
  duration = 0.65,
  amount = 0.15,
  ...rest
}: MotionRiseProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      data-fm-risen="true"
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: prefersReducedMotion ? 0 : duration,
        delay,
        ease: EASE_OUT_EXPO,
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
  amount?: number;
}

export function MotionStagger({
  children,
  staggerChildren = 0.08,
  delayChildren = 0.05,
  amount = 0.12,
  ...rest
}: MotionStaggerProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      data-fm-risen="true"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{
        hidden: { opacity: prefersReducedMotion ? 1 : 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: prefersReducedMotion ? 0 : staggerChildren,
            delayChildren: prefersReducedMotion ? 0 : delayChildren,
          },
        },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export const motionRiseItemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: EASE_OUT_EXPO,
    },
  },
};

export default function ScrollRiseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion) return;

    let batchQueue: HTMLElement[] = [];
    let batchTimer: number | null = null;

    const flushBatch = () => {
      const currentBatch = batchQueue.slice();
      batchQueue = [];
      batchTimer = null;

      currentBatch.forEach((el, index) => {
        if (el.dataset.fmRisen === "true") return;
        el.dataset.fmRisen = "true";

        const staggerDelay = Math.min(index * 0.055, 0.35);

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
    };

    const enqueueRise = (el: HTMLElement) => {
      if (el.dataset.fmRisen === "true") return;
      batchQueue.push(el);
      if (batchTimer === null) {
        batchTimer = window.requestAnimationFrame(flushBatch);
      }
    };

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            const target = entry.target as HTMLElement;
            intersectionObserver.unobserve(target);
            enqueueRise(target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -48px 0px",
        threshold: 0.08,
      }
    );

    const registerElements = (root: ParentNode = document) => {
      const candidates = root.querySelectorAll<HTMLElement>(TARGET_SELECTOR);
      candidates.forEach((el) => {
        if (shouldSkipElement(el)) return;

        el.dataset.fmObserved = "true";
        el.style.opacity = "0";
        el.style.transform = "translateY(28px)";
        el.style.willChange = "opacity, transform";

        const rect = el.getBoundingClientRect();
        const inInitialViewport =
          rect.top < window.innerHeight * 0.94 && rect.bottom > 0;

        if (inInitialViewport) {
          enqueueRise(el);
        } else {
          intersectionObserver.observe(el);
        }
      });
    };

    registerElements(document);

    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches(TARGET_SELECTOR) && !shouldSkipElement(node)) {
              registerElements(node.parentElement ?? document);
            } else {
              registerElements(node);
            }
          }
        });
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      if (batchTimer !== null) {
        window.cancelAnimationFrame(batchTimer);
      }
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname, prefersReducedMotion]);

  return <>{children}</>;
}
