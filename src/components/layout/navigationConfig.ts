import type { LucideIcon } from "lucide-react";
import {
  Bot,
  BookOpen,
  FileText,
  FolderKanban,
  Image,
  LayoutDashboard,
  Search,
  Settings,
  TrendingUp,
} from "lucide-react";

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

export const applicationNavigation: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Trends Lab", href: "/trends", icon: TrendingUp },
  { name: "AI Studio", href: "/ai", icon: Bot },
  { name: "Research", href: "/research", icon: Search, exact: true },
  { name: "Script Studio", href: "/script", icon: FileText, exact: true },
  { name: "Prompt Vault", href: "/prompts", icon: BookOpen },
  { name: "Thumbnail Lab", href: "/thumbnail", icon: Image },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function isNavigationItemActive(pathname: string, item: Pick<NavigationItem, "href" | "exact">) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
