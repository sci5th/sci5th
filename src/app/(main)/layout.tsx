"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/human-knowledge", label: "Human Knowledge" },
    { href: "/knowledge-gallery", label: "Knowledge Gallery" },
  ];

  return (
    <nav className="flex h-8 w-full items-center bg-ink-800 px-3 text-xs text-text-100 md:h-16 md:px-6 md:text-base">
      <div className="ml-auto flex gap-4 md:gap-6">
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

function Logo({
  accentSrc,
  accentAlt,
}: {
  accentSrc: string;
  accentAlt: string;
}) {
  return (
    <Link
      href="/"
      className="flex w-full items-center justify-center bg-ink-600 p-1.5 transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue md:p-3 lg:p-5"
    >
      <Image
        src="/sci5th_Logo_Black.svg"
        alt="sci5th Logo Black"
        className="mx-1.5 w-12 md:mx-3 md:w-20 lg:w-24"
        width={96}
        height={96}
        unoptimized
      />
      <h1 className="whitespace-nowrap px-1 font-sans text-lg text-ink-950 md:px-1.5 md:text-2xl lg:text-3xl">
        sci5th
      </h1>
      <Image
        src={accentSrc}
        alt={accentAlt}
        className="mx-1.5 w-12 md:mx-3 md:w-20 lg:w-24"
        width={96}
        height={96}
        unoptimized
      />
    </Link>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-auto flex h-8 w-full items-center justify-center bg-ink-900 p-3 md:h-16">
      <p className="text-xs text-text-500 md:text-sm">
        &copy; {currentYear} sci5th
      </p>
    </footer>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Pink accent on the two knowledge surfaces (System + Gallery); Blue on Home.
  const onPinkRoute =
    pathname.startsWith("/human-knowledge") ||
    pathname.startsWith("/knowledge-gallery");
  const accentSrc = onPinkRoute
    ? "/sci5th_Logo_Pink.svg"
    : "/sci5th_Logo_Blue.svg";
  const accentAlt = onPinkRoute ? "sci5th Logo Pink" : "sci5th Logo Blue";

  return (
    <div className="flex min-h-screen flex-col bg-ink-700">
      <Navigation />
      <Logo accentSrc={accentSrc} accentAlt={accentAlt} />
      <main className="flex grow flex-col">{children}</main>
      <Footer />
    </div>
  );
}
