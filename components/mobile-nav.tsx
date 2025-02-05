"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Package } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
  { href: "/dashboard/estimates", label: "Estimates", icon: FileText },
  { href: "/dashboard/products", label: "Products", icon: Package },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-gray-200">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 ${
              pathname === link.href ? "text-primary" : "text-gray-500"
            }`}
          >
            <link.icon className="w-5 h-5" />
            <span className="text-xs">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
