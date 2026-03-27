import { AppLayout } from "@/components/layout/app-layout";
import { Link } from "wouter";
import { ArrowLeft, Save } from "lucide-react";

export default function AddCameraPage() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cameras" className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl text-foreground font-display">Adicionar Câmera</h1>
            <p className="text-sm text-muted-foreground">Configure um novo feed de vídeo no sistema</p>
          </div>
        </div>

        <form className="glass-panel p-8 rounded-xl tech-border space-y-8" onSubmit={e => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome da Câmera</label>
              <input type="text" placeholder="Ex: Pátio Sul B2" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Unidade / Site</label>
              <select className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary appearance-none">
                <option>Unidade Centro</option>
                <option>Unidade Norte</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">URL do Stream (RTSP/ONVIF)</label>
              <input type="text" placeholder="rtsp://admin:pass@192.168.1.100:554/stream1" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary font-mono text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Câmera</label>
              <select className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary appearance-none">
                <option>Pátio Geral</option>
                <option>Entrada/Catraca</option>
                <option>Saída</option>
                <option>Corredor</option>
                <option>Área Restrita</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Zona do Mapa</label>
              <select className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary appearance-none">
                <option>Setor A</option>
                <option>Setor B</option>
                <option>Setor C</option>
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex justify-end gap-4">
            <Link href="/cameras" className="px-6 py-2.5 rounded-lg border border-border hover:bg-muted text-sm font-medium transition-colors">
              Cancelar
            </Link>
            <button type="submit" className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-primary/20">
              <Save className="w-4 h-4" /> Salvar Câmera
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
