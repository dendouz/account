"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Clock,
  ArrowUpDown,
  FileText,
  CheckSquare,
  Calculator,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { AuthContext, fetchProfile, getStoredToken, clearTokens } from "@/lib/auth";
import type { User } from "@studeo/shared";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
  { href: "/hours", icon: Clock, label: "Heures" },
  { href: "/transactions", icon: ArrowUpDown, label: "Revenus & dépenses" },
  { href: "/documents", icon: FileText, label: "Documents" },
  { href: "/obligations", icon: CheckSquare, label: "Obligations" },
  { href: "/simulator", icon: Calculator, label: "Simulateur" },
  { href: "/knowledge", icon: BookOpen, label: "Guide" },
  { href: "/settings", icon: Settings, label: "Paramètres" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      router.push("/auth/login");
      return;
    }
    fetchProfile(token)
      .then(setUser)
      .catch(() => {
        clearTokens();
        router.push("/auth/login");
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  const login = useCallback(async () => {}, []);
  const register = useCallback(async () => {}, []);
  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    router.push("/auth/login");
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 lg:transform-none lg:static",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          )}
        >
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="text-lg font-bold text-gray-900">Studeo</span>
            </Link>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary-50 text-primary-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <div className="flex items-center gap-3 mb-3 px-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-primary-600">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="truncate">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-gray-500 truncate">{user?.email}</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-600 transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <header className="h-16 bg-white border-b flex items-center px-6 lg:px-8 gap-4">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1" />
            <span className="text-sm text-gray-500 hidden sm:block">
              {user?.studentStatus === "JOBISTE" && "Étudiant jobiste"}
              {user?.studentStatus === "INDEPENDENT" && "Étudiant indépendant"}
              {user?.studentStatus === "ENTREPRENEUR" && "Étudiant entrepreneur"}
              {user?.studentStatus === "OTHER" && "Étudiant"}
              {" — "}
              {user?.region === "BRUSSELS" && "Bruxelles"}
              {user?.region === "WALLONIA" && "Wallonie"}
              {user?.region === "FLANDERS" && "Flandre"}
            </span>
          </header>
          <main className="p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AuthContext.Provider>
  );
}
