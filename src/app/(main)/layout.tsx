import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { BRAND } from "@/config/brand";

// Server Component. `Navigation` is the only client island; Logo and
// Footer are static and need no client runtime.

function Logo() {
  return (
    <Link
      href="/"
      className="flex w-full items-center justify-center bg-ink-600 p-1.5 transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue md:p-3 lg:p-5"
    >
      <Image
        src={BRAND.logos.primary}
        alt={BRAND.logos.primaryAlt}
        className="mx-1.5 w-12 md:mx-3 md:w-20 lg:w-24"
        width={96}
        height={96}
        unoptimized
      />
      <h1 className="whitespace-nowrap px-1 font-sans text-lg text-ink-950 md:px-1.5 md:text-2xl lg:text-3xl">
        {BRAND.name}
      </h1>
      <Image
        src={BRAND.logos.accent}
        alt={BRAND.logos.accentAlt}
        className="mx-1.5 w-12 md:mx-3 md:w-20 lg:w-24"
        width={96}
        height={96}
        unoptimized
      />
    </Link>
  );
}

function Footer() {
  // Note: this is a Server Component, but the year is still computed at
  // build time — every page is statically exported, and a rebuild happens
  // when the site is redeployed. Acceptable for a copyright stamp.
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-auto flex w-full flex-col items-center justify-center gap-1 bg-ink-900 px-3 py-2 md:px-6 md:py-3">
      <p className="text-center text-[0.65rem] leading-snug text-text-300 md:text-xs">
        Content on this site is drafted with AI assistance and has not been
        independently fact-checked.{" "}
        <Link
          href="/about"
          className="underline decoration-text-700 underline-offset-2 transition-colors hover:text-text-100 focus-visible:text-text-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        >
          Learn more
        </Link>
        .
      </p>
      <p className="text-xs text-text-500 md:text-sm">
        &copy; {currentYear} {BRAND.name}
      </p>
    </footer>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-ink-700">
      <Navigation />
      <Logo />
      <main className="flex grow flex-col">{children}</main>
      <Footer />
    </div>
  );
}
