// Mock Data to populate the SafePark platform
export type EventSeverity = 'critical' | 'high' | 'medium' | 'low';
export type EventStatus = 'Novo' | 'Em Análise' | 'Escalado' | 'Resolvido' | 'Falso Positivo';

export interface Camera {
  id: string;
  name: string;
  status: 'online' | 'offline';
  type: string;
  fps: number;
  resolution: string;
  unit: string;
  previewUrl?: string;
}

export interface SecurityEvent {
  id: string;
  type: string;
  severity: EventSeverity;
  camera: string;
  zone: string;
  timestamp: string;
  duration: string;
  confidence: number;
  status: EventStatus;
  thumbnail: string;
  description: string;
  entities: string[];
}

export const MOCK_CAMERAS: Camera[] = [
  { id: 'cam-1', name: 'Entrada 01', status: 'online', type: 'Entrada', fps: 30, resolution: '4K', unit: 'Unidade Centro' },
  { id: 'cam-2', name: 'Entrada 02', status: 'online', type: 'Entrada', fps: 30, resolution: '4K', unit: 'Unidade Centro' },
  { id: 'cam-3', name: 'Pátio Norte A1', status: 'online', type: 'Pátio', fps: 24, resolution: '1080p', unit: 'Unidade Centro' },
  { id: 'cam-4', name: 'Pátio Norte A2', status: 'online', type: 'Pátio', fps: 24, resolution: '1080p', unit: 'Unidade Centro' },
  { id: 'cam-5', name: 'Corredor Leste C1', status: 'online', type: 'Corredor', fps: 15, resolution: '1080p', unit: 'Unidade Centro' },
  { id: 'cam-6', name: 'Área Restrita', status: 'online', type: 'Restrita', fps: 30, resolution: '4K', unit: 'Unidade Centro' },
  { id: 'cam-7', name: 'Saída 01', status: 'offline', type: 'Saída', fps: 0, resolution: '1080p', unit: 'Unidade Centro' },
  { id: 'cam-8', name: 'Pátio Sul B1', status: 'online', type: 'Pátio', fps: 24, resolution: '1080p', unit: 'Unidade Centro' },
];

export const MOCK_EVENTS: SecurityEvent[] = [
  {
    id: 'EVT-8921',
    type: 'Intrusão Zona Restrita',
    severity: 'critical',
    camera: 'Área Restrita',
    zone: 'Setor VIP',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
    duration: '00:01:24',
    confidence: 98,
    status: 'Novo',
    thumbnail: 'https://images.unsplash.com/photo-1542382029-4b68cebc90ea?w=400&h=200&fit=crop&q=80',
    description: 'Pessoa detectada acessando a zona restrita sem crachá de identificação visível. Indivíduo permaneceu próximo aos quadros de energia.',
    entities: ['Pessoa-992'],
  },
  {
    id: 'EVT-8920',
    type: 'Pessoa sem Origem',
    severity: 'high',
    camera: 'Pátio Norte A2',
    zone: 'Setor A',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    duration: '00:04:12',
    confidence: 92,
    status: 'Em Análise',
    thumbnail: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&h=200&fit=crop&q=80',
    description: 'Indivíduo detectado circulando entre veículos sem ter desembarcado de nenhum carro nos últimos 45 minutos no pátio.',
    entities: ['Pessoa-984'],
  },
  {
    id: 'EVT-8919',
    type: 'Circulação Anômala',
    severity: 'medium',
    camera: 'Corredor Leste C1',
    zone: 'Corredor C',
    timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    duration: '00:08:30',
    confidence: 85,
    status: 'Resolvido',
    thumbnail: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=200&fit=crop&q=80',
    description: 'Veículo realizando rotas circulares repetidas pelo mesmo corredor. Confirmado como motorista procurando vaga.',
    entities: ['Veículo-ABC1234'],
  },
  {
    id: 'EVT-8918',
    type: 'Permanência Anômala',
    severity: 'low',
    camera: 'Pátio Sul B1',
    zone: 'Setor B',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    duration: '00:22:15',
    confidence: 76,
    status: 'Falso Positivo',
    thumbnail: 'https://images.unsplash.com/photo-1621213031070-5807dd36b412?w=400&h=200&fit=crop&q=80',
    description: 'Pessoa aguardando ao lado do veículo por tempo prolongado.',
    entities: ['Pessoa-970', 'Veículo-XYZ9876'],
  },
];
