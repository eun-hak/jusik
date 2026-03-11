"use client";

import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "홈", href: "/" },
  { label: "분석", href: "/category/analysis" },
  { label: "종목", href: "/category/stocks" },
  { label: "투자노트", href: "/category/notes" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="bg-white w-full">
      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between py-6 px-5 lg:px-[120px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-heading text-[22px] font-semibold">주</span>
          </div>
          <span className="text-black font-body text-2xl font-medium">주식일기</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-body text-sm font-medium transition-colors ${
                isActive(item.href) ? "text-black" : "text-gray-600 hover:text-black"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Search Button */}
        <Link
          href="/search"
          className="flex items-center gap-2 bg-gray-100 rounded-md px-4 py-2.5 text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <Search size={16} />
          <span className="font-body text-[13px] font-medium">검색</span>
        </Link>
      </div>

      {/* Mobile Header */}
      <div className="flex md:hidden items-center justify-between py-4 px-5">
        {/* Mobile Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
            <span className="text-white font-heading text-lg font-semibold">주</span>
          </div>
          <span className="text-black font-body text-lg font-medium">주식일기</span>
        </Link>

        {/* Mobile Right Icons */}
        <div className="flex items-center gap-3">
          <Link href="/search" className="p-1">
            <Search size={20} className="text-black" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1"
            aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {mobileMenuOpen ? (
              <X size={20} className="text-black" />
            ) : (
              <Menu size={20} className="text-black" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-5 py-4">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-body text-base font-medium py-2 ${
                  isActive(item.href) ? "text-black" : "text-gray-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
