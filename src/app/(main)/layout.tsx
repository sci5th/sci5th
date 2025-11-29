"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon } from "@heroicons/react/24/solid";

function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className="flex h-10 w-full items-center justify-end bg-slate-700 px-4 text-sm text-white md:h-20 md:px-8 md:text-lg">
      <Link
        href="/"
        className={`mr-6 transition-opacity ${isHome ? "pointer-events-none opacity-50" : "opacity-100 hover:opacity-80"}`}
      >
        <HomeIcon className="h-6 w-6 text-slate-950 md:h-8 md:w-8" />
      </Link>
    </nav>
  );
}

function Logo() {
  return (
    <div className="flex w-full items-center justify-center bg-slate-600 p-2 md:p-4 lg:p-6">
      <Image
        src="/sci5th_Logo_Black.svg"
        alt="sci5th Logo Black"
        className="mx-2 w-16 md:mx-4 md:w-24 lg:w-32"
        width={128}
        height={128}
        unoptimized
      />
      <h1 className="whitespace-nowrap px-1 text-xl text-slate-950 md:px-2 md:text-3xl lg:text-4xl">
        sci5th
      </h1>
      <Image
        src="/sci5th_Logo_Blue.svg"
        alt="sci5th Logo Blue"
        className="mx-2 w-16 md:mx-4 md:w-24 lg:w-32"
        width={128}
        height={128}
        unoptimized
      />
    </div>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-auto flex h-10 w-full items-center justify-center bg-slate-800 p-4 text-white md:h-20">
      <p className="text-sm text-slate-500 md:text-base">
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
  const isGamePage = pathname.startsWith("/games/");

  // Game pages use their own layout
  if (isGamePage) {
    return <div className="flex min-h-screen flex-col">{children}</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <Logo />
      <main className="flex grow flex-col bg-slate-700">{children}</main>
      <Footer />
    </div>
  );
}
