"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Bot,
  Search,
  FileText,
  BookOpen,
  Image,
  Settings,
  TrendingUp,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
  name: "Trends Lab",
  href: "/trends",
  icon: TrendingUp,
},
  {
    name: "AI Studio",
    href: "/ai",
    icon: Bot,
  },
  {
    name: "Research",
    href: "/research",
    icon: Search,
  },
  {
  name: "Script Studio",
  href: "/script",
  icon: FileText,
}
 ,
  {
    name: "Prompt Vault",
    href: "/prompts",
    icon: BookOpen,
  },
  {
    name: "Thumbnail Lab",
    href: "/thumbnail",
    icon: Image,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950 p-6">
      <h1 className="mb-8 text-2xl font-bold text-white">
        AI Creator OS
      </h1>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                active
                  ? "bg-emerald-600 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}