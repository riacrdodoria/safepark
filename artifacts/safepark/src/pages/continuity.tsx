import { AppLayout } from "@/components/layout/app-layout";
import { GitMerge, MapPin, Video, ArrowRight } from "lucide-react";

export default function ContinuityPage() {
  return (
    <AppLayout>
      <div className="h-full flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl text-foreground font-display">Continuidade de Câmeras</h1>
          <p className="text-sm text-muted-foreground">Narrativa visual cross-camera</p>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 glass-panel border border-border rounded-xl p-0 flex flex-col tech-border">
            <div className="p-4 border-b border-border">
              <h3 className="font-medium">Cadeias de Rastreio Recentes</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className={`p-4 rounded-lg border cursor-pointer transition-all ${i===1 ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-muted'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-sm font-bold text-foreground">Seq-{4920+i}</span>
                    <span className="text-xs text-muted-foreground">Há {i*12} min</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
                    <MapPin className="w-3 h-3 text-primary" /> Entrada 01
                    <ArrowRight className="w-3 h-3" /> Pátio Norte
                    <ArrowRight className="w-3 h-3" /> Setor C1
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 glass-panel border border-border rounded-xl p-6 flex flex-col justify-center items-center relative overflow-hidden tech-border">
             <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
             
             {/* Abstract Node graph showing continuity */}
             <div className="relative z-10 flex flex-col items-center w-full max-w-2xl gap-8">
                <div className="p-4 bg-card border border-border rounded-xl flex items-center gap-4 w-full">
                  <div className="w-24 h-16 bg-black rounded border border-border flex items-center justify-center">
                     <Video className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Entrada 01</h4>
                    <p className="text-xs text-muted-foreground font-mono mt-1">14:22:10 • Confiança: 98%</p>
                  </div>
                </div>
                
                <div className="w-0.5 h-12 bg-primary/50 relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-4 text-xs font-mono text-primary bg-background px-2 py-1 rounded border border-primary/20">+45s</div>
                </div>

                <div className="p-4 bg-card border border-border rounded-xl flex items-center gap-4 w-full">
                  <div className="w-24 h-16 bg-black rounded border border-border flex items-center justify-center">
                     <Video className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Pátio Norte A1</h4>
                    <p className="text-xs text-muted-foreground font-mono mt-1">14:22:55 • Confiança: 95%</p>
                  </div>
                </div>

                <div className="w-0.5 h-12 bg-primary/50 relative">
                  <div className="absolute top-1/2 -translate-y-1/2 right-4 text-xs font-mono text-primary bg-background px-2 py-1 rounded border border-primary/20">+2m 10s</div>
                </div>

                <div className="p-4 bg-card border border-primary/50 ring-1 ring-primary/20 rounded-xl flex items-center gap-4 w-full shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                  <div className="w-24 h-16 bg-black rounded border border-border flex items-center justify-center">
                     <Video className="w-6 h-6 text-primary animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-primary">Setor C1 (Posição Atual)</h4>
                    <p className="text-xs text-muted-foreground font-mono mt-1">14:25:05 • Confiança: 91%</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
