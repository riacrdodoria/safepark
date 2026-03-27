import { AppLayout } from "@/components/layout/app-layout";
import { Users, BellRing, Database, Paintbrush } from "lucide-react";

export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl text-foreground font-display">Configurações do Sistema</h1>
          <p className="text-sm text-muted-foreground">Gerencie preferências globais da plataforma</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2 md:col-span-1">
            <button className="w-full text-left px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium text-sm border border-primary/20">
              Geral
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg font-medium text-sm transition-colors">
              Usuários e Papéis
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg font-medium text-sm transition-colors">
              Notificações
            </button>
            <button className="w-full text-left px-4 py-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg font-medium text-sm transition-colors">
              Retenção de Dados
            </button>
          </div>
          
          <div className="md:col-span-3 glass-panel p-6 rounded-xl tech-border space-y-6">
            <h3 className="text-lg font-medium border-b border-border pb-4">Configurações Gerais</h3>
            
            <div className="space-y-4">
               <div>
                 <label className="text-sm font-medium mb-1 block">Nome da Empresa</label>
                 <input type="text" defaultValue="SafePark Estacionamentos" className="w-full max-w-md bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" />
               </div>
               
               <div>
                 <label className="text-sm font-medium mb-1 block">Fuso Horário</label>
                 <select className="w-full max-w-md bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary appearance-none">
                    <option>America/Sao_Paulo (BRT)</option>
                 </select>
               </div>

               <div className="pt-4 flex items-center justify-between border-t border-border">
                 <div>
                   <h4 className="text-sm font-medium text-foreground">Modo Escuro Forçado</h4>
                   <p className="text-xs text-muted-foreground">Recomendado para centros de operação</p>
                 </div>
                 <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                   <div className="absolute right-1 top-1 w-4 h-4 bg-background rounded-full"></div>
                 </div>
               </div>
            </div>

            <div className="pt-6">
              <button className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors shadow-lg shadow-primary/20">
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
