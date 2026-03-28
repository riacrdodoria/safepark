import { useState } from "react";
import { Link } from "wouter";
import {
  Shield, Eye, Zap, ArrowRight, Video, MapPin, Bell, Activity,
  Building2, Factory, GraduationCap, ShoppingBag, Truck, Landmark,
  CheckCircle2, XCircle, ChevronDown, ChevronUp, Brain, Settings, Users,
  TrendingUp, Star, Layers
} from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.1 } }),
};

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
      {children}
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-foreground hover:bg-muted/40 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span>{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-primary shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  const [formState, setFormState] = useState({
    nome: "", empresa: "", cargo: "", email: "", whatsapp: "",
    cidade: "", tipoOperacao: "", vagas: "", desafio: "", mensagem: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      {/* Amber top accent bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-primary z-50" />

      {/* ── NAVBAR ── */}
      <header className="fixed top-1 left-0 right-0 z-40 bg-[hsl(220,20%,18%)]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="SafePark" className="w-8 h-8 rounded object-cover" />
            <span className="text-xl font-display font-bold tracking-tight text-white">
              SAFE<span className="text-primary">PARK</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#solucao" className="hover:text-white transition-colors">A Solução</a>
            <a href="#segmentos" className="hover:text-white transition-colors">Segmentos</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block text-sm text-white/60 hover:text-white transition-colors font-medium">
              Entrar
            </Link>
            <a
              href="#contato"
              className="px-5 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-semibold transition-all shadow-sm"
            >
              Agendar demonstração
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-0 lg:pt-36 px-6 bg-[hsl(220,20%,14%)] overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-semibold mb-6 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Visão Computacional · Automação · IA
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-[1.1]">
              Transforme seu pátio em uma operação{" "}
              <span className="text-primary">mais segura, autônoma e escalável</span>
            </h1>
            <p className="text-lg text-white/55 mb-10 max-w-2xl mx-auto leading-relaxed">
              O Safe Park combina visão computacional, automação operacional e atendimento com IA para modernizar
              estacionamentos, reduzir falhas, antecipar riscos e elevar a experiência do usuário.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <a
                href="#contato"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/30 hover:bg-primary/90 hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                Agendar demonstração <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#contato"
                className="px-8 py-4 bg-white/8 text-white border border-white/20 rounded-xl font-semibold hover:bg-white/12 transition-all"
              >
                Falar com especialista
              </a>
            </div>
            <p className="text-xs text-white/35 tracking-wide">
              Ideal para estacionamentos comerciais, operações corporativas, universidades, indústrias, shopping centers e centros logísticos.
            </p>
          </motion.div>

          {/* App screenshot */}
          <motion.div
            className="relative mx-auto max-w-5xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-b from-primary/20 to-transparent rounded-t-2xl blur-sm" />
            <div className="relative rounded-t-2xl overflow-hidden border border-white/10 border-b-0 shadow-2xl shadow-black/50">
              <div className="flex items-center gap-2 px-4 py-3 bg-[hsl(220,20%,10%)] border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-white/20" />
                </div>
                <div className="flex-1 text-center text-xs text-white/30 font-mono">safepark.app/cameras</div>
              </div>
              <img
                src="/images/app-screenshot.png"
                alt="SafePark — Monitoramento Multi-Câmera com detecção por IA"
                className="w-full block"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── DOR DO MERCADO ── */}
      <section className="py-24 px-6 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <SectionLabel>O problema</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6 leading-tight">
                Seu pátio ainda depende demais de operação manual?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A maioria dos estacionamentos ainda opera com baixa visibilidade, alto esforço humano e pouca
                inteligência sobre o que realmente acontece no pátio.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Isso gera uma combinação perigosa — e o usuário final espera agilidade, clareza e segurança.
              </p>
              <p className="text-foreground font-semibold">
                Safe Park foi criado para fechar essa lacuna.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 gap-3"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            >
              {[
                "Falhas de acesso não detectadas",
                "Atendimento inconsistente ao usuário",
                "Baixa rastreabilidade de ocorrências",
                "Vulnerabilidade operacional crescente",
                "Dificuldade para escalar com padrão",
                "Risco elevado de incidentes e perdas",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-destructive/5 border border-destructive/15">
                  <XCircle className="w-5 h-5 text-destructive shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── O QUE É O SAFE PARK ── */}
      <section id="solucao" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionLabel>A Solução</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Uma plataforma de operação inteligente para estacionamentos
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              O Safe Park é uma solução SaaS que integra, em uma única camada tecnológica, os principais componentes
              de uma operação de estacionamento moderna.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Eye,
                number: "01",
                title: "Visão computacional para segurança preditiva",
                desc: "Transforme câmeras em sensores inteligentes capazes de identificar comportamentos anômalos, riscos operacionais e eventos suspeitos em tempo real.",
              },
              {
                icon: Settings,
                number: "02",
                title: "Automação operacional em nuvem",
                desc: "Digitalize rotinas críticas do pátio, organize o fluxo e ganhe mais controle sobre acesso, operação e monitoramento.",
              },
              {
                icon: Brain,
                number: "03",
                title: "Atendimento com IA",
                desc: "Automatize interações com clientes, reduza dependência operacional e aumente a velocidade de resposta em demandas recorrentes.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="relative bg-card border border-border p-8 rounded-2xl hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all group overflow-hidden"
              >
                <div className="absolute top-5 right-5 text-5xl font-display font-black text-primary/8 select-none">
                  {item.number}
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-display font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFÍCIOS ── */}
      <section className="py-24 px-6 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionLabel>Benefícios</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Mais do que automação: inteligência operacional aplicada ao mundo real
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Shield,
                title: "Mais segurança",
                desc: "Amplie a capacidade de vigilância e resposta. Antecipe riscos em vez de apenas reagir a eles.",
                color: "text-primary",
                bg: "bg-primary/10 border-primary/20",
              },
              {
                icon: Zap,
                title: "Mais eficiência",
                desc: "Reduza gargalos, retrabalho e dependência de processos manuais com uma operação mais padronizada e previsível.",
                color: "text-amber-500",
                bg: "bg-amber-500/10 border-amber-500/20",
              },
              {
                icon: Users,
                title: "Melhor experiência",
                desc: "Menos atrito, mais autonomia e uma jornada mais fluida do início ao fim para o usuário.",
                color: "text-sky-500",
                bg: "bg-sky-500/10 border-sky-500/20",
              },
              {
                icon: TrendingUp,
                title: "Mais escala",
                desc: "Centralize gestão, mantenha padrão operacional e cresça para múltiplos pátios com muito mais controle.",
                color: "text-emerald-500",
                bg: "bg-emerald-500/10 border-emerald-500/20",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.5}
                className="bg-background border border-border rounded-2xl p-6 hover:shadow-md transition-all"
              >
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-5 ${card.bg}`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <h3 className="font-display font-bold text-foreground mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POSICIONAMENTO PREMIUM ── */}
      <section className="py-28 px-6 bg-[hsl(220,20%,14%)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{backgroundImage: "radial-gradient(circle at 70% 50%, hsl(38,96%,48%,0.12) 0%, transparent 60%)"}} />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionLabel>Visão de produto</SectionLabel>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
              O estacionamento do futuro não é apenas automatizado.{" "}
              <span className="text-primary">É inteligente, preditivo e conectado.</span>
            </h2>
            <p className="text-white/55 max-w-2xl mx-auto leading-relaxed mb-12 text-lg">
              O Safe Park foi desenhado para se tornar a camada inteligente da operação de estacionamento —
              conectando atendimento, fluxo, monitoramento e segurança em um único ecossistema.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                "Menos pontos cegos",
                "Mais leitura de contexto",
                "Mais capacidade de decisão",
                "Mais confiança para escalar",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-white/80 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SEGMENTOS ── */}
      <section id="segmentos" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionLabel>Para quem é</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Projetado para operações que precisam de controle real
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Building2, title: "Estacionamentos comerciais", desc: "Ganhe eficiência, reduza falhas e melhore a experiência do cliente." },
              { icon: Factory, title: "Empresas e indústrias", desc: "Monitore áreas sensíveis com mais inteligência e autonomia operacional." },
              { icon: GraduationCap, title: "Universidades e instituições", desc: "Aumente segurança, controle de acesso e rastreabilidade." },
              { icon: ShoppingBag, title: "Shopping centers", desc: "Suporte uma operação de alto fluxo com mais previsibilidade e menos atrito." },
              { icon: Truck, title: "Centros logísticos", desc: "Tenha mais visibilidade sobre circulação, comportamento e áreas críticas." },
              { icon: Landmark, title: "Órgãos públicos e concessões", desc: "Modernize a infraestrutura com tecnologia escalável e orientada a dados." },
            ].map((seg, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.3}
                className="flex items-start gap-4 p-6 bg-card border border-border rounded-2xl hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <seg.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground mb-1">{seg.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{seg.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIFERENCIAIS ── */}
      <section className="py-24 px-6 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionLabel>Diferenciais</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Por que o Safe Park é diferente
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                num: "01",
                title: "Segurança no centro da proposta",
                desc: "Enquanto muitas soluções focam apenas em fluxo e cobrança, o Safe Park nasce com foco também em segurança operacional e vigilância inteligente.",
              },
              {
                num: "02",
                title: "Plataforma unificada",
                desc: "Atendimento, automação e visão computacional trabalhando juntos — não como ferramentas isoladas.",
              },
              {
                num: "03",
                title: "Estrutura SaaS escalável",
                desc: "Arquitetura pensada para onboarding remoto, expansão multiunidade e crescimento com baixo atrito.",
              },
              {
                num: "04",
                title: "Construído para a realidade brasileira",
                desc: "Desenhado para um contexto em que segurança, resiliência e operação prática importam tanto quanto eficiência.",
              },
              {
                num: "05",
                title: "Pronto para evolução contínua",
                desc: "Quanto mais a operação amadurece, mais o sistema pode se tornar um centro de inteligência do negócio.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.2}
                className="flex items-start gap-6 p-6 bg-background border border-border rounded-2xl hover:border-primary/30 transition-all"
              >
                <span className="text-3xl font-display font-black text-primary/25 shrink-0 w-12">{item.num}</span>
                <div>
                  <h3 className="font-display font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANTES E DEPOIS ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionLabel>Transformação</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Do caos operacional à gestão inteligente
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="bg-destructive/5 border border-destructive/20 rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="w-6 h-6 text-destructive" />
                <h3 className="font-display font-bold text-foreground text-lg">Antes</h3>
              </div>
              <div className="space-y-3">
                {[
                  "Baixa visibilidade do pátio",
                  "Dependência intensa de ação humana",
                  "Resposta lenta a ocorrências",
                  "Falhas operacionais recorrentes",
                  "Dificuldade para escalar com padrão",
                  "Atendimento fragmentado",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive/60 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
              className="bg-primary/5 border border-primary/20 rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                <h3 className="font-display font-bold text-foreground text-lg">Depois com Safe Park</h3>
              </div>
              <div className="space-y-3">
                {[
                  "Operação monitorada com mais inteligência",
                  "Mais automação e menos fricção",
                  "Capacidade preditiva sobre eventos críticos",
                  "Atendimento mais rápido e organizado",
                  "Gestão centralizada",
                  "Base tecnológica pronta para crescer",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-foreground font-medium">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section id="como-funciona" className="py-24 px-6 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionLabel>Implementação</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Implementação simples. Impacto estrutural.
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-10 left-[calc(12.5%+1.5rem)] right-[calc(12.5%+1.5rem)] h-px bg-border" />
            {[
              { step: "01", icon: Activity, title: "Diagnóstico da operação", desc: "Entendemos o contexto do pátio, fluxo, estrutura atual e principais riscos." },
              { step: "02", icon: Settings, title: "Configuração da solução", desc: "Adaptamos a implantação à realidade da operação e às prioridades do cliente." },
              { step: "03", icon: Zap, title: "Ativação da camada inteligente", desc: "Conectamos automação, monitoramento e atendimento para iniciar a transformação." },
              { step: "04", icon: TrendingUp, title: "Evolução contínua", desc: "Acompanhamos performance, refinamos regras e expandimos conforme a operação cresce." },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.3}
                className="text-center relative"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-5 relative z-10 bg-card">
                  <s.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-4xl font-display font-black text-primary/15 mb-2">{s.step}</div>
                <h4 className="font-display font-bold text-foreground mb-2">{s.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CREDIBILIDADE ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="bg-[hsl(220,20%,14%)] rounded-3xl p-12 relative overflow-hidden text-center border border-white/10"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-3xl" />
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
            <Layers className="w-10 h-10 text-primary mx-auto mb-6" />
            <SectionLabel>Credibilidade</SectionLabel>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-5">
              Tecnologia aplicada, validada e pronta para escalar
            </h2>
            <p className="text-white/55 max-w-2xl mx-auto leading-relaxed mb-3">
              O Safe Park nasce da evolução prática de uma solução desenvolvida para modernizar operações de
              estacionamento com automação, IA e segurança inteligente.
            </p>
            <p className="text-white/45 max-w-2xl mx-auto leading-relaxed text-sm">
              A proposta foi concebida para transformar o pátio em uma operação mais eficiente, resiliente e
              preparada para expansão, com visão de produto SaaS escalável e aderente ao contexto de cidades inteligentes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CTA FORTE ── */}
      <section className="py-24 px-6 bg-primary/5 border-y border-primary/15">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Star className="w-10 h-10 text-primary mx-auto mb-5" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Veja como o Safe Park pode transformar sua operação
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
              Agende uma conversa com nosso time e descubra como aplicar inteligência operacional ao seu pátio de estacionamento.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#contato"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                Agendar demonstração <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#contato"
                className="px-8 py-4 bg-card text-foreground border border-border rounded-xl font-semibold hover:border-primary/40 transition-all"
              >
                Solicitar proposta
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FORMULÁRIO ── */}
      <section id="contato" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionLabel>Contato</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Fale com o time Safe Park
            </h2>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-primary/5 border border-primary/30 rounded-2xl p-12 text-center"
            >
              <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-display font-bold text-foreground mb-2">Mensagem enviada!</h3>
              <p className="text-muted-foreground">Em breve nosso time entrará em contato para entender sua operação.</p>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="bg-card border border-border rounded-2xl p-8 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  { key: "nome", label: "Nome*", placeholder: "Seu nome completo" },
                  { key: "empresa", label: "Empresa*", placeholder: "Nome da empresa" },
                  { key: "cargo", label: "Cargo", placeholder: "Seu cargo" },
                  { key: "email", label: "E-mail*", placeholder: "seu@email.com" },
                  { key: "whatsapp", label: "WhatsApp", placeholder: "(11) 99999-9999" },
                  { key: "cidade", label: "Cidade / Estado", placeholder: "São Paulo, SP" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
                    <input
                      type="text"
                      placeholder={placeholder}
                      value={(formState as any)[key]}
                      onChange={(e) => setFormState({ ...formState, [key]: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Tipo de operação</label>
                  <select
                    value={formState.tipoOperacao}
                    onChange={(e) => setFormState({ ...formState, tipoOperacao: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                  >
                    <option value="">Selecione...</option>
                    <option>Estacionamento comercial</option>
                    <option>Empresa / Indústria</option>
                    <option>Universidade / Instituição</option>
                    <option>Shopping center</option>
                    <option>Centro logístico</option>
                    <option>Órgão público / Concessão</option>
                    <option>Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Número de vagas</label>
                  <select
                    value={formState.vagas}
                    onChange={(e) => setFormState({ ...formState, vagas: e.target.value })}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                  >
                    <option value="">Selecione...</option>
                    <option>Menos de 50 vagas</option>
                    <option>50 a 200 vagas</option>
                    <option>200 a 500 vagas</option>
                    <option>Mais de 500 vagas</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Desafio principal hoje</label>
                <input
                  type="text"
                  placeholder="Ex: Baixa visibilidade, muitos incidentes, dificuldade para escalar..."
                  value={formState.desafio}
                  onChange={(e) => setFormState({ ...formState, desafio: e.target.value })}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Mensagem</label>
                <textarea
                  rows={4}
                  placeholder="Conte mais sobre sua operação e o que você espera da solução..."
                  value={formState.mensagem}
                  onChange={(e) => setFormState({ ...formState, mensagem: e.target.value })}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors resize-none"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-base shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
                >
                  Quero conhecer o Safe Park
                </button>
                <p className="text-center text-xs text-muted-foreground mt-3 leading-relaxed">
                  Sem compromisso. Vamos entender sua operação e mostrar onde a tecnologia pode gerar mais impacto.
                </p>
              </div>
            </motion.form>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-6 bg-card border-t border-border">
        <div className="max-w-3xl mx-auto">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">Perguntas frequentes</h2>
          </motion.div>
          <div className="space-y-3">
            <FAQItem
              q="O Safe Park serve apenas para estacionamentos comerciais?"
              a="Não. A solução pode ser aplicada também em operações corporativas, industriais, universitárias, logísticas e públicas."
            />
            <FAQItem
              q="O produto foca mais em operação ou em segurança?"
              a="Nos dois. O diferencial está justamente em integrar automação operacional com segurança preditiva — não como módulos separados, mas como uma camada única."
            />
            <FAQItem
              q="É possível implantar em mais de um pátio?"
              a="Sim. A lógica da solução é SaaS e escalável, pensada para replicação e expansão com gestão centralizada."
            />
            <FAQItem
              q="O sistema pode evoluir com a operação?"
              a="Sim. O Safe Park foi concebido como plataforma modular, permitindo expansão e refinamento contínuo conforme a maturidade operacional cresce."
            />
            <FAQItem
              q="Preciso trocar minhas câmeras existentes?"
              a="Não necessariamente. O Safe Park é compatível com câmeras IP via protocolos RTSP/ONVIF, podendo integrar com infraestrutura já existente."
            />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/images/logo.png" alt="SafePark" className="w-7 h-7 rounded object-cover" />
            <span className="font-display font-bold text-foreground">
              SAFE<span className="text-primary">PARK</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Safe Park. Segurança inteligente para estacionamentos.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#solucao" className="hover:text-foreground transition-colors">A Solução</a>
            <a href="#contato" className="hover:text-foreground transition-colors">Contato</a>
            <Link href="/login" className="hover:text-foreground transition-colors">Plataforma</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
