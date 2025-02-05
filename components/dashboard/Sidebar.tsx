"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/auth/actions";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Building2,
  Package,
  FileText,
  LogOut,
} from "lucide-react";
import { User as UserType } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SidebarProps {
  user: UserType;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Building2, label: "Business", href: "/dashboard/business" },
  { icon: Package, label: "Products", href: "/dashboard/products" },
  { icon: FileText, label: "Invoices", href: "/dashboard/invoices" },
];

export function Sidebar({ user }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col bg-white border-r border-gray-200 h-screen transition-all duration-300",
        expanded ? "w-64" : "w-20"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h1
          className={cn(
            "font-bold transition-all duration-300",
            expanded ? "text-xl" : "text-xs"
          )}
        >
          {expanded ? "nextInvoice" : "nI"}
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <span
                className={cn(
                  "flex items-center space-x-2 p-2 rounded-lg transition-all",
                  pathname === item.href
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  !expanded && "justify-center"
                )}
              >
                <Icon className="h-5 w-5" />
                {expanded && <span>{item.label}</span>}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <div
          className={cn(
            "flex items-center space-x-2 mb-4",
            !expanded && "justify-center"
          )}
        >
          <Avatar>
            <AvatarFallback>
              {user.name?.charAt(0) || user.email.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {expanded && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          className={cn(
            "w-full flex items-center space-x-2",
            !expanded && "justify-center"
          )}
          onClick={() => logout()}
        >
          <LogOut className="h-5 w-5" />
          {expanded && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}
