"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { applicationNavigation, isNavigationItemActive } from "./navigationConfig";

interface Props {
  onNavigate?: () => void;
}

export default function Navigation({ onNavigate }: Props) {
  const pathname = usePathname();

  return (
    <nav className="space-y-1" aria-label="Application navigation">
      {applicationNavigation.map((item) => {
        const Icon = item.icon;
        const active = isNavigationItemActive(pathname, item);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${active
              ? "bg-emerald-600 text-white"
              : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
            }`}
          >
            <Icon size={18} aria-hidden="true" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
