"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="hidden text-xl font-bold sm:inline-block">
              Pondok Pesantren K3 Arafah
            </span>
            <span className="inline-block text-xl font-bold sm:hidden">
              Pondok Arafah
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden gap-6 md:flex">
          <Link
            href="/"
            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Beranda
          </Link>
          <Link
            href="/#about"
            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Tentang Kami
          </Link>
          <Link
            href="/#berita"
            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Berita
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="default" size="sm">
            <Link href="/psb">Daftar PSB</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="border-b md:hidden bg-background">
          <div className="container flex flex-col gap-4 py-4 px-4">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              Beranda
            </Link>
            <Link
              href="/#about"
              className="text-sm font-medium transition-colors hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              Tentang Kami
            </Link>
            <Link
              href="/#berita"
              className="text-sm font-medium transition-colors hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              Berita
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
