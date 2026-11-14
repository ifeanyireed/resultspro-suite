"use client";

import React, { useEffect, useRef } from "react";
import { animate, motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { usePathname } from "next/navigation";

const RISE_SELECTOR = [
  "section",
  "article",
  "footer",
  ".card",
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

const SKIP_SELECTOR = [
  "nav",
  "aside",
  "[data-no-rise]",
  "script",
  "style",
  "svg",
  "canvas",
  "input",
  "textarea",
  "select",
  "[role='dialog']",
  "[data-radix-popper-content-wrapper]",
].join(", ");

function shouldSkipElement(el: HTMLElement): boolean {
  if (el.dataset.fmRisen === "true" || el.dataset.fmObserved === "true") {
    return true;
  }
  if (el.matches(SKIP_SELECTOR) || el.closest(SKIP_SELECTOR)) {
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
  delayChildren = 0.04,
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
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return (
          <motion.div
            data-fm-risen="true"
            variants={{
              hidden: { opacity: 0, y: 28 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
          >
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export function ScrollRiseProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion || typeof window === "undefined") {
      return;
    }

    const container = rootRef.current ?? document.body;
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

          const staggerIndex = Math.min(batchCounter++, 8);
          const staggerDelay = staggerIndex * 0.055;

          if (batchResetTimer) clearTimeout(batchResetTimer);
          batchResetTimer = setTimeout(() => {
            batchCounter = 0;
          }, 120);

          animate(
            el,
            { opacity: [0, 1], y: [28, 0] },
            {
              duration: 0.65,
              delay: staggerDelay,
              ease: [0.22, 1, 0.36, 1],
            }
          ).then(() => {
            el.style.willChange = "auto";
          });
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -32px 0px",
      }
    );

    const registerTargets = (root: ParentNode) => {
      const candidates = root.querySelectorAll<HTMLElement>(RISE_SELECTOR);
      candidates.forEach((el) => {
        if (shouldSkipElement(el)) return;
        el.dataset.fmObserved = "true";
        el.style.opacity = "0";
        el.style.willChange = "opacity, transform";
        intersectionObserver.observe(el);
      });
    };

    registerTargets(container);

    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches(RISE_SELECTOR) && !shouldSkipElement(node)) {
              node.dataset.fmObserved = "true";
              node.style.opacity = "0";
              node.style.willChange = "opacity, transform";
              intersectionObserver.observe(node);
            }
            registerTargets(node);
          }
        });
      }
    });

    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
    });

    return () => {
      if (batchResetTimer) clearTimeout(batchResetTimer);
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname, prefersReducedMotion]);

  return <div ref={rootRef}>{children}</div>;
}

export default ScrollRiseProvider;
