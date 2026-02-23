# STEM Discovery Kiosk

Offline-first HTML5 kiosk hub for Raspberry Pi touch displays. The home screen rotates through banner slides; tapping a banner or tile launches an activity inside the kiosk shell. Everything runs locally in Chromium kiosk mode.

## Connecting to the Server

To connect to the STEM Kiosk server (172.16.74.22):

**Using the connection script (Windows with WSL):**
```bash
# Using batch file
.\connect-server.bat

# Using bash script (in Git Bash or WSL)
./connect-server.sh

# Execute commands remotely
.\connect-server.bat "ls -la"
```

**Manual SSH connection:**
```bash
# Using WSL with sshpass
wsl sshpass -p 'pi@314159' ssh stemcenter@172.16.74.22

# Or using regular SSH (password: pi@314159)
ssh stemcenter@172.16.74.22
```

The server is configured in your SSH config at `~/.ssh/config` as `172.16.74.22`.

## Getting Started

1. Serve the folder with any static web server:
   ```bash
   # With Python
   python -m http.server 8000

   # Or using npm's serve
   npx serve .
   ```
2. Open `http://localhost:8000` in Chromium (use `--kiosk --app=http://localhost:8000` for kiosk mode).
3. Touch/mouse controls are supported out of the box.

**Run the proper server (recommended):** From the project root run `python backend/server.py` or `start-server.bat`. This server is **crash-resistant**: a bad request or client disconnect won’t take it down; errors are logged and the server keeps running. If it does exit, restart it the same way.

## Deploying to Raspberry Pi

We use **SCP** to copy changed files to the Pi and **SSH** (`ssh pi-kiosk`) to run commands. Add a host alias in `~/.ssh/config`:

```
Host pi-kiosk
  HostName 172.16.74.22
  User stemcenter
```

**Deploy code and assets (frontend + backend), then restart kiosk and browser:**
```bash
# From project root. Sleep 5 so server is up before Chromium restarts (avoids localhost error).
scp backend/server.py frontend/scripts/app.js frontend/scripts/modules/*.js frontend/styles/*.css frontend/index.html pi-kiosk:~/stem-kiosk/temp/ && ssh pi-kiosk "mv ~/stem-kiosk/temp/server.py ~/stem-kiosk/backend/ && mv ~/stem-kiosk/temp/app.js ~/stem-kiosk/frontend/scripts/ && mv ~/stem-kiosk/temp/*.js ~/stem-kiosk/frontend/scripts/modules/ && mv ~/stem-kiosk/temp/*.css ~/stem-kiosk/frontend/styles/ && mv ~/stem-kiosk/temp/index.html ~/stem-kiosk/frontend/ && sudo systemctl restart stem-kiosk.service && sleep 5 && DISPLAY=:0 pkill chromium"
```

**Deploy only specific files (e.g. one or two modules):**
```bash
scp frontend/scripts/modules/snakeGame.js frontend/scripts/modules/missionQuiz.js pi-kiosk:~/stem-kiosk/temp/ && ssh pi-kiosk "mv ~/stem-kiosk/temp/*.js ~/stem-kiosk/frontend/scripts/modules/ && sudo systemctl restart stem-kiosk.service && sleep 5 && DISPLAY=:0 pkill chromium"
```

**Deploy images (e.g. new screensaver or banner images):**
```bash
scp frontend/images/screensaver/*.png pi-kiosk:~/stem-kiosk/frontend/images/screensaver/
# Or sync a whole folder:
scp -r frontend/images/screensaver/ pi-kiosk:~/stem-kiosk/frontend/images/
```

After deploy, the kiosk service restarts and Chromium reloads so the Pi shows the latest content.

### Pi: “Localhost” or “Can’t connect” error after restart

If the Pi shows **“This site can’t be reached”** or **“Connection refused”** for localhost:8000 after a reboot or after deploy, the browser is up before the web server is ready.

**1. Check that the kiosk web server is running (from your PC, in Git Bash):**
```bash
ssh pi-kiosk "sudo systemctl status stem-kiosk.service"
```
You want `Active: active (running)`.

**2. If it’s not running or failed, restart it and check logs:**
```bash
ssh pi-kiosk "sudo systemctl restart stem-kiosk.service && sleep 3 && sudo systemctl status stem-kiosk.service"
```
To see why it failed:
```bash
ssh pi-kiosk "journalctl -u stem-kiosk.service -n 30 --no-pager"
```

