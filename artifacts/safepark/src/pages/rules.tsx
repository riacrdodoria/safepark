import { AppLayout } from "@/components/layout/app-layout";
import { Shield, Settings, AlertTriangle, Info } from "lucide-react";
import { useState } from "react";

export default function RulesPage() {
  const [profile, setProfile] = useState<'conservador' | 'balanceado' | 'agressivo'>('balanceado');

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl text-foreground font-display">Regras de Detecção</h1>
          <p className="text-sm text-muted-foreground">Ajuste os parâmetros de inteligência artificial</p>
        </div>

        <div className="glass-panel p-6 rounded-xl tech-border">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> Perfil de Sensibilidade Global
          </h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {(['conservador', 'balanceado', 'agressivo'] as const).map(p => (
              <button 
                key={p}
                onClick={() => setProfile(p)}
                className={`p-4 rounded-lg border text-left transition-all ${profile === p ? 'border-primary bg-primary/10 ring-1 ring-primary/50' : 'border-border bg-card hover:bg-muted'}`}
              >
                <h4 className="font-semibold capitalize text-foreground mb-1">{p}</h4>
                <p className="text-xs text-muted-foreground">
                  {p === 'conservador' && 'Menos alertas, prioriza certeza absoluta.'}
                  {p === 'balanceado' && 'Equilíbrio ideal entre segurança e ruído.'}
                  {p === 'agressivo' && 'Alerta a qualquer comportamento suspeito.'}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Regras Específicas</h3>
          
          {[
            { title: "Pessoa Sem Origem", desc: "Tempo máximo que alguém pode circular sem ter saído de um carro conhecido.", defaultVal: "15 min" },
            { title: "Permanência ao lado do veículo", desc: "Tempo máximo permitido antes de gerar alerta de anomalia.", defaultVal: "5 min" },
            { title: "Veículo em circulação repetida", desc: "Passagens pela mesma câmera sem estacionar.", defaultVal: "3 vezes" },
          ].map((rule, i) => (
            <div key={i} className="bg-card border border-border p-5 rounded-xl flex items-start justify-between">
              <div>
                <h4 className="font-medium text-foreground mb-1">{rule.title}</h4>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Info className="w-4 h-4" /> {rule.desc}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-mono bg-muted px-2 py-1 rounded">{rule.defaultVal}</span>
                <button className="p-2 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
