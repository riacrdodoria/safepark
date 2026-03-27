import { Bell, Search, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-card border-b border-border shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg border border-border/50 text-sm">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="font-medium">Unidade Centro</span>
          <span className="text-muted-foreground ml-2">| São Paulo, SP</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Buscar câmeras, placas..." 
            className="bg-muted border border-border rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-64 transition-all"
          />
        </div>
        
        <button className="relative p-2 rounded-full hover:bg-muted transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-card"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold leading-none">Carlos Mendes</p>
            <p className="text-xs text-muted-foreground">Operador Sênior</p>
          </div>
          <Avatar className="border border-primary/20">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
            <AvatarFallback>CM</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
