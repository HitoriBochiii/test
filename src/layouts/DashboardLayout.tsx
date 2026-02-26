import { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PackageMinus,
  FileText,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  ChevronDown,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth, AppRole } from "@/contexts/AuthContext";
import NotificationDropdown from "@/components/NotificationDropdown";
import ThemeToggle from "@/components/ThemeToggle";
import ErrorBoundary from "@/components/ErrorBoundary";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  variant?: "success" | "destructive";
  roles?: AppRole[]; // If undefined, accessible by all roles
}

const menuItems: MenuItem[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    description: "Ringkasan data",
  },
  {
    name: "Barang Masuk",
    path: "/incoming",
    icon: Package,
    description: "Kelola barang masuk",
    variant: "success",
  },
  {
    name: "Barang Keluar",
    path: "/outgoing",
    icon: PackageMinus,
    description: "Kelola barang keluar",
    variant: "destructive",
  },
  {
    name: "Laporan",
    path: "/reports",
    icon: FileText,
    description: "Unduh laporan",
  },
  {
    name: "Admin Panel",
    path: "/admin",
    icon: Shield,
    description: "Pengaturan admin",
    roles: ["admin"],
  },
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut, role, isAdmin } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  // Filter menu items based on user role
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      // If no roles specified, accessible by all
      if (!item.roles) return true;
      // If roles specified, check if user has required role
      return role && item.roles.includes(role);
    });
  }, [role]);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex items-center justify-center px-6 py-4 border-b border-sidebar-border">
          <img
            src="/public/PatraNiagaLogo.png"
            alt="Logo Pertamina Patra Niaga"
            className="h-12 w-auto object-contain"
          />
        </div>

        <nav className="p-4 space-y-1">
          <p className="px-4 py-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
            Menu Utama
          </p>
          {filteredMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${isActive(item.path) ? "active" : ""}`}
            >
              <item.icon
                className={`w-5 h-5 ${item.variant === "success" ? "text-green-400" : item.variant === "destructive" ? "text-red-400" : ""}`}
              />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-sidebar-accent/50">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {profile?.full_name || "Pengguna"}
              </p>
              <p className="text-xs text-sidebar-foreground/70">
                {isAdmin ? "Administrator" : profile?.division || "Staff"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:pl-64 min-h-screen">
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Sistem Monitoring Inventaris
                </h1>
                <p className="text-sm text-muted-foreground">
                  PT Pertamina Patra Niaga
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <NotificationDropdown />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="w-4 h-4 mr-2" />
                    Pengaturan
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <main className="p-6">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
