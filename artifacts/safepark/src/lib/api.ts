import { Camera, MOCK_CAMERAS, MOCK_EVENTS, SecurityEvent } from "@/lib/mock-data";

export type DashboardResponse = {
  cars_in_lot: number;
  occupancy_rate: number;
  unknown_persons: number;
  high_occupancy_zones: number;
  critical_alerts: number;
  cameras_online: number;
  cameras_offline: number;
  recent_events: BackendEvent[];
  occupancy_by_zone: Array<{
    zone_name: string;
    occupied: number;
    total: number;
    occupancy_rate: number;
  }>;
};

export type BackendCamera = {
  id: string;
  site_id: string;
  zone_id: string | null;
  name: string;
  type: string;
  stream_url: string;
  status: string;
};

export type BackendEvent = {
  id: string;
  event_type: string;
  severity: string;
  camera_id: string | null;
  status: string;
  confidence: number;
  title: string;
  description: string | null;
  started_at: string;
  ended_at: string | null;
  related_camera_ids: string[];
  related_zone_ids: string[];
  payload: Record<string, unknown>;
};

export type TrackingResponse = {
  tracked_people: number;
  tracked_vehicles: number;
  tracked_objects: number;
  associations: Array<{
    id: string;
    person_id: string;
    vehicle_id: string;
    confidence_score: number;
    association_type: string;
    active: boolean;
  }>;
};

export type LiveTrack = {
  track_id: string;
  label: "person" | "vehicle";
  motion_state?: "moving" | "stopped";
  confidence: number;
  bbox: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
};

export type TrackingLiveResponse = {
  available: boolean;
  state: null | {
    camera_id: string;
    camera_name: string;
    updated_at: string;
    frame_size: {
      width: number;
      height: number;
    };
    counts: {
      person: number;
      vehicle: number;
      tracked_objects: number;
    };
    tracks: LiveTrack[];
    artifacts?: {
      latest_snapshot_path?: string;
    };
  };
  states?: Record<string, NonNullable<TrackingLiveResponse["state"]>>;
  controls?: Record<
    string,
    {
      enabled: boolean;
      running: boolean;
      pid: number | null;
    }
  >;
};

export type CameraFlowResponse = {
  links: Array<{
    id: string;
    source_camera_id: string;
    target_camera_id: string;
    link_type: string;
    transition_confidence: number;
    expected_travel_time_min: number;
    expected_travel_time_max: number;
  }>;
  recent_transitions: Array<{
    event_id: string;
    title: string;
    confidence: number;
    started_at: string;
    payload: Record<string, unknown>;
  }>;
};

export type RuleConfigResponse = {
  id: string;
  site_id: string;
  rule_key: string;
  enabled: boolean;
  config: Record<string, unknown>;
};

export type SystemStatusResponse = {
  api: string;
  database: string;
  demo_mode: boolean;
  go2rtc_url: string;
  stream_gateway_url: string;
};

const API_BASE_URL = (import.meta.env.VITE_SAFE_PARK_API_URL as string | undefined)?.replace(/\/$/, "") ?? "http://127.0.0.1:8000";

const statusMap: Record<string, SecurityEvent["status"]> = {
  open: "Novo",
  acknowledged: "Em Análise",
  resolved: "Resolvido",
};

function humanizeEventType(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function fetchJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      return fallback;
    }
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export async function postJson<TResponse, TPayload>(path: string, payload: TPayload, fallback: TResponse): Promise<TResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      return fallback;
    }
    return (await response.json()) as TResponse;
  } catch {
    return fallback;
  }
}

export function mapCamera(camera: BackendCamera): Camera {
  const fileName = camera.stream_url.split("/").pop();
  const previewUrl = fileName?.endsWith(".mp4") ? `/demo/${fileName}` : undefined;

  return {
    id: camera.id,
    name: camera.name,
    status: camera.status === "offline" ? "offline" : "online",
    type: humanizeEventType(camera.type),
    fps: camera.status === "online" ? 24 : 0,
    resolution: camera.type === "overview" ? "4K" : "1080p",
    unit: "Safe Park Centro",
    previewUrl,
  };
}

