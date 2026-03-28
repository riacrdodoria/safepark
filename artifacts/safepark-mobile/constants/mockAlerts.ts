export type AlertSeverity = 'critical' | 'high' | 'medium';
export type AlertStatus = 'pending' | 'confirmed' | 'dismissed';

export interface ParkingAlert {
  id: string;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  description: string;
  camera: string;
  zone: string;
  plate?: string;
  imageAsset: number;
  timestamp: Date;
  respondedAt?: Date;
  respondedBy?: string;
}

export const CAMERA_LIST = [
  'ENTRADA PRINCIPAL 01',
  'RAMPA NORTE 02',
  'PÁTIO COBERTO 03',
  'DEMO WHATSAPP 01',
  'SAÍDA SUL 04',
  'CORREDOR LESTE 01',
];

export const ZONE_LIST = [
  'Entrada • Safe Park Centro',
  'Rampa Norte • Safe Park Centro',
  'Pátio Coberto • Safe Park Centro',
  'Overview • Safe Park Centro',
  'Saída Sul • Safe Park Centro',
  'Corredor Leste • Safe Park Centro',
];

export const ALERT_TEMPLATES: Omit<ParkingAlert, 'id' | 'timestamp' | 'status' | 'respondedAt' | 'respondedBy'>[] = [
  {
    severity: 'critical',
    title: 'Pessoa em zona restrita',
    description: 'Indivíduo detectado na área de acesso restrito. Permanência de 4m32s. Comportamento atípico — movimentos lentos próximos a veículos.',
    camera: 'RAMPA NORTE 02',
    zone: 'Rampa Norte • Safe Park Centro',
    imageAsset: 0,
  },
  {
    severity: 'critical',
    title: 'Intrusão detectada',
    description: 'Entrada não autorizada detectada. Pessoa escalou a grade lateral. IA identificou ponto de acesso irregular com confiança 0.94.',
    camera: 'SAÍDA SUL 04',
    zone: 'Saída Sul • Safe Park Centro',
    imageAsset: 1,
  },
  {
    severity: 'high',
    title: 'Veículo parado suspeito',
    description: 'Veículo estacionado há mais de 8h em vaga de 2h. Placa ABC-1234. Janelas escurecidas. Nenhum passageiro visível nas últimas 40 min.',
    camera: 'PÁTIO COBERTO 03',
    zone: 'Pátio Coberto • Safe Park Centro',
    plate: 'ABC-1234',
    imageAsset: 2,
  },
  {
    severity: 'high',
    title: 'Comportamento suspeito',
    description: 'Pessoa circulando entre veículos por 6+ minutos sem destino definido. IA identificou padrão de ronda. Sem veículo próprio no pátio.',
    camera: 'ENTRADA PRINCIPAL 01',
    zone: 'Entrada • Safe Park Centro',
    imageAsset: 3,
  },
  {
    severity: 'medium',
    title: 'Veículo em fila dupla',
    description: 'Veículo bloqueando corredor de saída há 12 minutos. Placa DEF-5678. Motorista não identificado nas proximidades.',
    camera: 'CORREDOR LESTE 01',
    zone: 'Corredor Leste • Safe Park Centro',
    plate: 'DEF-5678',
    imageAsset: 0,
  },
  {
    severity: 'critical',
    title: 'Aglomeração atípica',
    description: 'Grupo de 4+ pessoas próximas a um veículo. Porta traseira aberta. Comportamento agitado detectado. Possível tentativa de furto.',
    camera: 'DEMO WHATSAPP 01',
    zone: 'Overview • Safe Park Centro',
    imageAsset: 1,
  },
  {
    severity: 'high',
    title: 'Circulação anômala',
    description: 'Veículo realizando múltiplas voltas no pátio sem estacionar. Placa GHI-9012. Possível reconhecimento do local.',
    camera: 'PÁTIO COBERTO 03',
    zone: 'Pátio Coberto • Safe Park Centro',
    plate: 'GHI-9012',
    imageAsset: 2,
  },
  {
    severity: 'medium',
    title: 'Acesso fora do horário',
    description: 'Pessoa detectada na área coberta fora do horário de funcionamento (02h14). Câmera verificou ausência de veículo cadastrado.',
    camera: 'RAMPA NORTE 02',
    zone: 'Rampa Norte • Safe Park Centro',
    imageAsset: 3,
  },
];

function makeId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

function minutesAgo(n: number) {
  return new Date(Date.now() - n * 60 * 1000);
}

export function generateInitialAlerts(): ParkingAlert[] {
  return [
    { ...ALERT_TEMPLATES[0], id: makeId(), status: 'pending', timestamp: minutesAgo(2) },
    { ...ALERT_TEMPLATES[2], id: makeId(), status: 'pending', timestamp: minutesAgo(7) },
    { ...ALERT_TEMPLATES[3], id: makeId(), status: 'pending', timestamp: minutesAgo(14) },
    { ...ALERT_TEMPLATES[4], id: makeId(), status: 'confirmed', timestamp: minutesAgo(22), respondedAt: minutesAgo(20), respondedBy: 'Carlos M.' },
    { ...ALERT_TEMPLATES[6], id: makeId(), status: 'dismissed', timestamp: minutesAgo(35), respondedAt: minutesAgo(33), respondedBy: 'Carlos M.' },
    { ...ALERT_TEMPLATES[5], id: makeId(), status: 'confirmed', timestamp: minutesAgo(58), respondedAt: minutesAgo(55), respondedBy: 'Ana R.' },
    { ...ALERT_TEMPLATES[7], id: makeId(), status: 'dismissed', timestamp: minutesAgo(90), respondedAt: minutesAgo(88), respondedBy: 'Carlos M.' },
    { ...ALERT_TEMPLATES[1], id: makeId(), status: 'confirmed', timestamp: minutesAgo(120), respondedAt: minutesAgo(117), respondedBy: 'Ana R.' },
  ];
}

export function generateNewAlert(): ParkingAlert {
  const template = ALERT_TEMPLATES[Math.floor(Math.random() * ALERT_TEMPLATES.length)];
  return { ...template, id: makeId(), status: 'pending', timestamp: new Date() };
}
