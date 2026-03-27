import { Link } from "wouter";
import { Shield, Eye, Lock, Zap, ArrowRight, Video, MapPin, Bell, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      {/* Amber top accent bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-primary z-50" />

      {/* Header */}
      <header className="fixed top-1 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[hsl(220,20%,22%)] flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-display font-bold tracking-tight text-foreground">
              SAFE<span className="text-primary">PARK</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#solucao" className="hover:text-foreground transition-colors">A Solução</a>
            <a href="#recursos" className="hover:text-foreground transition-colors">Recursos</a>
            <a href="#tecnologia" className="hover:text-foreground transition-colors">Tecnologia IA</a>
          </nav>
          <Link
            href="/login"
            className="px-5 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-semibold transition-all shadow-sm"
          >
            Acesso Operacional
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 px-6 bg-[hsl(220,20%,22%)] overflow-hidden">
        {/* Amber corner accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl" />

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-semibold mb-6 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Inteligência Artificial Aplicada
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Veja muito além <br />
              <span className="text-primary">das suas câmeras.</span>
            </h1>
            <p className="text-lg text-white/60 mb-10 max-w-xl leading-relaxed">
              Transforme seu sistema de CFTV comum em um agente autônomo que prevê riscos,
              rastreia incidentes e protege seu estacionamento 24/7.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/30 hover:bg-primary/90 hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                Demonstração Ao Vivo <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#recursos"
                className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-semibold hover:bg-white/15 transition-all"
              >
                Saiba mais
              </a>
            </div>
          </motion.div>

          {/* Mockup stats panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:grid grid-cols-2 gap-4"
          >
            {[
              { icon: Activity, label: "Câmeras Online", value: "24/26", color: "text-primary" },
              { icon: Bell, label: "Alertas Hoje", value: "3 críticos", color: "text-destructive" },
              { icon: MapPin, label: "Ocupação", value: "73%", color: "text-primary" },
              { icon: Eye, label: "Eventos Analisados", value: "1.240", color: "text-info" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-primary/30 transition-colors"
              >
                <stat.icon className={`w-6 h-6 mb-3 ${stat.color}`} />
                <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="recursos" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              Recursos
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Automação de ponta a ponta
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Nossos algoritmos analisam comportamento e disparam alertas apenas quando necessário,
              reduzindo falsos positivos em até 90%.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Eye,
                title: "Detecção Comportamental",
                desc: "Identifica pessoas rondando veículos ou em áreas não autorizadas, analisando padrões de tempo e deslocamento.",
              },
              {
                icon: Video,
                title: "Continuidade de Câmeras",
                desc: "Rastreia indivíduos e veículos através de múltiplas câmeras, construindo uma narrativa visual contínua.",
              },
              {
                icon: Zap,
                title: "Alertas em Tempo Real",
                desc: "Notifica a central imediatamente ao detectar anomalias, com evidências em vídeo e trilha do evento.",
              },
              {
                icon: MapPin,
                title: "Inteligência Espacial",
                desc: "Entende o pátio como ambiente físico — setores, zonas, corredores e áreas restritas mapeadas.",
              },
              {
                icon: Shield,
                title: "Perfis de Sensibilidade",
                desc: "Configure o nível de alerta: conservador, balanceado ou agressivo, por câmera ou por zona.",
              },
              {
                icon: Lock,
                title: "Conformidade e Evidências",
                desc: "Cada evento registrado com timestamp, snapshots, log de operador e exportação para ocorrências.",
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="bg-card border border-border p-7 rounded-2xl hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                  <feat.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-display font-bold text-foreground mb-2">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="solucao" className="py-24 px-6 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
              Como funciona
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Do sinal da câmera ao alerta operacional
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Câmeras IP conectadas", desc: "RTSP/ONVIF de qualquer fabricante." },
              { step: "02", title: "Análise por IA", desc: "Detecção de pessoas, veículos e comportamentos." },
              { step: "03", title: "Correlação multi-câmera", desc: "Trilha contínua entre todos os pontos do pátio." },
              { step: "04", title: "Alerta para operador", desc: "Evidência + contexto + sugestão de ação." },
            ].map((s, i) => (
              <div key={i} className="relative">
                <div className="text-4xl font-display font-bold text-primary/20 mb-3">{s.step}</div>
                <div className="w-10 h-1 bg-primary rounded mb-4" />
                <h4 className="font-display font-bold text-foreground mb-2">{s.title}</h4>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-24 px-6 text-center mt-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[hsl(220,20%,22%)] rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-3xl" />
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            <Shield className="w-10 h-10 text-primary mx-auto mb-5" />
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Pronto para modernizar sua operação?
            </h2>
            <p className="text-white/60 mb-8 max-w-lg mx-auto text-sm leading-relaxed">
              Converse com nosso time e descubra como o Safe Park pode transformar a segurança do seu estacionamento.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold transition-all shadow-lg shadow-primary/30"
            >
              Acessar o Painel <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 max-w-7xl mx-auto text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-display font-bold text-foreground">SAFE<span className="text-primary">PARK</span></span>
          </div>
          <p>© 2026 Safe Park. Monitoramento inteligente para estacionamentos.</p>
        </div>
      </footer>
    </div>
  );
}
