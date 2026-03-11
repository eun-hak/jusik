"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Search, User, Mail } from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: <Home size={22} />, label: "홈", href: "/" },
  { icon: <LayoutGrid size={22} />, label: "카테고리", href: "/category" },
  { icon: <Search size={22} />, label: "검색", href: "/search" },
  { icon: <User size={22} />, label: "소개", href: "/about" },
  { icon: <Mail size={22} />, label: "구독", href: "/newsletter" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex items-center justify-around py-3 pb-5">
        {navItems.map((item) => {
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
                {item.icon}
              </span>
              <span
                className={`font-body text-[10px] ${
                  active ? "font-semibold" : "font-normal"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
