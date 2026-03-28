import { Camera } from "@/lib/mock-data";
import { TrackingLiveResponse } from "@/lib/api";
import { StatusBadge } from "@/components/ui/status-badge";

type LiveCameraOverlayProps = {
  camera: Camera;
  liveTracking?: TrackingLiveResponse;
  className?: string;
};

export function LiveCameraOverlay({ camera, liveTracking, className }: LiveCameraOverlayProps) {
  const liveState =
    camera.previewUrl && liveTracking?.available
      ? liveTracking.states?.[camera.id] ?? (liveTracking.state?.camera_id === camera.id ? liveTracking.state : null)
      : null;
  const streamUrl = liveState
    ? `http://localhost:8012/tracking/live-stream/${camera.id}?t=${encodeURIComponent(liveState.updated_at)}`
    : null;

  const colorForTrack = (label: string, motionState?: string) => {
    if (label === "person") {
      return motionState === "moving"
        ? "border-yellow-400 bg-yellow-400/10 text-yellow-100"
        : "border-blue-400 bg-blue-400/10 text-blue-100";
    }
    return motionState === "moving"
      ? "border-red-500 bg-red-500/10 text-red-100"
      : "border-green-400 bg-green-400/10 text-green-100";
  };

  return (
    <div className={`relative bg-black overflow-hidden ${className ?? ""}`}>
      {streamUrl ? (
        <img
          src={streamUrl}
          alt={`${camera.name} live stream`}
          className="w-full h-full object-cover opacity-95"
        />
      ) : camera.previewUrl ? (
        <video
          src={camera.previewUrl}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-85"
        />
      ) : (
        <img
          src="https://images.unsplash.com/photo-1573060010996-9811cceba220?w=800&h=450&fit=crop&q=60&auto=format"
          alt={camera.name}
          className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
        />
      )}

      {!streamUrl && liveState?.frame_size
        ? liveState.tracks.map((track) => {
            const frameWidth = liveState.frame_size.width || 1;
            const frameHeight = liveState.frame_size.height || 1;
            const left = (track.bbox.x1 / frameWidth) * 100;
            const top = (track.bbox.y1 / frameHeight) * 100;
            const width = ((track.bbox.x2 - track.bbox.x1) / frameWidth) * 100;
            const height = ((track.bbox.y2 - track.bbox.y1) / frameHeight) * 100;
            const colorClass = colorForTrack(track.label, track.motion_state);

            return (
              <div
                key={track.track_id}
                className={`absolute border-2 ${colorClass}`}
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${width}%`,
                  height: `${height}%`,
                }}
              >
                <span className={`absolute -top-6 left-[-2px] px-1 font-mono text-[10px] font-bold ${colorClass}`}>
                  {track.label.toUpperCase()} {track.motion_state === "moving" ? "MOVING" : "STOPPED"} {Math.round(track.confidence * 100)}%
                </span>
              </div>
            );
          })
        : null}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent h-[10%] animate-scan opacity-50 pointer-events-none" />

      <div className="absolute top-3 left-3 flex gap-2">
        <StatusBadge status="REC" variant="solid" className="bg-destructive text-white animate-pulse" />
        <span className="px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-mono border border-white/10">
          {camera.fps} FPS
        </span>
      </div>

      {liveState ? (
        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className="px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-mono border border-white/10">
            {liveState.counts.vehicle} VEH
          </span>
          <span className="px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-mono border border-white/10">
            {liveState.counts.person} PESS
          </span>
        </div>
      ) : null}
    </div>
  );
}
