"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Client-only because it consumes `usePathname()` to mark the active link.
// The rest of the shell (Logo, Footer, MainLayout) stays server-rendered.
export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/human-knowledge", label: "Human Knowledge" },
    { href: "/knowledge-gallery", label: "Knowledge Gallery" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="flex h-8 w-full items-center bg-ink-800 px-3 text-xs text-text-100 md:h-16 md:px-6 md:text-base">
      <div className="flex w-full justify-between md:ml-auto md:w-auto md:justify-end md:gap-6">
        {links.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "pointer-events-none font-medium text-brand-blue"
                  : "text-text-300 transition-colors hover:text-text-100 focus-visible:text-text-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
              }
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
