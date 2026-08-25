"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutIcon,
  GitBranchIcon,
  GearIcon,
  GithubLogoIcon,
} from "@phosphor-icons/react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  DASHBOARD_NAV_ITEMS,
  DashboardRoute,
} from "@/features/dashboard/lib/routes";

// type DashboardRoute =
//   | "/dashboard"
//   | "/dashboard/repositories"
//   | "/dashboard/github"
//   | "/dashboard/settings";

// const DASHBOARD_NAV_ITEMS = [
//   { title: "Overview", href: "/dashboard", icon: "layout-dashboard" },
//   {title: "Repositories", href: "/dashboard/repositories", icon: "folder-git-2",},
//   { title: "GitHub", href: "/dashboard/github", icon: "github" },
//   { title: "Settings", href: "/dashboard/settings", icon: "settings" },
// ] as const satisfies ReadonlyArray<{
//   title: string;
//   href: DashboardRoute;
//   icon: keyof typeof NAV_ICONS;
// }>;

const NAV_ICONS = {
  "layout-dashboard": LayoutIcon ,
  "folder-git-2": GitBranchIcon,
  github: GithubLogoIcon,
  settings: GearIcon,
} as const;

function isNavActive(pathname: string, href: DashboardRoute) {
  if (href === "/dashboard") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspace</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {DASHBOARD_NAV_ITEMS.map((item) => {
            const Icon = NAV_ICONS[item.icon];
            const active = isNavActive(pathname, item.href);

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={active}
                  tooltip={item.title}
                  asChild
                >
                  <Link href={item.href}>
                    <Icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}