**3. Once the server is running, restart the browser on the Pi:**
```bash
ssh pi-kiosk "DISPLAY=:0 pkill chromium"
```
The kiosk’s watchdog will start Chromium again in a few seconds; by then the server should be ready.

**4. If the Pi just rebooted,** wait 30–60 seconds for the server and network to come up, then from the Pi (keyboard/monitor or SSH) run:
```bash
~/stem-kiosk/setup/restart_kiosk.sh
```
Or double‑click the “STEM Kiosk” shortcut on the desktop.

## Activities

- **Fusion 2048**: classic 2048 mechanics with STEM facts unlocked on merges.
- **Mission Control Quiz**: timed STEM trivia with score telemetry and mission badges.

Each activity is modular (`scripts/modules/*`). Add new games by exporting a `mount(root)` function that returns an optional `destroy()` cleanup.

## Kiosk Controls

- **Home**: return to the activity grid from any module.
- **Sound On / Muted**: toggle UI sound effects (re-initializes the audio context when re-enabled).
- **Restart Kiosk**: reloads the kiosk and returns to the home screen.
- **Exit Kiosk**: sends a request to the local kiosk server to shut down Chromium. If the browser refuses, the kiosk shows instructions (Alt+F4 or use the desktop launcher).
- **Screensaver / Attract mode**: after inactivity the kiosk shows a slideshow **only** from the `frontend/images/screensaver/` folder; any touch/key/mouse input dismisses it and resets the timer. Put your screensaver images in `images/screensaver/` so attract mode uses them (no other images are used).

## Customizing

- Update slideshow entries or tiles in `scripts/app.js`.
- Adjust kiosk theming in `styles/main.css`.
- Add content assets (audio, imagery) under `assets/` and wire them up in modules.
- Configure Chromium kiosk scripts on Raspberry Pi:
  ```bash
  chromium-browser --kiosk --app=http://localhost:8000 --disable-pinch --overscroll-history-navigation=0
  ```

## Raspberry Pi Autostart

Run everything in one shot (recommended):
```bash
sudo ./setup_pi_kiosk.sh
```
The script installs dependencies, writes the `systemd` service, registers the Chromium autostart entry using the current project path, drops a restart shortcut on the desktop, delays Chromium launch by 60 seconds, and keeps Chromium from opening until the kiosk server replies. Reboot after it completes.

Manual steps (if you prefer configuring things yourself):
1. Copy the project to the Pi (for example `/home/pi/stem-kiosk`) and install dependencies:
   ```bash
   sudo apt update
   sudo apt install -y chromium-browser python3
   ```
2. Serve the kiosk locally. Create `/home/pi/stem-kiosk/start-server.sh`:
   ```bash
   #!/usr/bin/env bash
   cd /home/pi/stem-kiosk
   exec /usr/bin/python3 /home/pi/stem-kiosk/server.py
   ```
   Make it executable: `chmod +x /home/pi/stem-kiosk/start-server.sh`.
3. Create a systemd service for the web server (`/etc/systemd/system/stem-kiosk.service`):
   ```
   [Unit]
   Description=STEM Kiosk Web Server
   After=network.target

   [Service]
   Type=simple
   ExecStart=/home/pi/stem-kiosk/start-server.sh
   WorkingDirectory=/home/pi/stem-kiosk
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```
   Enable it: `sudo systemctl enable --now stem-kiosk.service`.
4. Launch Chromium in kiosk mode on boot (with a 60-second post-boot delay). Create `~/.config/autostart/stem-kiosk.desktop`:
   ```
   [Desktop Entry]
   Type=Application
   Name=STEM Kiosk
   Exec=/home/pi/stem-kiosk/restart_kiosk.sh
   X-GNOME-Autostart-enabled=true
   ```
   (On Raspberry Pi OS Lite, create a user systemd service instead and launch Chromium with `Environment=DISPLAY=:0`.)
5. Reboot to confirm the kiosk server and Chromium auto-start. Use the new Restart/Exit buttons for quick maintenance.

## Next Steps

- Create additional STEM games (Blockly puzzles, simulations) by adding new modules.
- Build an educator admin overlay for uploading new fact decks and quiz banks.
- Add local analytics by posting activity events to a lightweight API (Flask/Express) that logs to disk.
- Harden the kiosk by monitoring the services with `systemd` or a watchdog script.
