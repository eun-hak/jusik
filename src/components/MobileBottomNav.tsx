"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, FileText, Search } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "홈", href: "/" },
  { label: "최신글", href: "/articles" },
  { label: "검색", href: "/search" },
];

const navIcons = [
  <Home key="home" size={22} />,
  <FileText key="articles" size={22} />,
  <Search key="search" size={22} />,
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isActive = (href: string) => {
    if (!mounted || pathname == null) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex items-center justify-around py-3 pb-5">
        {navItems.map((item, idx) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 w-14 ${
                active ? "text-black" : "text-gray-500"
              }`}
            >
              <span className={active ? "text-black" : "text-gray-500"}>
                {navIcons[idx]}
              </span>
              <span className="font-body text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