export function mapEvent(event: BackendEvent, cameras: Camera[] = MOCK_CAMERAS): SecurityEvent {
  const cameraName = cameras.find((camera) => camera.id === event.camera_id)?.name ?? "Camera sem nome";
  const zoneName = event.related_zone_ids[0] ?? "Zona não identificada";
  return {
    id: event.id,
    type: event.title || humanizeEventType(event.event_type),
    severity: event.severity as SecurityEvent["severity"],
    camera: cameraName,
    zone: zoneName,
    timestamp: event.started_at,
    duration: event.ended_at ? "Encerrado" : "Em aberto",
    confidence: Math.round(event.confidence * 100),
    status: statusMap[event.status] ?? "Novo",
    thumbnail: "https://images.unsplash.com/photo-1542382029-4b68cebc90ea?w=400&h=200&fit=crop&q=80",
    description: event.description ?? "Evento gerado pelo motor comportamental do Safe Park.",
    entities: [
      String(event.payload.person_id ?? event.payload.object_id ?? event.payload.vehicle_id ?? "Entidade-1"),
    ],
  };
}

export async function loadCameras(): Promise<Camera[]> {
  const cameras = await fetchJson<BackendCamera[]>("/cameras/", []);
  return cameras.length ? cameras.map(mapCamera) : MOCK_CAMERAS;
}

export async function loadEvents(): Promise<SecurityEvent[]> {
  const [cameraList, eventEnvelope] = await Promise.all([
    loadCameras(),
    fetchJson<{ items: BackendEvent[]; meta: { total: number } }>("/events/", { items: [], meta: { total: 0 } }),
  ]);

  return eventEnvelope.items.length ? eventEnvelope.items.map((event) => mapEvent(event, cameraList)) : MOCK_EVENTS;
}

export async function loadEvent(id: string): Promise<SecurityEvent | undefined> {
  const [cameraList, event] = await Promise.all([
    loadCameras(),
    fetchJson<BackendEvent | null>(`/events/${id}`, null),
  ]);

  if (!event) {
    return MOCK_EVENTS.find((item) => item.id === id);
  }

  return mapEvent(event, cameraList);
}

export async function loadDashboard() {
  return fetchJson<DashboardResponse>("/dashboard/metrics", {
    cars_in_lot: 247,
    occupancy_rate: 0.73,
    unknown_persons: 2,
    high_occupancy_zones: 1,
    critical_alerts: 1,
    cameras_online: 7,
    cameras_offline: 1,
    recent_events: [],
    occupancy_by_zone: [],
  });
}

export async function loadTracking() {
  return fetchJson<TrackingResponse>("/tracking/overview", {
    tracked_people: 3,
    tracked_vehicles: 2,
    tracked_objects: 5,
    associations: [],
  });
}

export async function loadTrackingLive() {
  return fetchJson<TrackingLiveResponse>("/tracking/live", {
    available: false,
    state: null,
  });
}

export async function setVisionEnabled(cameraId: string, enabled: boolean) {
  return postJson(
    `/tracking/vision/${cameraId}`,
    { enabled },
    {
      camera_id: cameraId,
      status: { enabled, running: false, pid: null },
      controls: {},
      state: null,
    },
  );
}

export async function loadCameraFlow() {
  return fetchJson<CameraFlowResponse>("/camera-flow/", {
    links: [],
    recent_transitions: [],
  });
}

export async function loadRules() {
  return fetchJson<RuleConfigResponse[]>("/rules/", []);
}

export async function loadSystemStatus() {
  return fetchJson<SystemStatusResponse>("/system/status", {
    api: "demo",
    database: "demo",
    demo_mode: true,
    go2rtc_url: "http://localhost:1984",
    stream_gateway_url: "http://localhost:8010",
  });
}
