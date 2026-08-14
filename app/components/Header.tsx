"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { href: "/shows", label: "Tour" },
  { href: "/gallery", label: "Gallery" },
  { href: "/music", label: "Discography" },
  { href: "/about", label: "About" },
] as const;

export default function Header({ bandName }: { bandName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="text-lg font-bold tracking-tight text-foreground"
        >
          {bandName}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition-opacity ${
                isActive(item.href) ? "text-foreground" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="메뉴"
          aria-expanded={open}
          className="text-foreground md:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border bg-white/95 backdrop-blur-md md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-5 py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`py-3 text-base ${
                  isActive(item.href) ? "text-foreground" : "text-foreground/50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
