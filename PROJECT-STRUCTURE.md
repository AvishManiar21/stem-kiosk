# Project Structure

This document describes the improved project structure of the STEM Discovery Kiosk.

```
stem-kiosk/
├── frontend/                 # Frontend application files
│   ├── index.html           # Main HTML file
│   ├── scripts/             # JavaScript files
│   │   ├── app.js          # Main application logic
│   │   └── modules/        # Game/activity modules
│   │       ├── stem2048.js
│   │       ├── missionQuiz.js
│   │       ├── pdfViewer.js
│   │       ├── massiveQuestionLoader.js
│   │       └── massiveQuestionsDatabase.js
│   ├── styles/              # CSS files
│   │   └── main.css
│   ├── assets/              # Static assets
│   │   ├── banners/         # Banner images
│   │   └── icons/           # Icon files
│   ├── images/              # Image assets
│   │   └── screensaver/     # Screensaver/attract-mode images only (no fallback)
│   └── ms team instructions.pdf  # PDF resources
│
├── backend/                 # Server files
│   └── server.py           # Python HTTP server
│
├── setup/                   # Setup and utility scripts
│   ├── start-server.sh     # Server launcher (from setup/)
│   ├── start-server-gitbash.sh
│   ├── restart_kiosk.sh    # Kiosk restart script
│   ├── cleanup-kiosk.sh    # Cleanup utility
│   ├── check-conflicts.sh  # Conflict checker
│   ├── create-auto-start-service.sh
│   └── pi/                 # Raspberry Pi specific scripts
│       ├── setup_pi_kiosk.sh
│       ├── pi-auto-start.sh
│       └── pi-quick-restart.sh
│
├── docs/                    # Documentation
│   ├── RUN.md              # Running instructions
│   ├── MULTIPORT-USAGE.md  # Multi-port server guide
│   └── GITBASH-RUN.md      # Git Bash specific guide
│
├── resources/               # Additional resources
│   ├── ms team instructions.pdf
│   └── restart_kiosk.desktop
│
├── start-server.sh          # Root-level server launcher (convenience)
├── start-server.bat         # Windows batch launcher
├── README.md               # Main project documentation
└── PROJECT-STRUCTURE.md    # This file
```

## Directory Purposes

### `frontend/`
Contains all client-side code and assets:
- HTML, CSS, JavaScript
- Game modules and activity code
- Images, icons, banners
- Resources served directly to the browser

### `backend/`
Contains server-side code:
- Python HTTP server
- API endpoints
- File serving logic

### `setup/`
Contains setup and utility scripts:
- Server launchers
- Raspberry Pi setup scripts
- Maintenance utilities

### `docs/`
Contains documentation:
- Usage guides
- Setup instructions
- Platform-specific guides

### `resources/`
Contains additional resources:
- PDF files
- Desktop shortcuts
- Other static resources

## File Paths

### Server Configuration
- Server serves from: `frontend/` directory
- Server file location: `backend/server.py`
- Root launcher: `start-server.sh` or `start-server.bat`

### Frontend Paths
- Main entry: `frontend/index.html`
- Scripts: `frontend/scripts/`
- Styles: `frontend/styles/`
- Assets: `frontend/assets/`

### Module Imports
All module imports in `app.js` use relative paths:
- `./modules/stem2048.js`
- `./modules/missionQuiz.js`
- etc.

## Running the Server

### From Root (Recommended)
```bash
python backend/server.py
```

Or use the convenience scripts:
```bash
# Linux/Mac/Git Bash
./start-server.sh

# Windows
start-server.bat
```

### From Setup Folder
```bash
cd setup
./start-server.sh
```

## Benefits of This Structure

1. **Separation of Concerns**: Frontend and backend are clearly separated
2. **Organization**: Related files are grouped logically
3. **Maintainability**: Easy to find and update specific components
4. **Scalability**: Easy to add new features in appropriate directories
5. **Clarity**: Clear purpose for each directory

