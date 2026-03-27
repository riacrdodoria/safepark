import { AppLayout } from "@/components/layout/app-layout";
import { useEvent, useUpdateEventStatus } from "@/hooks/use-events";
import { StatusBadge } from "@/components/ui/status-badge";
import { useRoute } from "wouter";
import { ArrowLeft, Clock, Video, ShieldAlert, CheckCircle2, XCircle, Share2, MapPin } from "lucide-react";
import { Link } from "wouter";

export default function EventDetailPage() {
  const [, params] = useRoute("/events/:id");
  const id = params?.id || "";
  const { data: event, isLoading } = useEvent(id);
  const updateStatus = useUpdateEventStatus();

  if (isLoading) return <AppLayout><div className="p-8 text-center text-muted-foreground">Carregando detalhes...</div></AppLayout>;
  if (!event) return <AppLayout><div className="p-8 text-center text-destructive">Evento não encontrado.</div></AppLayout>;

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/events" className="p-2 hover:bg-muted rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl text-foreground font-display">{event.type}</h1>
                <StatusBadge status={event.severity} variant="solid" />
              </div>
              <p className="text-sm font-mono text-muted-foreground">{event.id} • Gravado em {new Date(event.timestamp).toLocaleString('pt-BR')}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => updateStatus.mutate({ id: event.id, status: 'Falso Positivo' })}
              className="flex items-center gap-2 px-4 py-2 border border-border bg-card rounded-lg text-sm hover:bg-muted transition-colors text-muted-foreground"
            >
              <XCircle className="w-4 h-4" /> Descartar
            </button>
            <button 
              onClick={() => updateStatus.mutate({ id: event.id, status: 'Resolvido' })}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              <CheckCircle2 className="w-4 h-4" /> Marcar Resolvido
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Main Video Area */}
            <div className="glass-panel border border-border rounded-xl overflow-hidden tech-border aspect-video relative bg-black">
              {/* event photo urban empty parking */}
              <img src="https://pixabay.com/get/g1e67801ad07c370fd8d777688b1ec364b7af00af3ab9ad132a9eb36a33fe62a6bfadca673bb98f1138891480bde3ae908d56f38c0247d40935e40d36d0dc11f3_1280.jpg" className="w-full h-full object-cover opacity-70" alt="Evidência" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-32 h-64 border-2 border-destructive bg-destructive/10 animate-pulse rounded-sm relative">
                  <span className="absolute -top-6 left-0 bg-destructive text-destructive-foreground text-xs font-mono px-2 py-0.5">{event.entities[0]}</span>
                </div>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex justify-between items-end">
                <div className="flex gap-4">
                  <div className="text-white font-mono text-sm">{event.duration}</div>
                  <div className="text-white/70 text-sm flex items-center gap-1"><Video className="w-4 h-4"/> {event.camera}</div>
                </div>
                <button className="flex items-center gap-2 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded backdrop-blur transition-colors">
                  <Share2 className="w-4 h-4" /> Exportar Evidência
                </button>
              </div>
            </div>

            {/* Narrative */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-display mb-3 flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-primary" /> Análise do Sistema</h3>
              <p className="text-muted-foreground leading-relaxed">
                {event.description}
              </p>
              <div className="mt-6 pt-6 border-t border-border grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Confiança da IA</p>
                  <p className="text-lg font-mono text-primary">{event.confidence}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Localização</p>
                  <p className="text-sm font-medium flex items-center gap-1"><MapPin className="w-3 h-3 text-muted-foreground"/> {event.zone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status Atual</p>
                  <StatusBadge status={event.status} variant="dot" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-display text-lg mb-4">Linha do Tempo</h3>
              <div className="space-y-6">
                <div className="relative pl-6 border-l-2 border-border pb-6">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-primary"></div>
                  <p className="text-xs font-mono text-primary mb-1">00:00:00</p>
                  <p className="text-sm font-medium">Objeto detectado na câmera</p>
                  <p className="text-xs text-muted-foreground mt-1">{event.camera}</p>
                </div>
                <div className="relative pl-6 border-l-2 border-border pb-6">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-warning"></div>
                  <p className="text-xs font-mono text-warning mb-1">00:00:45</p>
                  <p className="text-sm font-medium">Comportamento anômalo identificado</p>
                  <p className="text-xs text-muted-foreground mt-1">Geração do alerta nível {event.severity}</p>
                </div>
                <div className="relative pl-6">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-border"></div>
                  <p className="text-xs font-mono text-muted-foreground mb-1">{event.duration}</p>
                  <p className="text-sm font-medium">Fim do rastreio / Objeto oculto</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-display text-lg mb-4">Entidades Envolvidas</h3>
              <div className="space-y-3">
                {event.entities.map(ent => (
                  <div key={ent} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                    <span className="text-sm font-mono">{ent}</span>
                    <Link href="/tracking" className="text-xs text-primary hover:underline">Rastrear</Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
