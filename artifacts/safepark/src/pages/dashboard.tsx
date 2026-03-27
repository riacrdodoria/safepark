import { AppLayout } from "@/components/layout/app-layout";
import { Car, Activity, Video, Users, AlertOctagon } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEvents } from "@/hooks/use-events";
import { useCameras } from "@/hooks/use-cameras";
import { StatusBadge } from "@/components/ui/status-badge";
import { Link } from "wouter";
import { motion } from "framer-motion";

const hourlyData = [
  { time: '08:00', events: 2 }, { time: '09:00', events: 5 }, { time: '10:00', events: 12 },
  { time: '11:00', events: 8 }, { time: '12:00', events: 15 }, { time: '13:00', events: 22 },
  { time: '14:00', events: 9 }, { time: '15:00', events: 11 }, { time: '16:00', events: 6 },
];

const typeData = [
  { name: 'Intrusão', count: 14 },
  { name: 'Anômala', count: 32 },
  { name: 'Sem Origem', count: 8 },
  { name: 'Permanência', count: 18 },
];

function KPI({ title, value, sub, icon: Icon, trend, colorClass = "text-primary" }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-5 rounded-xl tech-border"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-muted-foreground text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-display font-bold">{value}</h3>
          <p className="text-xs text-muted-foreground mt-2">{sub}</p>
        </div>
        <div className={`p-3 rounded-lg bg-card/50 ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { data: events } = useEvents();
  const { data: cameras } = useCameras();

  const criticalEvents = events?.filter(e => e.severity === 'critical') || [];
  const onlineCameras = cameras?.filter(c => c.status === 'online') || [];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl text-foreground">Visão Operacional</h1>
          <div className="text-sm text-muted-foreground">
            Última atualização: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <KPI title="Veículos no Pátio" value="247" sub="73% de Ocupação" icon={Car} />
          <KPI title="Eventos Críticos" value={criticalEvents.length.toString()} sub="Hoje" icon={AlertOctagon} colorClass="text-destructive" />
          <KPI title="Em Análise" value="8" sub="Aguardando Operador" icon={Activity} colorClass="text-warning" />
          <KPI title="Câmeras Online" value={`${onlineCameras.length}/${cameras?.length || 0}`} sub="92% Uptime" icon={Video} colorClass="text-success" />
          <KPI title="Pessoas s/ Origem" value="2" sub="Rastreamento Ativo" icon={Users} colorClass="text-info" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Charts Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 rounded-xl tech-border">
              <h3 className="text-lg mb-4 font-display">Volume de Eventos por Hora</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', color: '#111827', borderRadius: 8 }}
                      itemStyle={{ color: '#f59e0b' }}
                    />
                    <Line type="monotone" dataKey="events" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-xl tech-border">
                <h3 className="text-lg mb-4 font-display">Tipos de Alerta</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={typeData} layout="vertical" margin={{ left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                      <XAxis type="number" stroke="#9ca3af" fontSize={12} hide />
                      <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e7eb', borderRadius: 8 }} />
                      <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="glass-panel p-6 rounded-xl tech-border flex flex-col justify-between">
                <div>
                  <h3 className="text-lg mb-2 font-display">Mapa de Ocupação</h3>
                  <p className="text-sm text-muted-foreground mb-4">Setor A apresenta maior densidade nas últimas 2 horas.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1"><span>Setor A (VIP)</span><span className="text-destructive">85%</span></div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-destructive" style={{width: '85%'}}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1"><span>Setor B (Coberto)</span><span className="text-warning">67%</span></div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-warning" style={{width: '67%'}}></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1"><span>Setor C (Descoberto)</span><span className="text-success">31%</span></div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-success" style={{width: '31%'}}></div></div>
                  </div>
                </div>
                <Link href="/map" className="mt-4 text-sm text-primary hover:underline font-medium inline-flex items-center">
                  Ver Mapa Completo <Activity className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Recent Alerts */}
          <div className="glass-panel p-0 rounded-xl tech-border flex flex-col h-full">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="text-lg font-display">Alertas Recentes</h3>
              <Link href="/events" className="text-xs text-primary hover:underline">Ver todos</Link>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {events?.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`} className="block">
                  <div className="p-3 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border transition-colors group cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <StatusBadge status={event.severity} variant="dot" />
                      <span className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{event.type}</h4>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Video className="w-3 h-3" /> {event.camera}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
