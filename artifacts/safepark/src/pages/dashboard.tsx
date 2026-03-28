import { AppLayout } from "@/components/layout/app-layout";
import { LiveCameraOverlay } from "@/components/live-camera-overlay";
import { Car, Activity, Video, Users, AlertOctagon } from "lucide-react";
import { useEvents } from "@/hooks/use-events";
import { useCameras } from "@/hooks/use-cameras";
import { useDashboard } from "@/hooks/use-dashboard";
import { useToggleVision, useTrackingLive } from "@/hooks/use-tracking-live";
import { StatusBadge } from "@/components/ui/status-badge";
import { Switch } from "@/components/ui/switch";
import { Link } from "wouter";
import { motion } from "framer-motion";

function KPI({ title, value, sub, icon: Icon, trend, colorClass = "text-primary" }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-5 rounded-xl tech-border"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-muted-foreground text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-display font-bold">{value}</h3>
          <p className="text-xs text-muted-foreground mt-2">{sub}</p>
        </div>
        <div className={`p-3 rounded-lg bg-card/50 ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { data: events } = useEvents();
  const { data: cameras } = useCameras();
  const { data: dashboard } = useDashboard();
  const { data: liveTracking } = useTrackingLive();
  const toggleVision = useToggleVision();

  const criticalEvents = events?.filter(e => e.severity === 'critical') || [];
  const onlineCameras = cameras?.filter(c => c.status === 'online') || [];
  const activeFeedCameras = cameras?.filter((camera) => camera.previewUrl).slice(0, 4) || [];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl text-foreground">Visão Operacional</h1>
          <div className="text-sm text-muted-foreground">
            Última atualização: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <KPI title="Veículos no Pátio" value={String(dashboard?.cars_in_lot ?? 247)} sub={`${Math.round((dashboard?.occupancy_rate ?? 0.73) * 100)}% de Ocupação`} icon={Car} />
          <KPI title="Eventos Críticos" value={criticalEvents.length.toString()} sub="Hoje" icon={AlertOctagon} colorClass="text-destructive" />
          <KPI title="Em Análise" value={String(events?.filter(e => e.status === 'Em Análise').length ?? 0)} sub="Aguardando Operador" icon={Activity} colorClass="text-warning" />
          <KPI title="Câmeras Online" value={`${onlineCameras.length}/${cameras?.length || 0}`} sub="92% Uptime" icon={Video} colorClass="text-success" />
          <KPI title="Pessoas s/ Origem" value={String(dashboard?.unknown_persons ?? 0)} sub="Rastreamento Ativo" icon={Users} colorClass="text-info" />
        </div>

        <div className="glass-panel p-5 rounded-xl tech-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-display">Matriz Ativa</h3>
              <p className="text-sm text-muted-foreground">Quatro feeds reais ativos no dashboard operacional.</p>
            </div>
            <Link href="/cameras" className="text-xs text-primary hover:underline">Abrir muro de câmeras</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeFeedCameras.map((camera) => (
              <div key={camera.id} className="rounded-xl overflow-hidden border border-border bg-card">
                <LiveCameraOverlay
                  camera={camera}
                  liveTracking={liveTracking?.controls?.[camera.id]?.enabled ?? true ? liveTracking : undefined}
                  className="w-full aspect-video"
                />
                <div className="p-3 flex items-center justify-between bg-card border-t border-border">
                  <div>
                    <h4 className="font-medium text-sm font-display">{camera.name}</h4>
                    <p className="text-[11px] text-muted-foreground">{camera.type} • {camera.unit}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                        IA
                      </span>
                      <Switch
                        checked={liveTracking?.controls?.[camera.id]?.enabled ?? true}
                        disabled={toggleVision.isPending}
                        onCheckedChange={(checked) => toggleVision.mutate({ cameraId: camera.id, enabled: checked })}
                        aria-label={`Ativar visão computacional em ${camera.name}`}
                      />
                    </div>
                    <StatusBadge status={camera.status} variant="dot" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-0 rounded-xl tech-border flex flex-col">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h3 className="text-lg font-display">Alertas Recentes</h3>
            <Link href="/events" className="text-xs text-primary hover:underline">Ver todos</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 p-2">
            {events?.slice(0, 6).map((event) => (
              <Link key={event.id} href={`/events/${event.id}`} className="block">
                <div className="p-3 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border transition-colors group cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <StatusBadge status={event.severity} variant="dot" />
                    <span className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{event.type}</h4>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Video className="w-3 h-3" /> {event.camera}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
