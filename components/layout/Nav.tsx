"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { label: "Tools", href: "/#tools" },
  { label: "Guides", href: "/#use-cases" },
  { label: "Developers", href: "/developers" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 no-underline" aria-label="YATools home">
      <span
        aria-hidden="true"
        className="font-display inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-xl text-white"
        style={{ background: "var(--red)", lineHeight: 1 }}
      >
        Y
      </span>
      <span className="font-display text-[1.35rem]" style={{ color: "var(--text)", lineHeight: 1 }}>
        YATools
      </span>
    </Link>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{
        background: "color-mix(in srgb, var(--bg) 88%, transparent)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <nav className="wrap flex h-16 items-center justify-between gap-4" aria-label="Primary">
        <Logo />

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href + l.label}
              href={l.href}
              className="text-sm font-medium no-underline transition-colors"
              style={{ color: "var(--text2)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text2)")}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link href="/#tools" className="btn btn-primary btn-sm no-underline">
            Explore Tools
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="btn btn-sm btn-icon"
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden" style={{ borderTop: "1px solid var(--line)" }}>
          <div className="wrap flex flex-col gap-1 py-4">
            {LINKS.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium no-underline"
                style={{ color: "var(--text)" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/#tools"
              onClick={() => setOpen(false)}
              className="btn btn-primary mt-2 no-underline"
            >
              Explore Tools
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
