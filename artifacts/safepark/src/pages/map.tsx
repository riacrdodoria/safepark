import { AppLayout } from "@/components/layout/app-layout";

export default function MapPage() {
  return (
    <AppLayout>
      <div className="h-full flex flex-col space-y-4">
        <div>
          <h1 className="text-2xl text-foreground font-display">Mapa do Pátio</h1>
          <p className="text-sm text-muted-foreground">Visão esquemática e posições das câmeras</p>
        </div>
        
        <div className="flex-1 glass-panel border border-border rounded-xl tech-border relative overflow-hidden flex items-center justify-center bg-[#020617]">
          {/* Using abstract image to simulate map */}
          <img 
            src={`${import.meta.env.BASE_URL}images/parking-bg.png`}
            alt="Parking Map"
            className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen"
          />
          
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
          
          {/* Fake camera nodes */}
          <div className="absolute top-[30%] left-[20%] group">
            <div className="w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse" />
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-card border border-border text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Pátio Norte A1</div>
            {/* Fake cone of vision */}
            <div className="absolute top-2 left-2 w-32 h-32 bg-primary/10 border-t border-r border-primary/30 origin-top-left rotate-45 rounded-tr-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }} />
          </div>

          <div className="absolute top-[60%] right-[30%] group">
            <div className="w-4 h-4 bg-warning rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-card border border-border text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Corredor Leste C1</div>
            <div className="absolute top-2 right-2 w-40 h-40 bg-warning/10 border-t border-l border-warning/30 origin-top-right -rotate-45 rounded-tl-full" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
          </div>

          <div className="absolute bottom-6 right-6 bg-card border border-border p-4 rounded-xl shadow-xl">
            <h4 className="font-display text-sm mb-3">Legenda</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary" /> Câmera Ativa</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-warning" /> Alerta Detectado</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-destructive" /> Câmera Offline</div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
