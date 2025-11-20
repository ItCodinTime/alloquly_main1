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

const isMotionValue = (value: unknown): value is MotionValue<unknown> =>
  Boolean(value && typeof value === "object" && "onChange" in value && typeof (value as MotionValue<unknown>).onChange === "function");

const unwrapStyleValue = (value: unknown) => (isMotionValue(value) ? value.get() : value);

type MotionStyle = React.CSSProperties & {
  x?: number | MotionValue<number>;
  y?: number | MotionValue<number>;
};

const resolveStyle = (style?: MotionStyle) => {
  if (!style) return style;
  const next: React.CSSProperties = {};
  let translateX: number | undefined;
  let translateY: number | undefined;

  Object.entries(style).forEach(([key, raw]) => {
    if (key === "x") {
      translateX = Number(unwrapStyleValue(raw)) || 0;
      return;
    }
    if (key === "y") {
      translateY = Number(unwrapStyleValue(raw)) || 0;
      return;
    }
    (next as Record<string, unknown>)[key] = unwrapStyleValue(raw);
  });

  if (translateX !== undefined || translateY !== undefined) {
    const translate = `translate3d(${translateX ?? 0}px, ${translateY ?? 0}px, 0)`;
    next.transform = next.transform ? `${next.transform} ${translate}` : translate;
  }

  return next;
};

type MotionComponentProps = React.HTMLAttributes<HTMLElement> & {
  type?: string;
  style?: MotionStyle;
  animate?: Record<string, unknown>;
  initial?: Record<string, unknown>;
  transition?: Record<string, unknown>;
  whileHover?: Record<string, unknown>;
  whileTap?: Record<string, unknown>;
  variants?: Variants;
};

const motion = new Proxy<Record<string, React.FC<MotionComponentProps>>>(
  {},
  {
    get: (_target, tag: string) => {
      const MotionComponent: React.FC<MotionComponentProps> = ({ style, ...rest }) => {
        const motionValues = useMemo(() => {
          if (!style) return [];
          return Object.values(style).filter(isMotionValue);
        }, [style]);

        const [, forceTick] = useState(0);
        useEffect(() => {
          const unsubs = motionValues.map((mv) => mv.onChange(() => forceTick((prev) => prev + 1)));
          return () => unsubs.forEach((unsub) => unsub());
        }, [motionValues]);

        const resolvedStyle = resolveStyle(style);
        return React.createElement(tag, { style: resolvedStyle, ...rest });
      };
      return MotionComponent;
    },
  },
) as Record<string, React.FC<MotionComponentProps>>;

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
