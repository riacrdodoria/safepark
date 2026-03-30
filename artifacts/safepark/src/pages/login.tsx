import { Link } from "wouter";
import { Shield, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding (sidebar-colored dark panel) */}
      <div className="hidden lg:flex flex-1 relative bg-[hsl(220,20%,22%)] overflow-hidden items-center justify-center">
        <img
          src={`${import.meta.env.BASE_URL}images/landing-hero.png`}
          className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-luminosity"
          alt="System interface"
        />
        {/* Amber accent stripe at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />

        <div className="relative z-20 text-center max-w-lg p-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/20 border border-primary/40 mb-8">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl font-display font-bold text-white mb-4 tracking-tight">
            SAFE<span className="text-primary">PARK</span>
          </h1>
          <p className="text-base text-white/60 leading-relaxed">
            Monitoramento inteligente e segurança preditiva para o seu estacionamento.
          </p>
          <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
            {[
              { value: "99.8%", label: "Uptime" },
              { value: "24/7", label: "Monitoramento" },
              { value: "<2s", label: "Latência" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-display font-bold text-primary">{s.value}</p>
                <p className="text-xs text-white/50 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-card z-20">
        {/* Amber top accent line */}
        <div className="absolute top-0 right-0 w-full lg:w-1/2 h-1 bg-primary" />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm mx-auto"
        >
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-2xl font-display font-bold tracking-tight text-foreground">
              SAFE<span className="text-primary">PARK</span>
            </span>
          </div>

          <h2 className="text-2xl font-display font-bold text-foreground mb-1">Acesso ao Sistema</h2>
          <p className="text-muted-foreground mb-8 text-sm">
            Insira suas credenciais de operador para continuar.
          </p>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">E-mail Operacional</label>
              <input
                type="email"
                defaultValue="operador@safepark.com.br"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm text-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground">Senha</label>
                <a href="#" className="text-xs text-primary hover:underline font-medium">
                  Esqueceu?
                </a>
              </div>
              <input
                type="password"
                defaultValue="••••••••"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-mono tracking-widest text-foreground"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input type="checkbox" id="remember" className="rounded border-border accent-primary" />
              <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                Manter conectado
              </label>
            </div>

            <div className="pt-2">
              <Link
                href="/demo"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold transition-all shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                Entrar na Demo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </form>

          <div className="mt-10 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">Novo no sistema?</p>
            <Link
              href="/"
              className="text-sm text-foreground font-medium hover:text-primary transition-colors mt-1 inline-block"
            >
              Conheça a plataforma comercial →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
