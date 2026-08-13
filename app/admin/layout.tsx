"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  Image as ImageIcon,
  Music,
  Users,
  Settings,
  Home,
  LogOut,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const ADMIN_NAV = [
  { label: "대시보드", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "공연 관리", href: "/admin/shows", icon: Calendar },
  { label: "갤러리 관리", href: "/admin/gallery", icon: ImageIcon },
  { label: "음악 관리", href: "/admin/music", icon: Music },
  { label: "멤버 관리", href: "/admin/members", icon: Users },
  { label: "사이트 설정", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && pathname !== "/admin") {
        router.replace("/admin");
      } else {
        setAuthenticated(!!session);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && pathname !== "/admin") {
        router.replace("/admin");
      }
      setAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin");
  }

  if (pathname === "/admin") {
    return <>{children}</>;
  }

  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <aside className="hidden md:flex flex-col w-56 bg-gray-900 text-gray-200">
        <div className="px-5 py-5 border-b border-gray-700">
          <p className="text-sm font-bold text-white">교정 관리자</p>
        </div>
        <nav className="flex-1 py-4">
          {ADMIN_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                pathname.startsWith(item.href)
                  ? "bg-gray-800 text-white font-medium"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </a>
          ))}
        </nav>
        <div className="border-t border-gray-700 p-4 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
          >
            <Home size={14} />
            홈으로
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
          >
            <LogOut size={14} />
            로그아웃
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-2">
            <p className="text-sm font-bold">교정 관리자</p>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-gray-500">
                <Home size={16} />
              </Link>
              <button onClick={handleLogout} className="text-gray-500">
                <LogOut size={16} />
              </button>
            </div>
          </div>
          <div className="flex gap-1 px-2 pb-2 overflow-x-auto">
            {ADMIN_NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  pathname.startsWith(item.href)
                    ? "bg-primary text-white font-medium"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
