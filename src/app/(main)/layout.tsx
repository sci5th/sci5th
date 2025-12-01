"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon } from "@heroicons/react/24/solid";

function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className="flex h-8 w-full items-center justify-start bg-slate-700 px-3 text-xs text-white md:h-16 md:px-6 md:text-base">
      <Link
        href="/"
        className={`transition-all ${isHome ? "pointer-events-none opacity-60" : "opacity-100 hover:scale-110"}`}
      >
        <div className="relative">
          {/* Shadow layer */}
          <HomeIcon className="absolute left-0.5 top-0.5 h-5 w-5 text-slate-900/50 md:h-6 md:w-6" />
          {/* Main icon with gradient effect */}
          <HomeIcon 
            className="relative h-5 w-5 md:h-6 md:w-6" 
            style={{
              color: 'rgb(15, 23, 42)',
              filter: 'drop-shadow(1px 1px 0px rgba(255,255,255,0.3)) drop-shadow(-0.5px -0.5px 0px rgba(0,0,0,0.4))',
            }}
          />
        </div>
      </Link>
    </nav>
  );
}

function Logo() {
  return (
    <div className="flex w-full items-center justify-center bg-slate-600 p-1.5 md:p-3 lg:p-5">
      <Image
        src="/sci5th_Logo_Black.svg"
        alt="sci5th Logo Black"
        className="mx-1.5 w-12 md:mx-3 md:w-20 lg:w-24"
        width={96}
        height={96}
        unoptimized
      />
      <h1 className="whitespace-nowrap px-1 text-lg text-slate-950 md:px-1.5 md:text-2xl lg:text-3xl">
        sci5th
      </h1>
      <Image
        src="/sci5th_Logo_Blue.svg"
        alt="sci5th Logo Blue"
        className="mx-1.5 w-12 md:mx-3 md:w-20 lg:w-24"
        width={96}
        height={96}
        unoptimized
      />
    </div>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="mt-auto flex h-8 w-full items-center justify-center bg-slate-800 p-3 text-white md:h-16">
      <p className="text-xs text-slate-500 md:text-sm">
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
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <Logo />
      <main className="flex grow flex-col bg-slate-700">{children}</main>
      <Footer />
    </div>
  );
}
