"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  as?: "div" | "section" | "li" | "article" | "span" | "header";
  /** Delay in ms before the element animates in */
  delay?: number;
  children: React.ReactNode;
}

/**
 * Fades + un-blurs its children the first time they scroll into view.
 * Styling lives in globals.css under [data-reveal].
 */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  className,
  style,
  children,
  ...props
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.dataset.reveal = "visible";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-reveal="hidden"
      className={cn(className)}
      style={{ ...style, ["--reveal-delay" as string]: `${delay}ms` }}
      {...props}
    >
      {children}
    </Tag>
  );
}
