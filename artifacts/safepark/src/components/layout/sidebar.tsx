import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Video, 
  AlertTriangle, 
  Map, 
  UserSearch, 
  GitMerge, 
  ShieldAlert, 
  Building2, 
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Video, label: "Câmeras", href: "/cameras" },
  { icon: AlertTriangle, label: "Eventos", href: "/events" },
  { icon: Map, label: "Mapa", href: "/map" },
  { icon: UserSearch, label: "Rastreamento", href: "/tracking" },
  { icon: GitMerge, label: "Continuidade", href: "/continuity" },
  { icon: ShieldAlert, label: "Regras", href: "/rules" },
  { icon: Building2, label: "Unidades", href: "/units" },
  { icon: Settings, label: "Configurações", href: "/settings" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 flex-shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xl">
            SP
          </div>
          <span className="font-display font-bold text-xl tracking-wider text-sidebar-foreground">
            SAFE<span className="text-primary">PARK</span>
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.href || location.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href} className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              isActive 
                ? "bg-primary/10 text-primary border border-primary/20" 
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            )}>
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <Link href="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-all">
          <LogOut className="w-5 h-5" />
          Sair
        </Link>
      </div>
    </div>
  );
}
