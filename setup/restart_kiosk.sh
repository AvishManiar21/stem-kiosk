#!/bin/bash
# STEM Kiosk - Browser launcher with watchdog
# Launches Chromium in kiosk mode and monitors for crashes

export DISPLAY="${DISPLAY:-:0}"

# Find Chromium
CHROMIUM_BIN="$(command -v chromium-browser || command -v chromium || command -v chromium-browser-stable || true)"
if [[ -z "${CHROMIUM_BIN}" ]]; then
  echo "ERROR: Chromium is not installed."
  exit 1
fi

# Kill existing processes
echo "Cleaning up existing processes..."
pkill -f "chromium.*localhost:8000" 2>/dev/null || true
pkill -f unclutter 2>/dev/null || true
sleep 1

# Disable screen blanking
echo "Disabling screen blanking..."
xset s off 2>/dev/null || true
xset -dpms 2>/dev/null || true
xset s noblank 2>/dev/null || true

# Hide cursor
echo "Hiding cursor..."
unclutter -display :0 -idle 0.5 -root &

# Kill notification daemons
pkill -f notification-daemon 2>/dev/null || true
pkill -f dunst 2>/dev/null || true

# Wait for server to be ready (avoid localhost error on Pi after restart)
SERVER_URL="http://localhost:8000"
echo "Waiting for server..."
MAX_WAIT=90
WAITED=0
until curl -fsS --max-time 2 "${SERVER_URL}" >/dev/null 2>&1; do
  sleep 2
  WAITED=$((WAITED + 2))
  if [[ ${WAITED} -ge ${MAX_WAIT} ]]; then
    echo "WARNING: Server not responding after ${MAX_WAIT}s - check: sudo systemctl status stem-kiosk.service"
    echo "Launching browser anyway; reload the page once the server is up."
    break
  fi
  echo "  ... waiting for kiosk server (${WAITED}s)"
done
echo "Server ready."

# Launch browser function
launch_browser() {
  echo "Launching Chromium in kiosk mode..."
  "${CHROMIUM_BIN}" \
    --app=http://localhost:8000 \
    --kiosk \
    --start-fullscreen \
    --disable-pinch \
    --overscroll-history-navigation=0 \
    --noerrdialogs \
    --disable-infobars \
    --disable-translate \
    --disable-notifications \
    --disable-default-apps \
    --no-first-run \
    --no-default-browser-check \
    --password-store=basic \
    --disable-session-crashed-bubble \
    --disable-restore-session-state \
    --memory-pressure-off \
    --check-for-update-interval=31536000 \
    &
  BROWSER_PID=$!
  echo "Browser started (PID: $BROWSER_PID)"
}

# Initial launch
launch_browser

# Watchdog loop - restart browser if it crashes
echo "Watchdog active..."
while true; do
  sleep 5
  if ! pgrep -f "chromium.*localhost:8000" > /dev/null; then
    echo "$(date): Browser crashed, restarting..."
    sleep 2
    launch_browser
  fi
done
