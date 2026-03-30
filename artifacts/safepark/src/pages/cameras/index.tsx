import { AppLayout } from "@/components/layout/app-layout";
import { LiveCameraOverlay } from "@/components/live-camera-overlay";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCameras } from "@/hooks/use-cameras";
import { useToggleVision, useTrackingLive } from "@/hooks/use-tracking-live";
import { StatusBadge } from "@/components/ui/status-badge";
import { Switch } from "@/components/ui/switch";
import { LayoutGrid, Grid3X3, Maximize, Plus, Settings2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function CamerasPage() {
  const { data: cameras, isLoading } = useCameras();
  const { data: liveTracking } = useTrackingLive();
  const toggleVision = useToggleVision();
  const [gridMode, setGridMode] = useState<'2x2' | '3x3'>('3x3');
  const activeCameras = cameras?.filter((camera) => camera.previewUrl).slice(0, 4) ?? [];
  const [expandedCameraId, setExpandedCameraId] = useState<string | null>(null);
  const expandedCamera = activeCameras.find((camera) => camera.id === expandedCameraId) ?? null;

  return (
    <AppLayout>
      <div className="flex flex-col h-full space-y-4">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl text-foreground font-display">Monitoramento Multi-câmera</h1>
            <p className="text-sm text-muted-foreground">Monitorando {activeCameras.length} feeds ativos em tempo real</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex bg-muted p-1 rounded-lg border border-border">
              <button 
                onClick={() => setGridMode('2x2')}
                className={`p-1.5 rounded-md transition-colors ${gridMode === '2x2' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setGridMode('3x3')}
                className={`p-1.5 rounded-md transition-colors ${gridMode === '3x3' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
            <Link href="/cameras/add" className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" /> Nova Câmera
            </Link>
          </div>
        </div>

        <div className={`flex-1 grid gap-4 overflow-y-auto pb-4 ${gridMode === '2x2' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl animate-pulse h-64" />
            ))
          ) : activeCameras.map((cam) => (
            <div key={cam.id} className="glass-panel rounded-xl border border-border overflow-hidden flex flex-col group relative">
              {/* Simulated Video Feed */}
              <div className="relative flex-1 bg-black min-h-[200px] overflow-hidden">
                {cam.status === 'online' ? (
                  <>
                    <LiveCameraOverlay
                      camera={cam}
                      liveTracking={liveTracking?.controls?.[cam.id]?.enabled ?? true ? liveTracking : undefined}
                      className="w-full h-full min-h-[200px]"
                    />
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full flex-col text-muted-foreground">
                    <AlertTriangle className="w-8 h-8 mb-2 opacity-50" />
                    <span className="font-mono text-sm uppercase">Sinal Perdido</span>
                  </div>
                )}
                
                {/* Hover overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button
                    onClick={() => setExpandedCameraId(cam.id)}
                    className="p-3 bg-primary text-primary-foreground rounded-full hover:scale-110 transition-transform"
                  >
                    <Maximize className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-card text-foreground border border-border rounded-full hover:scale-110 transition-transform">
                    <Settings2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Camera Info Bar */}
              <div className="p-3 bg-card border-t border-border flex justify-between items-center z-10 relative">
                <div>
                  <h4 className="font-medium text-sm font-display">{cam.name}</h4>
                  <p className="text-[11px] text-muted-foreground">{cam.type} • {cam.unit}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                      IA
                    </span>
                    <Switch
                      checked={liveTracking?.controls?.[cam.id]?.enabled ?? true}
                      disabled={toggleVision.isPending}
                      onCheckedChange={(checked) => toggleVision.mutate({ cameraId: cam.id, enabled: checked })}
                      aria-label={`Ativar visão computacional em ${cam.name}`}
                    />
                  </div>
                  <StatusBadge status={cam.status} variant="dot" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={Boolean(expandedCamera)} onOpenChange={(open) => setExpandedCameraId(open ? expandedCameraId : null)}>
        <DialogContent className="max-w-6xl border-border bg-card/95 backdrop-blur-xl">
          {expandedCamera ? (
            <>
              <DialogHeader>
                <DialogTitle>{expandedCamera.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="rounded-xl overflow-hidden border border-border bg-black">
                  <LiveCameraOverlay
                    camera={expandedCamera}
                    liveTracking={liveTracking?.controls?.[expandedCamera.id]?.enabled ?? true ? liveTracking : undefined}
                    className="w-full aspect-video"
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{expandedCamera.type} • {expandedCamera.unit}</span>
                  <div className="flex items-center gap-3">
                    <span>{liveTracking?.controls?.[expandedCamera.id]?.enabled ?? true ? "Overlay de IA em tempo real para pessoas e veículos" : "Preview limpo sem visão computacional"}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                        IA
                      </span>
                      <Switch
                        checked={liveTracking?.controls?.[expandedCamera.id]?.enabled ?? true}
                        disabled={toggleVision.isPending}
                        onCheckedChange={(checked) => toggleVision.mutate({ cameraId: expandedCamera.id, enabled: checked })}
                        aria-label={`Ativar visão computacional em ${expandedCamera.name}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
