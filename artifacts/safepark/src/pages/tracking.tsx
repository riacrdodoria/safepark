import { AppLayout } from "@/components/layout/app-layout";
import { UserSearch, Car, MapPin, Activity } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";

const TRACKED_ENTITIES = [
  { id: 'Pessoa-984', type: 'person', status: 'Sem Origem Conhecida', lastSeen: 'Pátio Norte A2', timeActive: '18 min', risk: 'High' },
  { id: 'Veículo-ABC1234', type: 'vehicle', status: 'Circulação Anômala', lastSeen: 'Corredor Leste C1', timeActive: '08 min', risk: 'Medium' },
  { id: 'Pessoa-992', type: 'person', status: 'Vinculado', lastSeen: 'Saída 01', timeActive: '02 min', risk: 'Low', linkedTo: 'XYZ9876' },
];

export default function TrackingPage() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl text-foreground font-display">Rastreamento de Entidades</h1>
          <p className="text-sm text-muted-foreground">Monitoramento ativo de pessoas e veículos no perímetro</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRACKED_ENTITIES.map(entity => (
            <div key={entity.id} className="glass-panel rounded-xl border border-border overflow-hidden tech-border relative group hover:border-primary/50 transition-colors">
              <div className="h-2 w-full absolute top-0 left-0 bg-muted overflow-hidden">
                <div className={`h-full ${entity.risk === 'High' ? 'bg-destructive' : entity.risk === 'Medium' ? 'bg-warning' : 'bg-success'}`} style={{width: '100%'}}></div>
              </div>
              <div className="p-5 pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg border border-border">
                      {entity.type === 'person' ? <UserSearch className="w-5 h-5 text-primary" /> : <Car className="w-5 h-5 text-primary" />}
                    </div>
                    <div>
                      <h3 className="font-mono font-bold text-foreground">{entity.id}</h3>
                      <p className="text-xs text-muted-foreground capitalize">{entity.type}</p>
                    </div>
                  </div>
                  <StatusBadge status={entity.risk === 'High' ? 'Crítico' : 'Monitorando'} variant="solid" />
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium text-foreground">{entity.status}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Última Visto</span>
                    <span className="flex items-center gap-1 font-medium"><MapPin className="w-3 h-3"/> {entity.lastSeen}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Tempo Ativo</span>
                    <span className="flex items-center gap-1 font-mono">{entity.timeActive}</span>
                  </div>
                  {entity.linkedTo && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Veículo Associado</span>
                      <span className="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{entity.linkedTo}</span>
                    </div>
                  )}
                </div>

                <button className="w-full mt-5 py-2 rounded-lg border border-primary/50 text-primary font-medium hover:bg-primary/10 transition-colors text-sm flex items-center justify-center gap-2">
                  <Activity className="w-4 h-4" /> Histórico de Rota
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
