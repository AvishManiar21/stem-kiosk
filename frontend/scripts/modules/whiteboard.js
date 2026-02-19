// Whiteboard module for drawing and notes

export function mount(container) {
    let isDrawing = false;
    let currentColor = '#000000';
    let currentTool = 'pen';
    let lineWidth = 3;
    let lineStyle = 'solid'; // solid, dashed, dotted, dashdot
    let canvas, ctx;
    let lastX = 0;
    let lastY = 0;
    let isSidebarCollapsed = false;

    function init() {
        container.innerHTML = `
      <div class="whiteboard">
        <!-- Sidebar Toolbar -->
        <div class="whiteboard__sidebar" id="whiteboardSidebar">
          <div class="whiteboard__sidebar-header">
            <h3>🎨 Tools</h3>
          </div>
          <button class="sidebar__toggle" id="sidebarToggle" aria-label="Toggle sidebar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div class="whiteboard__sidebar-content">
            <!-- Drawing Tools -->
            <div class="sidebar__section">
              <label class="sidebar__label">Drawing</label>
              <button class="whiteboard__tool whiteboard__tool--active" data-tool="pen">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 19l7-7 3 3-7 7-3-3z"/>
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                </svg>
                <span>Pen</span>
              </button>
              <button class="whiteboard__tool" data-tool="eraser">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 20H7L3 16l10-10 7 7-4 4"/>
                </svg>
                <span>Eraser</span>
              </button>
            </div>

            <!-- Colors -->
            <div class="sidebar__section">
              <label class="sidebar__label">Colors</label>
              <div class="whiteboard__colors">
                <button class="whiteboard__color whiteboard__color--active" data-color="#000000" style="background: #000000" title="Black"></button>
                <button class="whiteboard__color" data-color="#ff0000" style="background: #ff0000" title="Red"></button>
                <button class="whiteboard__color" data-color="#00ff00" style="background: #00ff00" title="Green"></button>
                <button class="whiteboard__color" data-color="#0000ff" style="background: #0000ff" title="Blue"></button>
                <button class="whiteboard__color" data-color="#ffff00" style="background: #ffff00" title="Yellow"></button>
                <button class="whiteboard__color" data-color="#ff00ff" style="background: #ff00ff" title="Magenta"></button>
                <button class="whiteboard__color" data-color="#00ffff" style="background: #00ffff" title="Cyan"></button>
                <button class="whiteboard__color" data-color="#ffffff" style="background: #ffffff; border: 2px solid #ccc" title="White"></button>
              </div>
            </div>

            <!-- Brush Size -->
            <div class="sidebar__section">
              <label class="sidebar__label">Size: <span id="sizeValue">3</span>px</label>
              <input type="range" id="lineWidth" min="1" max="20" value="3" class="size-slider">
            </div>

            <!-- Line Style -->
            <div class="sidebar__section">
              <label class="sidebar__label">Line Style</label>
              <div class="whiteboard__line-styles">
                <button class="whiteboard__line-style whiteboard__line-style--active" data-style="solid" title="Solid">
                  <svg width="60" height="20" viewBox="0 0 60 20">
                    <line x1="5" y1="10" x2="55" y2="10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
                  </svg>
                </button>
                <button class="whiteboard__line-style" data-style="dashed" title="Dashed">
                  <svg width="60" height="20" viewBox="0 0 60 20">
                    <line x1="5" y1="10" x2="55" y2="10" stroke="currentColor" stroke-width="3" stroke-dasharray="10,5" stroke-linecap="round"/>
                  </svg>
                </button>
                <button class="whiteboard__line-style" data-style="dotted" title="Dotted">
                  <svg width="60" height="20" viewBox="0 0 60 20">
                    <line x1="5" y1="10" x2="55" y2="10" stroke="currentColor" stroke-width="3" stroke-dasharray="2,5" stroke-linecap="round"/>
                  </svg>
                </button>
                <button class="whiteboard__line-style" data-style="dashdot" title="Dash-Dot">
                  <svg width="60" height="20" viewBox="0 0 60 20">
                    <line x1="5" y1="10" x2="55" y2="10" stroke="currentColor" stroke-width="3" stroke-dasharray="10,5,2,5" stroke-linecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Actions -->
            <div class="sidebar__section sidebar__section--actions">
              <button class="sidebar__action sidebar__action--clear" data-tool="clear">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                <span>Clear All</span>
              </button>
              
              <button class="sidebar__action sidebar__action--save" id="whiteboardSave">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                <span>Save</span>
              </button>
              
              <button class="sidebar__action sidebar__action--gallery" id="whiteboardGallery">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span>My Boards</span>
              </button>
              
              <button class="sidebar__action sidebar__action--close" id="whiteboardClose">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Canvas Area -->
        <div class="whiteboard__canvas-wrapper">
          <canvas id="whiteboardCanvas"></canvas>
        </div>
      </div>
    `;

        canvas = document.getElementById('whiteboardCanvas');
        ctx = canvas.getContext('2d', { willReadFrequently: false });

        // Initial resize
        resizeCanvas();

        // Handle window resize
        window.addEventListener('resize', resizeCanvas);

        setupEventListeners();
    }

    // Dynamically set canvas size (moved outside init for accessibility)
    function resizeCanvas() {
        const wrapper = document.querySelector('.whiteboard__canvas-wrapper');
        if (wrapper) {
            // Save current drawing
            const imageData = canvas.toDataURL();

            canvas.width = wrapper.clientWidth;
            canvas.height = wrapper.clientHeight;

            // Restore white background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Restore saved drawing
            if (imageData && imageData !== 'data:,') {
                const img = new Image();
                img.onload = () => {
                    ctx.drawImage(img, 0, 0);
                    setupCanvasContext();
                };
                img.src = imageData;
            } else {
                setupCanvasContext();
            }
        }
    }

    function setupCanvasContext() {
        // Set all context properties for smooth drawing
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = currentColor;
        ctx.fillStyle = currentColor;
        ctx.setLineDash([]); // Ensure solid lines (no dashes)
    }

    function setupEventListeners() {
        // Toggle button for collapsing/expanding sidebar
        const toggleBtn = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('whiteboardSidebar');
        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', () => {
                isSidebarCollapsed = !isSidebarCollapsed;
                if (isSidebarCollapsed) {
                    sidebar.classList.add('whiteboard__sidebar--collapsed');
                } else {
                    sidebar.classList.remove('whiteboard__sidebar--collapsed');
                }
                // Resize canvas after sidebar changes
                setTimeout(resizeCanvas, 100);
            });
        }

        // Close button - triggers the back button in the activity view
        const closeBtn = document.getElementById('whiteboardClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                // Trigger the back button click
                const backBtn = document.getElementById('backBtn');
                if (backBtn) {
                    backBtn.click();
                }
            });
        }

        // Save button
        const saveBtn = document.getElementById('whiteboardSave');
        if (saveBtn) {
            saveBtn.addEventListener('click', saveWhiteboard);
        }

        // Gallery button
        const galleryBtn = document.getElementById('whiteboardGallery');
        if (galleryBtn) {
            galleryBtn.addEventListener('click', showGallery);
        }

        // Clear All button (in sidebar actions)
        const clearBtn = document.querySelector('.sidebar__action--clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', clearCanvas);
        }

        // Tool buttons (Pen, Eraser)
        document.querySelectorAll('.whiteboard__tool').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tool = e.currentTarget.dataset.tool;

                currentTool = tool;
                document.querySelectorAll('.whiteboard__tool').forEach(b =>
                    b.classList.remove('whiteboard__tool--active')
                );
                e.currentTarget.classList.add('whiteboard__tool--active');
            });
        });

        // Color buttons
        document.querySelectorAll('.whiteboard__color').forEach(btn => {
            btn.addEventListener('click', (e) => {
                currentColor = e.target.dataset.color;
                document.querySelectorAll('.whiteboard__color').forEach(b =>
                    b.classList.remove('whiteboard__color--active')
                );
                e.target.classList.add('whiteboard__color--active');
            });
        });

        // Line width slider
        const lineWidthSlider = document.getElementById('lineWidth');
        const sizeValue = document.getElementById('sizeValue');
        lineWidthSlider.addEventListener('input', (e) => {
            lineWidth = e.target.value;
            sizeValue.textContent = lineWidth;
        });

        // Line style buttons
        document.querySelectorAll('.whiteboard__line-style').forEach(btn => {
            btn.addEventListener('click', (e) => {
                lineStyle = e.currentTarget.dataset.style;
                document.querySelectorAll('.whiteboard__line-style').forEach(b =>
                    b.classList.remove('whiteboard__line-style--active')
                );
                e.currentTarget.classList.add('whiteboard__line-style--active');
            });
        });

        // Mouse/Touch/Pointer events
        canvas.addEventListener('pointerdown', startDrawing);
        canvas.addEventListener('pointermove', draw);
        canvas.addEventListener('pointerup', stopDrawing);
        canvas.addEventListener('pointercancel', stopDrawing);
        canvas.style.touchAction = 'none'; // Prevent scrolling/zooming while drawing
    }

    let points = [];

    function startDrawing(e) {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        lastX = x;
        lastY = y;
        points = [{ x, y, pressure: e.pressure || 0.5 }];

        // Initial dot
        ctx.beginPath();
        ctx.arc(x, y, (lineWidth * (e.pressure || 0.5)) / 2, 0, Math.PI * 2);
        ctx.fillStyle = currentTool === 'eraser' ? '#ffffff' : currentColor;
        ctx.fill();
    }

    function draw(e) {
        if (!isDrawing) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Simple line drawing from last position to current position
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Apply line style
        switch (lineStyle) {
            case 'dashed':
                ctx.setLineDash([10, 5]);
                break;
            case 'dotted':
                ctx.setLineDash([2, 5]);
                break;
            case 'dashdot':
                ctx.setLineDash([10, 5, 2, 5]);
                break;
            case 'solid':
            default:
                ctx.setLineDash([]);
                break;
        }

        if (currentTool === 'eraser') {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = lineWidth * 4;
        } else {
            ctx.strokeStyle = currentColor;
            ctx.lineWidth = lineWidth;
        }

        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();

        lastX = x;
        lastY = y;
    }

    function stopDrawing() {
        isDrawing = false;
        points = [];
    }

    function clearCanvas() {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Restore canvas context properties after clearing
        setupCanvasContext();
    }

    function saveWhiteboard() {
        showKeyboardDialog();
    }

    function showKeyboardDialog() {
        const dialogHTML = `
            <div class="keyboard-overlay" id="keyboardOverlay">
                <div class="keyboard-dialog">
                    <div class="keyboard-dialog__header">
                        <h2>Save Whiteboard</h2>
                        <button class="keyboard-dialog__close" id="keyboardClose">×</button>
                    </div>
                    <div class="keyboard-dialog__body">
                        <div class="keyboard-input-group">
                            <label>Whiteboard Name:</label>
                            <input type="text" id="whiteboardName" class="keyboard-input" value="My Drawing" maxlength="30" />
                        </div>
                        <div class="keyboard-input-group">
                            <label>Your Name (optional):</label>
                            <input type="text" id="studentName" class="keyboard-input" value="" maxlength="30" />
                        </div>
                        <div class="on-screen-keyboard" id="onScreenKeyboard">
                            <div class="keyboard-row">
                                <button class="key-btn">1</button>
                                <button class="key-btn">2</button>
                                <button class="key-btn">3</button>
                                <button class="key-btn">4</button>
                                <button class="key-btn">5</button>
                                <button class="key-btn">6</button>
                                <button class="key-btn">7</button>
                                <button class="key-btn">8</button>
                                <button class="key-btn">9</button>
                                <button class="key-btn">0</button>
                            </div>
                            <div class="keyboard-row">
                                <button class="key-btn">Q</button>
                                <button class="key-btn">W</button>
                                <button class="key-btn">E</button>
                                <button class="key-btn">R</button>
                                <button class="key-btn">T</button>
                                <button class="key-btn">Y</button>
                                <button class="key-btn">U</button>
                                <button class="key-btn">I</button>
                                <button class="key-btn">O</button>
                                <button class="key-btn">P</button>
                            </div>
                            <div class="keyboard-row">
                                <button class="key-btn">A</button>
                                <button class="key-btn">S</button>
                                <button class="key-btn">D</button>
                                <button class="key-btn">F</button>
                                <button class="key-btn">G</button>
                                <button class="key-btn">H</button>
                                <button class="key-btn">J</button>
                                <button class="key-btn">K</button>
                                <button class="key-btn">L</button>
                            </div>
                            <div class="keyboard-row">
                                <button class="key-btn">Z</button>
                                <button class="key-btn">X</button>
                                <button class="key-btn">C</button>
                                <button class="key-btn">V</button>
                                <button class="key-btn">B</button>
                                <button class="key-btn">N</button>
                                <button class="key-btn">M</button>
                            </div>
                            <div class="keyboard-row">
                                <button class="key-btn key-btn--wide">Space</button>
                                <button class="key-btn key-btn--backspace">⌫</button>
                            </div>
                        </div>
                    </div>
                    <div class="keyboard-dialog__footer">
                        <button class="keyboard-btn keyboard-btn--cancel" id="keyboardCancel">Cancel</button>
                        <button class="keyboard-btn keyboard-btn--save" id="keyboardSave">💾 Save</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', dialogHTML);

        let activeInput = document.getElementById('whiteboardName');
        activeInput.focus();

        // Input focus handling
        document.getElementById('whiteboardName').addEventListener('focus', function () {
            activeInput = this;
        });
        document.getElementById('studentName').addEventListener('focus', function () {
            activeInput = this;
        });

        // Keyboard button clicks
        document.querySelectorAll('.key-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default browser actions
                const key = btn.textContent;
                if (key === 'Space') {
                    activeInput.value += ' ';
                } else if (key === '⌫') {
                    activeInput.value = activeInput.value.slice(0, -1);
                } else {
                    activeInput.value += key;
                }
                activeInput.focus();
            });
        });

        // Close and Cancel buttons
        document.getElementById('keyboardClose').addEventListener('click', closeKeyboardDialog);
        document.getElementById('keyboardCancel').addEventListener('click', closeKeyboardDialog);

        // Save button
        document.getElementById('keyboardSave').addEventListener('click', () => {
            const name = document.getElementById('whiteboardName').value.trim() || 'My Drawing';
            const studentName = document.getElementById('studentName').value.trim() || 'Anonymous';

            // Convert canvas to image
            const imageData = canvas.toDataURL('image/png');

            // Get existing saved boards
            const savedBoards = JSON.parse(localStorage.getItem('saved-whiteboards') || '[]');

            // Add new board
            savedBoards.push({
                id: Date.now(),
                name,
                studentName,
                imageData,
                timestamp: new Date().toISOString()
            });

            // Save to localStorage
            localStorage.setItem('saved-whiteboards', JSON.stringify(savedBoards));

            closeKeyboardDialog();

            // Show success message
            showSuccessMessage(`✅ "${name}" saved successfully!`);
        });
    }

    function closeKeyboardDialog() {
        const overlay = document.getElementById('keyboardOverlay');
        if (overlay) overlay.remove();
    }

    function showSuccessMessage(message) {
        const msgHTML = `
            <div class="success-toast" id="successToast">
                ${message}
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', msgHTML);
        setTimeout(() => {
            const toast = document.getElementById('successToast');
            if (toast) toast.remove();
        }, 3000);
    }

    function showGallery() {
        const savedBoards = JSON.parse(localStorage.getItem('saved-whiteboards') || '[]');

        if (savedBoards.length === 0) {
            alert('No saved whiteboards yet. Create and save your first drawing!');
            return;
        }

        // Create gallery overlay
        const galleryHTML = `
            <div class="whiteboard-gallery-overlay" id="galleryOverlay">
                <div class="whiteboard-gallery">
                    <div class="whiteboard-gallery__header">
                        <h2>My Saved Whiteboards</h2>
                        <button class="whiteboard-gallery__close" id="galleryClose">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div class="whiteboard-gallery__grid">
                        ${savedBoards.reverse().map(board => `
                            <div class="whiteboard-gallery__item" data-id="${board.id}">
                                <img src="${board.imageData}" alt="${board.name}">
                                <div class="whiteboard-gallery__info">
                                    <h3>${board.name}</h3>
                                    <p>${board.studentName} • ${new Date(board.timestamp).toLocaleDateString()}</p>
                                </div>
                                <div class="whiteboard-gallery__actions">
                                    <button class="gallery-btn gallery-btn--load" data-id="${board.id}">
                                        📂 Load
                                    </button>
                                    <button class="gallery-btn gallery-btn--download" data-id="${board.id}">
                                        💾 Download
                                    </button>
                                    <button class="gallery-btn gallery-btn--delete" data-id="${board.id}">
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Add to DOM
        document.body.insertAdjacentHTML('beforeend', galleryHTML);

        // Event listeners
        document.getElementById('galleryClose').addEventListener('click', closeGallery);

        // Load button
        document.querySelectorAll('.gallery-btn--load').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                loadWhiteboard(id);
                closeGallery();
            });
        });

        // Download button
        document.querySelectorAll('.gallery-btn--download').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                downloadWhiteboard(id);
            });
        });

        // Delete button
        document.querySelectorAll('.gallery-btn--delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                if (confirm('Are you sure you want to delete this whiteboard?')) {
                    deleteWhiteboard(id);
                    closeGallery();
                    showGallery(); // Refresh gallery
                }
            });
        });
    }

    function closeGallery() {
        const overlay = document.getElementById('galleryOverlay');
        if (overlay) overlay.remove();
    }

    function loadWhiteboard(id) {
        const savedBoards = JSON.parse(localStorage.getItem('saved-whiteboards') || '[]');
        const board = savedBoards.find(b => b.id === id);
        if (!board) return;

        // Load image onto canvas
        const img = new Image();
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = board.imageData;
    }

    function downloadWhiteboard(id) {
        const savedBoards = JSON.parse(localStorage.getItem('saved-whiteboards') || '[]');
        const board = savedBoards.find(b => b.id === id);
        if (!board) return;

        // Create download link
        const link = document.createElement('a');
        link.download = `${board.name}.png`;
        link.href = board.imageData;
        link.click();
    }

    function deleteWhiteboard(id) {
        let savedBoards = JSON.parse(localStorage.getItem('saved-whiteboards') || '[]');
        savedBoards = savedBoards.filter(b => b.id !== id);
        localStorage.setItem('saved-whiteboards', JSON.stringify(savedBoards));
    }

    function destroy() {
        const resizeHandler = () => { }; // Placeholder if needed
        window.removeEventListener('resize', resizeHandler);

        canvas.removeEventListener('pointerdown', startDrawing);
        canvas.removeEventListener('pointermove', draw);
        canvas.removeEventListener('pointerup', stopDrawing);
        canvas.removeEventListener('pointercancel', stopDrawing);
    }

    init();

    return { destroy };
}
