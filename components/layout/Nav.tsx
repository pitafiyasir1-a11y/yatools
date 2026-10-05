"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const LINKS = [
  { label: "Tools", href: "/#tools" },
  { label: "Guides", href: "/#use-cases" },
  { label: "Developers", href: "/developers" },
  { label: "اردو", href: "/ur" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 no-underline" aria-label="YATools home">
      <span
        className="font-display inline-flex h-10 w-10 items-center justify-center rounded-xl text-2xl text-white"
        style={{
          background: "var(--red)",
          border: "2.5px solid var(--ink)",
          boxShadow: "3px 3px 0 var(--ink)",
          transform: "rotate(-4deg)",
          lineHeight: 1,
          paddingTop: "2px",
        }}
      >
        Y
      </span>
      <span className="font-display text-3xl" style={{ color: "var(--text)", lineHeight: 1, paddingTop: "4px" }}>
        YATools
      </span>
    </Link>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{ background: "var(--surface)", borderBottom: "3px solid var(--ink)" }}
    >
      <nav className="wrap flex h-16 items-center justify-between gap-4" aria-label="Primary">
        <Logo />

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href + l.label}
              href={l.href}
              className="text-sm font-bold no-underline transition-transform hover:-translate-y-px"
              style={{ color: "var(--text)" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link href="/#tools" className="neu-btn neu-btn-primary neu-btn-sm no-underline">
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
            className="neu-btn neu-btn-sm"
            style={{ padding: "9px 11px" }}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </nav>

      {open && (
        <div
          className="md:hidden"
          style={{ background: "var(--surface)", borderTop: "2.5px solid var(--ink)" }}
        >
          <div className="wrap flex flex-col gap-1 py-4">
            {LINKS.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-bold no-underline"
                style={{ color: "var(--text)" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/#tools"
              onClick={() => setOpen(false)}
              className="neu-btn neu-btn-primary mt-2 no-underline"
            >
              Explore Tools
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
