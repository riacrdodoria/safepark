# Registering Real RTSP Cameras

1. Start infrastructure with Docker Compose.
2. Create the camera through `POST /cameras/` with:
   - `site_id`
   - `zone_id`
   - `name`
   - `type`
   - `stream_url`
3. Validate the stream through the stream gateway:
   - `POST /validate`
4. If valid, optionally create an on-demand snapshot:
   - `POST /snapshot`
5. Add the stream to `go2rtc` if live relay is needed for consumers.

## Notes

- In the MVP, snapshot and validation are real.
- automatic registration into `go2rtc` is still a follow-up step; current version exposes the integration boundary and health checks.

