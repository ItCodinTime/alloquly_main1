"use client";

import React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

const createIcon = (paths: React.ReactNode) => {
  return function Icon(props: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        {...props}
      >
        {paths}
      </svg>
    );
  };
};

export const CheckCircle = createIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 12.5l2 2.5 4-5" />
  </>,
);

export const CheckCircle2 = CheckCircle;

export const Loader2 = createIcon(
  <>
    <circle cx="12" cy="12" r="9" opacity="0.25" />
    <path d="M12 3a9 9 0 019 9" />
  </>,
);

export const NotebookPen = createIcon(
  <>
    <rect x="6" y="4" width="10" height="16" rx="2" />
    <path d="M10 8h4M10 12h3" />
    <path d="M16 15l2 2 3-3-2-2z" />
    <path d="M18 17l-1 3 3-1z" />
  </>,
);

export const CalendarClock = createIcon(
  <>
    <rect x="3" y="5" width="16" height="14" rx="2" />
    <path d="M8 3v4M16 3v4M3 10h16" />
    <circle cx="15" cy="15" r="3" />
    <path d="M15 13.5v1.75L16.25 16" />
  </>,
);

export const Play = createIcon(<path d="M9 8l7 4-7 4z" />);

export const Book = createIcon(
  <>
    <path d="M4 5.5v13c0 .83.67 1.5 1.5 1.5H11" />
    <path d="M20 5.5v13c0 .83-.67 1.5-1.5 1.5H13" />
    <path d="M11 2.5v18" />
    <path d="M13 2.5v18" />
  </>,
);

export const GraduationCap = createIcon(
  <>
    <path d="M3 9l9-4 9 4-9 4-9-4z" />
    <path d="M21 12v5" />
    <path d="M3 12s0 4 9 4 9-4 9-4" />
  </>,
);

export const Headphones = createIcon(
  <>
    <path d="M4 14v4a2 2 0 002 2h1v-6H6a2 2 0 00-2 2z" />
    <path d="M20 14v4a2 2 0 01-2 2h-1v-6h1a2 2 0 012 2z" />
    <path d="M6 14V12a6 6 0 1112 0v2" />
  </>,
);

export const Timer = createIcon(
  <>
    <circle cx="12" cy="13" r="8" />
    <path d="M12 9v4l2 1" />
    <path d="M9 3h6" />
  </>,
);

export const ClipboardList = createIcon(
  <>
    <rect x="6" y="4" width="12" height="16" rx="2" />
    <path d="M9 4V2h6v2" />
    <path d="M9 9h.01M13 9h4M9 13h.01M13 13h4M9 17h.01M13 17h4" />
  </>,
);

export const Users = createIcon(
  <>
    <circle cx="9" cy="8" r="3" />
    <circle cx="17" cy="10" r="3" />
    <path d="M4 20c0-2.21 2.69-4 6-4s6 1.79 6 4" />
    <path d="M15 20v-.5c0-1.38 1.79-2.5 4-2.5" />
  </>,
);

export const Inbox = createIcon(
  <>
    <path d="M4 6h16l-2 10H6L4 6z" />
    <path d="M9 10l3 3 3-3" />
    <path d="M3 6l3-3h12l3 3" />
  </>,
);
