import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, Eye, Zap, ArrowRight, MapPin, Activity,
  Building2, Factory, GraduationCap, ShoppingBag, Truck, Landmark,
  CheckCircle2, XCircle, ChevronDown, ChevronUp, Brain, Settings, Users,
  TrendingUp, Star, Layers, Menu, X
} from "lucide-react";

const BASE = import.meta.env.BASE_URL;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1 },
  }),
};

function SectionLabel({ children }: { children: string }) {
  return (
    <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-semibold uppercase tracking-wider mb-4">
      {children}
    </span>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
      >
        <span>{q}</span>
        {open
          ? <ChevronUp className="w-5 h-5 text-amber-500 shrink-0" />
          : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-5 pt-4 text-gray-500 text-sm leading-relaxed border-t border-gray-100">
          {a}
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nome: "", empresa: "", cargo: "", email: "",
    whatsapp: "", cidade: "", tipoOperacao: "", vagas: "",
    desafio: "", mensagem: "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans overflow-x-hidden">

      {/* ── AMBER TOP BAR ── */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-amber-500 z-50" />

      {/* ── NAVBAR ── */}
      <header className="fixed top-1 left-0 right-0 z-40 bg-[#1c2333]/96 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={`${BASE}images/logo.png`} alt="SafePark" className="w-8 h-8 rounded object-cover" />
            <span className="text-xl font-display font-bold tracking-tight text-white">
              SAFE<span className="text-amber-400">PARK</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <a href="#solucao" className="hover:text-white transition-colors">A Solução</a>
            <a href="#segmentos" className="hover:text-white transition-colors">Segmentos</a>
            <a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a>
            <a href="#app-operador" className="hover:text-white transition-colors flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              App Operador
            </a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="#contato"
              className="hidden sm:block px-5 py-2 bg-amber-500 text-amber-950 hover:bg-amber-400 rounded-lg text-sm font-bold transition-all shadow-sm"
            >
              Agendar demonstração
            </a>
            <button
              className="md:hidden text-white/60 hover:text-white"
              onClick={() => setMobileMenu(!mobileMenu)}
            >
              {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className="md:hidden bg-[#1c2333] border-t border-white/10 px-6 py-4 space-y-4">
            {["#solucao", "#segmentos", "#como-funciona", "#faq", "#contato"].map((href, i) => (
              <a key={i} href={href} onClick={() => setMobileMenu(false)}
                className="block text-white/70 hover:text-white text-sm font-medium transition-colors capitalize">
                {href.replace("#", "").replace("-", " ")}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-0 lg:pt-36 px-6 bg-[#111827] overflow-hidden">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-2xl pointer-events-none"
          style={{ background: "rgba(245,158,11,0.04)" }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial="hidden" animate="visible" variants={fadeUp}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-6 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Visão Computacional · Automação · IA
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-[1.05]">
              Transforme seu pátio em uma operação{" "}
              <span className="text-amber-400">mais segura, autônoma e escalável</span>
            </h1>
            <p className="text-lg text-white/55 mb-10 max-w-2xl mx-auto leading-relaxed">
              O Safe Park combina visão computacional, automação operacional e atendimento com IA para modernizar
              estacionamentos, reduzir falhas, antecipar riscos e elevar a experiência do usuário.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <a
                href="#contato"
                className="px-8 py-4 bg-amber-500 text-amber-950 rounded-xl font-bold shadow-lg hover:bg-amber-400 hover:-translate-y-0.5 transition-all flex items-center gap-2"
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

          {/* App screenshot mockup */}
          <motion.div
            className="relative mx-auto max-w-5xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="absolute -inset-1 rounded-t-2xl blur-sm"
              style={{ background: "linear-gradient(to bottom, rgba(245,158,11,0.15), transparent)" }} />
            <div className="relative rounded-t-2xl overflow-hidden border border-white/10 border-b-0 shadow-2xl" style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}>
              <div className="flex items-center gap-2 px-4 py-3 bg-[#0d1117] border-b border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/15" />
                  <div className="w-3 h-3 rounded-full bg-white/15" />
                  <div className="w-3 h-3 rounded-full bg-white/15" />
                </div>
                <div className="flex-1 text-center text-xs text-white/25 font-mono">safepark.app/cameras</div>
              </div>
              <img
                src={`${BASE}images/app-screenshot.png`}
                alt="SafePark — Monitoramento Multi-Câmera com IA"
                className="w-full block"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── DOR DO MERCADO ── */}
      <section className="py-24 px-6 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <SectionLabel>O problema</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6 leading-tight">
                Seu pátio ainda depende demais de operação manual?
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                A maioria dos estacionamentos ainda opera com baixa visibilidade, alto esforço humano e pouca
                inteligência sobre o que realmente acontece no pátio.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                Isso gera uma combinação perigosa — e o usuário final espera agilidade, clareza e segurança.
              </p>
              <p className="text-gray-900 font-semibold">
                Safe Park foi criado para fechar essa lacuna.
              </p>
            </motion.div>

            <motion.div
              className="space-y-3"
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
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-red-50 border border-red-100">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── O QUE É O SAFE PARK ── */}
      <section id="solucao" className="py-24 px-6 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionLabel>A Solução</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Uma plataforma de operação inteligente para estacionamentos
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
              O Safe Park é uma solução SaaS que integra, em uma única camada tecnológica, os principais
              componentes de uma operação de estacionamento moderna.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Eye, num: "01",
                title: "Visão computacional para segurança preditiva",
                desc: "Transforme câmeras em sensores inteligentes capazes de identificar comportamentos anômalos, riscos operacionais e eventos suspeitos em tempo real.",
              },
              {
                icon: Settings, num: "02",
                title: "Automação operacional em nuvem",
                desc: "Digitalize rotinas críticas do pátio, organize o fluxo e ganhe mais controle sobre acesso, operação e monitoramento.",
              },
              {
                icon: Brain, num: "03",
                title: "Atendimento com IA",
                desc: "Automatize interações com clientes, reduza dependência operacional e aumente a velocidade de resposta em demandas recorrentes.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.3}
                className="relative bg-white border border-gray-200 p-8 rounded-2xl hover:border-amber-300 hover:shadow-lg transition-all group overflow-hidden"
              >
                <div className="absolute top-5 right-5 text-5xl font-display font-black text-amber-500/10 select-none">{item.num}</div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-6 group-hover:bg-amber-100 transition-colors">
                  <item.icon className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-lg font-display font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFÍCIOS ── */}
      <section className="py-24 px-6 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionLabel>Benefícios</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Mais do que automação: inteligência operacional aplicada ao mundo real
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Shield, title: "Mais segurança", desc: "Amplie a capacidade de vigilância e resposta. Antecipe riscos em vez de apenas reagir a eles.", iconBg: "bg-amber-50 border-amber-200", iconColor: "text-amber-500" },
              { icon: Zap, title: "Mais eficiência", desc: "Reduza gargalos, retrabalho e dependência de processos manuais com uma operação mais padronizada.", iconBg: "bg-orange-50 border-orange-200", iconColor: "text-orange-500" },
              { icon: Users, title: "Melhor experiência", desc: "Menos atrito, mais autonomia e uma jornada mais fluida do início ao fim para o usuário.", iconBg: "bg-sky-50 border-sky-200", iconColor: "text-sky-500" },
              { icon: TrendingUp, title: "Mais escala", desc: "Centralize gestão, mantenha padrão operacional e cresça para múltiplos pátios com mais controle.", iconBg: "bg-emerald-50 border-emerald-200", iconColor: "text-emerald-500" },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.2}
                className="bg-[#f8f9fa] border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-all"
              >
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-5 ${card.iconBg}`}>
                  <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                <h3 className="font-display font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POSICIONAMENTO PREMIUM ── */}
      <section className="py-28 px-6 bg-[#111827] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 70% 50%, rgba(245,158,11,0.07) 0%, transparent 65%)" }} />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionLabel>Visão de produto</SectionLabel>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
              O estacionamento do futuro não é apenas automatizado.{" "}
              <span className="text-amber-400">É inteligente, preditivo e conectado.</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto leading-relaxed mb-12 text-lg">
              O Safe Park foi desenhado para se tornar a camada inteligente da operação de estacionamento —
              conectando atendimento, fluxo, monitoramento e segurança em um único ecossistema.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {["Menos pontos cegos", "Mais leitura de contexto", "Mais capacidade de decisão", "Mais confiança para escalar"].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="text-white/80 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SEGMENTOS ── */}
      <section id="segmentos" className="py-24 px-6 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionLabel>Para quem é</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
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
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.2}
                className="flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-2xl hover:border-amber-300 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                  <seg.icon className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-gray-900 mb-1">{seg.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{seg.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIFERENCIAIS ── */}
      <section className="py-24 px-6 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionLabel>Diferenciais</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Por que o Safe Park é diferente
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              { num: "01", title: "Segurança no centro da proposta", desc: "Enquanto muitas soluções focam apenas em fluxo e cobrança, o Safe Park nasce com foco também em segurança operacional e vigilância inteligente." },
              { num: "02", title: "Plataforma unificada", desc: "Atendimento, automação e visão computacional trabalhando juntos — não como ferramentas isoladas." },
              { num: "03", title: "Estrutura SaaS escalável", desc: "Arquitetura pensada para onboarding remoto, expansão multiunidade e crescimento com baixo atrito." },
              { num: "04", title: "Construído para a realidade brasileira", desc: "Desenhado para um contexto em que segurança, resiliência e operação prática importam tanto quanto eficiência." },
              { num: "05", title: "Pronto para evolução contínua", desc: "Quanto mais a operação amadurece, mais o sistema pode se tornar um centro de inteligência do negócio." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.15}
                className="flex items-start gap-6 p-6 bg-[#f8f9fa] border border-gray-200 rounded-2xl hover:border-amber-300 transition-all"
              >
                <span className="text-3xl font-display font-black text-amber-400/40 shrink-0 w-12">{item.num}</span>
                <div>
                  <h3 className="font-display font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANTES E DEPOIS ── */}
      <section className="py-24 px-6 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionLabel>Transformação</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Do caos operacional à gestão inteligente
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="bg-red-50 border border-red-100 rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="w-6 h-6 text-red-400" />
                <h3 className="font-display font-bold text-gray-900 text-lg">Antes</h3>
              </div>
              {["Baixa visibilidade do pátio", "Dependência intensa de ação humana", "Resposta lenta a ocorrências", "Falhas operacionais recorrentes", "Dificuldade para escalar com padrão", "Atendimento fragmentado"].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-300 shrink-0" />
                  {item}
                </div>
              ))}
            </motion.div>

            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
              className="bg-amber-50 border border-amber-200 rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-6 h-6 text-amber-500" />
                <h3 className="font-display font-bold text-gray-900 text-lg">Depois com Safe Park</h3>
              </div>
              {["Operação monitorada com mais inteligência", "Mais automação e menos fricção", "Capacidade preditiva sobre eventos críticos", "Atendimento mais rápido e organizado", "Gestão centralizada", "Base tecnológica pronta para crescer"].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-800 font-medium mb-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  {item}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section id="como-funciona" className="py-24 px-6 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionLabel>Implementação</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Implementação simples. Impacto estrutural.
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", icon: Activity, title: "Diagnóstico da operação", desc: "Entendemos o contexto do pátio, fluxo, estrutura atual e principais riscos." },
              { step: "02", icon: Settings, title: "Configuração da solução", desc: "Adaptamos a implantação à realidade da operação e às prioridades do cliente." },
              { step: "03", icon: Zap, title: "Ativação da camada inteligente", desc: "Conectamos automação, monitoramento e atendimento para iniciar a transformação." },
              { step: "04", icon: TrendingUp, title: "Evolução contínua", desc: "Acompanhamos performance, refinamos regras e expandimos conforme a operação cresce." },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.2}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center mx-auto mb-5">
                  <s.icon className="w-7 h-7 text-amber-500" />
                </div>
                <div className="text-4xl font-display font-black text-amber-400/20 mb-2">{s.step}</div>
                <h4 className="font-display font-bold text-gray-900 mb-2">{s.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APP OPERADOR MOCKUP ── */}
      <section id="app-operador" className="py-28 px-6 bg-[#111827] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 80% 50%, rgba(245,158,11,0.07) 0%, transparent 60%)" }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(circle at 15% 80%, rgba(245,158,11,0.04) 0%, transparent 50%)" }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* TEXT SIDE */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-6 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                SafePark Operador · App Mobile
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                Alerta em tempo real{" "}
                <span className="text-amber-400">na palma do operador</span>
              </h2>
              <p className="text-white/55 text-lg leading-relaxed mb-8">
                O SafePark Operador é o app exclusivo para a equipe de campo. Quando a IA detecta um comportamento
                suspeito, o operador recebe o alerta instantaneamente — com a imagem da câmera, descrição do evento
                e opção de confirmar ou descartar com um toque.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  { icon: Eye, label: "Detecção em tempo real", desc: "Alertas gerados por visão computacional chegam em segundos, com imagem e contexto." },
                  { icon: Zap, label: "Resposta com um toque", desc: "Confirmar ocorrência ou descartar falso alarme — sem fricção, sem demora." },
                  { icon: Shield, label: "Histórico e rastreabilidade", desc: "Todo evento respondido fica registrado com operador, horário e decisão tomada." },
                  { icon: Activity, label: "Status das câmeras ao vivo", desc: "Visualize quais câmeras estão online e o volume de eventos por período." },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.15}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
                      <item.icon className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-white/90 font-semibold text-sm mb-0.5">{item.label}</p>
                      <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <img src={`${BASE}images/logo.png`} alt="SafePark" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                <div>
                  <p className="text-white/80 text-sm font-semibold">App exclusivo para operadores cadastrados</p>
                  <p className="text-white/35 text-xs">Disponível para iOS e Android via Expo Go</p>
                </div>
              </div>
            </motion.div>

            {/* PHONE MOCKUP SIDE */}
            <motion.div
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="relative">
                {/* Ambient glow */}
                <div className="absolute inset-0 scale-110 rounded-[40px] blur-3xl pointer-events-none"
                  style={{ background: "radial-gradient(ellipse, rgba(245,158,11,0.12) 0%, transparent 70%)" }} />

                {/* Floating badges */}
                <motion.div
                  className="absolute -left-14 top-16 bg-[#1c2333] border border-red-500/30 rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg z-20"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
                >
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-400 text-xs font-bold">CRÍTICO</span>
                </motion.div>

                <motion.div
                  className="absolute -right-10 top-1/3 bg-[#1c2333] border border-amber-500/30 rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg z-20"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut", delay: 0.5 }}
                >
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-amber-400 text-xs font-bold">IA Detectou</span>
                </motion.div>

                <motion.div
                  className="absolute -left-8 bottom-28 bg-[#1c2333] border border-green-500/30 rounded-xl px-3 py-2 flex items-center gap-2 shadow-lg z-20"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 3.6, ease: "easeInOut", delay: 1 }}
                >
                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                  <span className="text-green-400 text-xs font-bold">Confirmado</span>
                </motion.div>

                {/* Phone frame */}
                <div className="relative w-[280px] rounded-[40px] bg-[#0a0d12] border-[3px] border-[#2a2f3a] shadow-2xl overflow-hidden"
                  style={{ boxShadow: "0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)" }}
                >
                  {/* Notch */}
                  <div className="flex justify-center pt-3 pb-1 px-4">
                    <div className="w-24 h-6 rounded-full bg-[#0a0d12] border border-[#1a1f2a] flex items-center justify-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#1e2230]" />
                      <div className="w-10 h-1.5 rounded-full bg-[#1e2230]" />
                    </div>
                  </div>

                  {/* Status bar */}
                  <div className="flex items-center justify-between px-5 py-1.5">
                    <span className="text-white/60 text-[10px] font-medium">9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="flex gap-0.5 items-end h-3">
                        {[2,3,4,5].map(h => <div key={h} style={{height: `${h*2}px`}} className="w-1 bg-white/50 rounded-sm" />)}
                      </div>
                      <div className="w-5 h-2.5 rounded-sm border border-white/30 flex items-center px-0.5">
                        <div className="h-full w-3/4 bg-white/70 rounded-sm" />
                      </div>
                    </div>
                  </div>

                  {/* App UI */}
                  <div className="px-4 pt-1 pb-0">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-white text-lg font-black">Alertas Ativos</p>
                        <p className="text-white/40 text-[10px]">3 aguardando resposta</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                        <span className="text-red-400 text-xs font-black">3</span>
                      </div>
                    </div>

                    {/* Alert card 1 — CRÍTICO */}
                    <div className="mb-2.5 rounded-xl border border-white/10 overflow-hidden bg-[#161b22] flex">
                      <div className="w-1 bg-red-500 shrink-0" />
                      <div className="p-2.5 flex-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1 bg-red-500/20 px-1.5 py-0.5 rounded-md">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            <span className="text-red-400 text-[9px] font-black">CRÍTICO</span>
                          </div>
                          <span className="text-white/30 text-[9px]">2min atrás</span>
                        </div>
                        <p className="text-white text-xs font-bold mb-0.5">Pessoa em zona restrita</p>
                        <p className="text-white/30 text-[9px] mb-2">RAMPA NORTE 02</p>
                        <div className="flex gap-2">
                          <img src={`${BASE}images/alert1.png`} className="w-16 h-11 rounded-md object-cover" />
                          <p className="text-white/45 text-[9px] leading-tight">Indivíduo na área restrita. 4m32s. Comportamento atípico detectado.</p>
                        </div>
                        <div className="flex justify-end mt-1.5">
                          <span className="text-amber-400 text-[9px] font-semibold">Toque para responder →</span>
                        </div>
                      </div>
                    </div>

                    {/* Alert card 2 — ALTO */}
                    <div className="mb-2.5 rounded-xl border border-white/10 overflow-hidden bg-[#161b22] flex">
                      <div className="w-1 bg-orange-500 shrink-0" />
                      <div className="p-2.5 flex-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1 bg-orange-500/20 px-1.5 py-0.5 rounded-md">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            <span className="text-orange-400 text-[9px] font-black">ALTO</span>
                          </div>
                          <span className="text-white/30 text-[9px]">7min atrás</span>
                        </div>
                        <p className="text-white text-xs font-bold mb-0.5">Veículo parado suspeito</p>
                        <p className="text-white/30 text-[9px] mb-2">PÁTIO COBERTO 03</p>
                        <div className="flex gap-2">
                          <img src={`${BASE}images/alert2.png`} className="w-16 h-11 rounded-md object-cover" />
                          <p className="text-white/45 text-[9px] leading-tight">Placa ABC-1234. Veículo estacionado há 8h. Janelas escurecidas.</p>
                        </div>
                        <div className="flex justify-end mt-1.5">
                          <span className="text-amber-400 text-[9px] font-semibold">Toque para responder →</span>
                        </div>
                      </div>
                    </div>

                    {/* Alert card 3 — ALTO (slightly cut off) */}
                    <div className="rounded-xl border border-white/10 overflow-hidden bg-[#161b22] flex" style={{maxHeight: 52}}>
                      <div className="w-1 bg-orange-500 shrink-0" />
                      <div className="p-2.5 flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1 bg-orange-500/20 px-1.5 py-0.5 rounded-md">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            <span className="text-orange-400 text-[9px] font-black">ALTO</span>
                          </div>
                          <span className="text-white/30 text-[9px]">14min atrás</span>
                        </div>
                        <p className="text-white text-xs font-bold">Comportamento suspeito</p>
                      </div>
                    </div>
                  </div>

                  {/* Tab bar */}
                  <div className="mt-3 border-t border-white/10 bg-[#0d1117] px-2 pt-2 pb-4">
                    <div className="flex justify-around">
                      {[
                        { icon: "🔔", label: "Alertas", active: true },
                        { icon: "🕐", label: "Histórico", active: false },
                        { icon: "🛡", label: "Status", active: false },
                      ].map((tab, i) => (
                        <div key={i} className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg ${tab.active ? "bg-amber-500/10" : ""}`}>
                          <span className="text-base leading-none">{tab.icon}</span>
                          <span className={`text-[8px] font-semibold ${tab.active ? "text-amber-400" : "text-white/30"}`}>{tab.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── CREDIBILIDADE ── */}
      <section className="py-24 px-6 bg-[#f8f9fa]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="bg-[#111827] rounded-3xl p-12 relative overflow-hidden text-center border border-white/10"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500 rounded-t-3xl" />
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full blur-3xl pointer-events-none"
              style={{ background: "rgba(245,158,11,0.08)" }} />
            <Layers className="w-10 h-10 text-amber-400 mx-auto mb-6" />
            <SectionLabel>Credibilidade</SectionLabel>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-5">
              Tecnologia aplicada, validada e pronta para escalar
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto leading-relaxed mb-3">
              O Safe Park nasce da evolução prática de uma solução desenvolvida para modernizar operações de
              estacionamento com automação, IA e segurança inteligente.
            </p>
            <p className="text-white/40 max-w-2xl mx-auto leading-relaxed text-sm">
              A proposta foi concebida para transformar o pátio em uma operação mais eficiente, resiliente e
              preparada para expansão, com visão de produto SaaS escalável e aderente ao contexto de cidades inteligentes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CTA FORTE ── */}
      <section className="py-24 px-6 bg-amber-50 border-y border-amber-100">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <Star className="w-10 h-10 text-amber-400 mx-auto mb-5" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Veja como o Safe Park pode transformar sua operação
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto mb-8 leading-relaxed">
              Agende uma conversa com nosso time e descubra como aplicar inteligência operacional ao seu pátio de estacionamento.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#contato"
                className="px-8 py-4 bg-amber-500 text-amber-950 rounded-xl font-bold shadow-lg hover:bg-amber-400 hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                Agendar demonstração <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#contato"
                className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:border-amber-300 transition-all"
              >
                Solicitar proposta
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FORMULÁRIO ── */}
      <section id="contato" className="py-24 px-6 bg-white border-y border-gray-100">
        <div className="max-w-3xl mx-auto">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionLabel>Contato</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Fale com o time Safe Park
            </h2>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-amber-50 border border-amber-200 rounded-2xl p-12 text-center"
            >
              <CheckCircle2 className="w-14 h-14 text-amber-500 mx-auto mb-4" />
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">Mensagem enviada!</h3>
              <p className="text-gray-500">Em breve nosso time entrará em contato para entender sua operação.</p>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={e => { e.preventDefault(); setSubmitted(true); }}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="bg-[#f8f9fa] border border-gray-200 rounded-2xl p-8 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  { key: "nome", label: "Nome*", ph: "Seu nome completo" },
                  { key: "empresa", label: "Empresa*", ph: "Nome da empresa" },
                  { key: "cargo", label: "Cargo", ph: "Seu cargo" },
                  { key: "email", label: "E-mail*", ph: "seu@email.com" },
                  { key: "whatsapp", label: "WhatsApp", ph: "(11) 99999-9999" },
                  { key: "cidade", label: "Cidade / Estado", ph: "São Paulo, SP" },
                ].map(({ key, label, ph }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                    <input
                      type="text" placeholder={ph}
                      value={(form as any)[key]} onChange={set(key)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-300 transition-colors"
                    />
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de operação</label>
                  <select value={form.tipoOperacao} onChange={set("tipoOperacao")}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-300 transition-colors"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Número de vagas</label>
                  <select value={form.vagas} onChange={set("vagas")}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-300 transition-colors"
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Desafio principal hoje</label>
                <input type="text" placeholder="Ex: Baixa visibilidade, muitos incidentes, dificuldade para escalar..."
                  value={form.desafio} onChange={set("desafio")}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-300 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mensagem</label>
                <textarea rows={4} placeholder="Conte mais sobre sua operação e o que você espera da solução..."
                  value={form.mensagem} onChange={set("mensagem")}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-300 transition-colors resize-none"
                />
              </div>

              <div className="pt-2">
                <button type="submit"
                  className="w-full py-4 bg-amber-500 text-amber-950 rounded-xl font-bold text-base shadow-lg hover:bg-amber-400 transition-all"
                >
                  Quero conhecer o Safe Park
                </button>
                <p className="text-center text-xs text-gray-400 mt-3 leading-relaxed">
                  Sem compromisso. Vamos entender sua operação e mostrar onde a tecnologia pode gerar mais impacto.
                </p>
              </div>
            </motion.form>
          )}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-6 bg-[#f8f9fa] border-t border-gray-100">
        <div className="max-w-3xl mx-auto">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">Perguntas frequentes</h2>
          </motion.div>
          <div className="space-y-3">
            <FAQItem q="O Safe Park serve apenas para estacionamentos comerciais?" a="Não. A solução pode ser aplicada também em operações corporativas, industriais, universitárias, logísticas e públicas." />
            <FAQItem q="O produto foca mais em operação ou em segurança?" a="Nos dois. O diferencial está justamente em integrar automação operacional com segurança preditiva — não como módulos separados, mas como uma camada única." />
            <FAQItem q="É possível implantar em mais de um pátio?" a="Sim. A lógica da solução é SaaS e escalável, pensada para replicação e expansão com gestão centralizada." />
            <FAQItem q="O sistema pode evoluir com a operação?" a="Sim. O Safe Park foi concebido como plataforma modular, permitindo expansão e refinamento contínuo conforme a maturidade operacional cresce." />
            <FAQItem q="Preciso trocar minhas câmeras existentes?" a="Não necessariamente. O Safe Park é compatível com câmeras IP via protocolos RTSP/ONVIF, podendo integrar com infraestrutura já existente." />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 px-6 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src={`${BASE}images/logo.png`} alt="SafePark" className="w-7 h-7 rounded object-cover" />
            <span className="font-display font-bold text-gray-900">
              SAFE<span className="text-amber-500">PARK</span>
            </span>
          </div>
          <p className="text-sm text-gray-400">© 2026 Safe Park. Segurança inteligente para estacionamentos.</p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <a href="#solucao" className="hover:text-gray-700 transition-colors">A Solução</a>
            <a href="#contato" className="hover:text-gray-700 transition-colors">Contato</a>
            <a href="#faq" className="hover:text-gray-700 transition-colors">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
