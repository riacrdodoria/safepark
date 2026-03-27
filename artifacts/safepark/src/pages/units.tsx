import { AppLayout } from "@/components/layout/app-layout";
import { Building2, Server, Video, AlertTriangle } from "lucide-react";

export default function UnitsPage() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl text-foreground font-display">Gestão de Unidades</h1>
          <p className="text-sm text-muted-foreground">Visão geral dos sites monitorados</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Unidade Centro", cameras: 24, uptime: "98.5%", alerts: 12, status: "ok" },
            { name: "Unidade Shopping", cameras: 42, uptime: "99.9%", alerts: 3, status: "ok" },
            { name: "Unidade Norte", cameras: 18, uptime: "91.2%", alerts: 8, status: "warning" },
          ].map((unit, i) => (
            <div key={i} className={`glass-panel p-6 rounded-xl tech-border border-t-4 ${unit.status === 'warning' ? 'border-t-warning' : 'border-t-primary'}`}>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-muted rounded-lg border border-border">
                    <Building2 className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg">{unit.name}</h3>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2"><Video className="w-4 h-4" /> Câmeras</span>
                  <span className="font-mono font-medium">{unit.cameras} ativas</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2"><Server className="w-4 h-4" /> Uptime IA</span>
                  <span className={`font-mono font-medium ${unit.status === 'warning' ? 'text-warning' : 'text-success'}`}>{unit.uptime}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Alertas Hoje</span>
                  <span className="font-mono font-medium">{unit.alerts} críticos</span>
                </div>
              </div>

              <button className="w-full mt-6 py-2 bg-card border border-border rounded-lg text-sm hover:bg-muted transition-colors">
                Gerenciar Unidade
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
