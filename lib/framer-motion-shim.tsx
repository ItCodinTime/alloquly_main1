"use client";

import React, { useEffect, useMemo, useState } from "react";

type Listener<T> = (value: T) => void;

class BasicMotionValue<T> {
  private value: T;
  private listeners = new Set<Listener<T>>();

  constructor(initial: T) {
    this.value = initial;
  }

  get() {
    return this.value;
  }

  set(next: T) {
    this.value = next;
    this.listeners.forEach((listener) => listener(next));
  }

  onChange(listener: Listener<T>) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export type MotionValue<T> = BasicMotionValue<T>;
export type Variants = Record<string, Record<string, unknown>>;

const isMotionValue = (value: unknown): value is MotionValue<unknown> => {
  return Boolean(value && typeof value === "object" && "onChange" in value && typeof (value as MotionValue<unknown>).onChange === "function");
};

const unwrapValue = (value: unknown) => {
  if (isMotionValue(value)) {
    return value.get();
  }
  return value;
};

const resolveStyle = (style: React.CSSProperties | undefined) => {
  if (!style) return style;
  const resolved: React.CSSProperties = {};
  let translateX: number | undefined;
  let translateY: number | undefined;

  Object.entries(style).forEach(([key, raw]) => {
    if (key === "x") {
      translateX = Number(unwrapValue(raw)) || 0;
      return;
    }
    if (key === "y") {
      translateY = Number(unwrapValue(raw)) || 0;
      return;
    }
    (resolved as Record<string, unknown>)[key] = unwrapValue(raw as unknown);
  });

  if (translateX !== undefined || translateY !== undefined) {
    const translate = `translate3d(${translateX ?? 0}px, ${translateY ?? 0}px, 0)`;
    resolved.transform = resolved.transform ? `${resolved.transform} ${translate}` : translate;
  }

  return resolved;
};

function collectMotionValues(style: React.CSSProperties | undefined) {
  if (!style) return [];
  return Object.values(style).filter(isMotionValue);
}

const motion = new Proxy(
  {},
  {
    get: (_target, tag: string) => {
      return React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(function MotionComponent(
        { style, ...rest },
        ref,
      ) {
        const motionValues = useMemo(() => collectMotionValues(style), [style]);
        const [, force] = useState(0);

        useEffect(() => {
          const unsubs = motionValues.map((mv) => mv.onChange(() => force((prev) => prev + 1)));
          return () => {
            unsubs.forEach((unsub) => unsub());
          };
        }, [motionValues]);

        const resolvedStyle = resolveStyle(style);
        return React.createElement(tag, { ref, style: resolvedStyle, ...rest });
      });
    },
  },
) as Record<string, React.ComponentType<any>>;

export { motion };

export function AnimatePresence({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useScroll() {
  const scrollY = useMemo(() => new BasicMotionValue(0), []);
  useEffect(() => {
    const handleScroll = () => scrollY.set(window.scrollY || 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollY]);
  return { scrollY, scrollYProgress: scrollY };
}

export function useTransform(value: MotionValue<number>, input: number[], output: number[]) {
  const target = useMemo(() => new BasicMotionValue(output[0] ?? 0), [output]);

  useEffect(() => {
    const unsub = value.onChange((current) => {
      const [inStart, inEnd] = input;
      const [outStart, outEnd] = output;
      if (inStart === undefined || inEnd === undefined || outStart === undefined || outEnd === undefined) {
        target.set(outStart ?? current);
        return;
      }
      const clamped = Math.min(Math.max(current, inStart), inEnd);
      const progress = inEnd - inStart === 0 ? 0 : (clamped - inStart) / (inEnd - inStart);
      const mapped = outStart + progress * (outEnd - outStart);
      target.set(mapped);
    });
    return () => unsub();
  }, [value, input, output, target]);

  return target;
}
