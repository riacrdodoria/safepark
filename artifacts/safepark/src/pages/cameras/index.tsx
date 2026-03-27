import { AppLayout } from "@/components/layout/app-layout";
import { useCameras } from "@/hooks/use-cameras";
import { StatusBadge } from "@/components/ui/status-badge";
import { LayoutGrid, Grid3X3, Maximize, Plus, Settings2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function CamerasPage() {
  const { data: cameras, isLoading } = useCameras();
  const [gridMode, setGridMode] = useState<'2x2' | '3x3'>('3x3');

  return (
    <AppLayout>
      <div className="flex flex-col h-full space-y-4">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl text-foreground font-display">Monitoramento Multi-câmera</h1>
            <p className="text-sm text-muted-foreground">Monitorando {cameras?.length || 0} feeds em tempo real</p>
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
          ) : cameras?.map((cam) => (
            <div key={cam.id} className="glass-panel rounded-xl border border-border overflow-hidden flex flex-col group relative">
              {/* Simulated Video Feed */}
              <div className="relative flex-1 bg-black min-h-[200px] overflow-hidden">
                {cam.status === 'online' ? (
                  <>
                    <img 
                      src={`https://images.unsplash.com/photo-1573060010996-9811cceba220?w=800&h=450&fit=crop&q=60&auto=format`} 
                      alt={cam.name}
                      className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
                    />
                    {/* Fake bounding box */}
                    {Math.random() > 0.5 && (
                      <div className="absolute top-1/4 left-1/3 w-32 h-24 border-2 border-primary bg-primary/10 transition-all duration-1000">
                        <span className="absolute -top-6 left-[-2px] bg-primary text-primary-foreground text-[10px] px-1 font-mono font-bold">VEÍCULO 94%</span>
                      </div>
                    )}
                    {/* Scan line effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent h-[10%] animate-scan opacity-50" />
                    
                    <div className="absolute top-3 left-3 flex gap-2">
                      <StatusBadge status="REC" variant="solid" className="bg-destructive text-white animate-pulse" />
                      <span className="px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-mono border border-white/10">{cam.fps} FPS</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full flex-col text-muted-foreground">
                    <AlertTriangle className="w-8 h-8 mb-2 opacity-50" />
                    <span className="font-mono text-sm uppercase">Sinal Perdido</span>
                  </div>
                )}
                
                {/* Hover overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button className="p-3 bg-primary text-primary-foreground rounded-full hover:scale-110 transition-transform">
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
                <StatusBadge status={cam.status} variant="dot" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
