import { AppLayout } from "@/components/layout/app-layout";
import { useEvents } from "@/hooks/use-events";
import { StatusBadge } from "@/components/ui/status-badge";
import { Search, Filter, Calendar, ChevronRight } from "lucide-react";
import { Link } from "wouter";

export default function EventsPage() {
  const { data: events, isLoading } = useEvents();

  return (
    <AppLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl text-foreground font-display">Registro de Eventos</h1>
            <p className="text-sm text-muted-foreground">Histórico completo de detecções e alertas</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Buscar ID ou tipo..." 
                className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm hover:bg-muted transition-colors">
              <Filter className="w-4 h-4" /> Filtros
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm hover:bg-muted transition-colors">
              <Calendar className="w-4 h-4" /> Hoje
            </button>
          </div>
        </div>

        <div className="glass-panel border border-border rounded-xl overflow-hidden tech-border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-card/50 border-b border-border font-mono">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Evento / Câmera</th>
                  <th className="px-6 py-4">Severidade</th>
                  <th className="px-6 py-4">Data/Hora</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">Carregando eventos...</td></tr>
                ) : events?.map((event) => (
                  <tr key={event.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 font-mono text-muted-foreground">{event.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{event.type}</div>
                      <div className="text-xs text-muted-foreground mt-1">{event.camera} • {event.zone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={event.severity} />
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={event.status} variant="dot" />
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/events/${event.id}`} className="inline-flex items-center justify-center p-2 rounded hover:bg-primary/20 hover:text-primary transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
