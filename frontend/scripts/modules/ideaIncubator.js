// Idea Incubator Module
export function mount(container) {
    let ideas = [];

    function init() {
        // Load saved ideas from localStorage
        ideas = JSON.parse(localStorage.getItem('stem-ideas') || '[]');

        container.innerHTML = `
      <div class="idea-incubator">
        <!-- Header -->
        <div class="incubator__header">
          <h1>💡 Idea Incubator</h1>
          <p>Share your brilliant STEM ideas and inventions!</p>
          <button class="incubator__close" id="incubatorClose">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Main Content -->
        <div class="incubator__content">
          <!-- Submit New Idea Section -->
          <div class="incubator__submit-section">
            <h2>✨ Submit Your Idea</h2>
            <button class="btn-submit-idea" id="btnSubmitIdea">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              <span>Add New Idea</span>
            </button>
          </div>

          <!-- Filter/Sort Options -->
          <div class="incubator__filters">
            <button class="filter-btn filter-btn--active" data-filter="all">All Ideas</button>
            <button class="filter-btn" data-filter="popular">Most Popular</button>
            <button class="filter-btn" data-filter="recent">Most Recent</button>
          </div>

          <!-- Ideas Grid -->
          <div class="incubator__grid" id="ideasGrid">
            <!-- Ideas will be rendered here -->
          </div>
        </div>
      </div>
    `;

        setupEventListeners();
        renderIdeas('all');
    }

    function setupEventListeners() {
        // Close button
        const closeBtn = document.getElementById('incubatorClose');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                const backBtn = document.getElementById('backBtn');
                if (backBtn) backBtn.click();
            });
        }

        // Submit idea button
        const submitBtn = document.getElementById('btnSubmitIdea');
        if (submitBtn) {
            submitBtn.addEventListener('click', showSubmitDialog);
        }

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.currentTarget.dataset.filter;
                document.querySelectorAll('.filter-btn').forEach(b =>
                    b.classList.remove('filter-btn--active')
                );
                e.currentTarget.classList.add('filter-btn--active');
                renderIdeas(filter);
            });
        });
    }

    let currentKeyboardInput = null;

    function showSubmitDialog() {
        const dialogHTML = `
            <div class="idea-dialog-overlay" id="ideaDialogOverlay">
                <div class="idea-dialog">
                    <div class="idea-dialog__header">
                        <h2>💡 Share Your Idea</h2>
                        <button class="idea-dialog__close" id="ideaDialogClose">×</button>
                    </div>
                    <div class="idea-dialog__body">
                        <div class="idea-input-group">
                            <label>Idea Title:</label>
                            <div class="input-with-keyboard">
                                <input type="text" id="ideaTitle" class="idea-input" placeholder="e.g., Solar-Powered Water Filter" maxlength="50" readonly />
                                <button class="keyboard-trigger-btn" data-target="ideaTitle">⌨️</button>
                            </div>
                        </div>
                        <div class="idea-input-group">
                            <label>Description:</label>
                            <div class="input-with-keyboard">
                                <textarea id="ideaDescription" class="idea-textarea" placeholder="Describe your idea..." maxlength="200" rows="4" readonly></textarea>
                                <button class="keyboard-trigger-btn" data-target="ideaDescription">⌨️</button>
                            </div>
                        </div>
                        <div class="idea-input-group">
                            <label>Your Name (optional):</label>
                            <div class="input-with-keyboard">
                                <input type="text" id="ideaAuthor" class="idea-input" placeholder="Anonymous" maxlength="30" readonly />
                                <button class="keyboard-trigger-btn" data-target="ideaAuthor">⌨️</button>
                            </div>
                        </div>
                        <div class="idea-input-group">
                            <label>Category:</label>
                            <select id="ideaCategory" class="idea-select">
                                <option value="invention">💡 Invention</option>
                                <option value="experiment">🔬 Experiment</option>
                                <option value="project">🛠️ Project</option>
                                <option value="question">❓ Question</option>
                                <option value="other">✨ Other</option>
                            </select>
                        </div>
                    </div>
                    <div class="idea-dialog__footer">
                        <button class="idea-btn idea-btn--cancel" id="ideaCancel">Cancel</button>
                        <button class="idea-btn idea-btn--submit" id="ideaSubmit">🚀 Submit Idea</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', dialogHTML);

        // Event listeners for dialog
        document.getElementById('ideaDialogClose').addEventListener('click', closeSubmitDialog);
        document.getElementById('ideaCancel').addEventListener('click', closeSubmitDialog);
        document.getElementById('ideaSubmit').addEventListener('click', submitIdea);

        // Keyboard trigger buttons
        document.querySelectorAll('.keyboard-trigger-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = btn.dataset.target;
                const input = document.getElementById(targetId);
                showOnScreenKeyboard(input);
            });
        });
    }

    function showOnScreenKeyboard(inputElement) {
        currentKeyboardInput = inputElement;
        const currentValue = inputElement.value || '';
        
        const keyboardHTML = `
            <div class="keyboard-overlay" id="keyboardOverlay">
                <div class="keyboard-dialog">
                    <div class="keyboard-dialog__header">
                        <h2>⌨️ Type Here</h2>
                        <button class="keyboard-dialog__close" id="keyboardClose">×</button>
                    </div>
                    <div class="keyboard-dialog__body">
                        <div class="keyboard-input-group">
                            <textarea id="keyboardInput" class="keyboard-input" rows="3">${currentValue}</textarea>
                        </div>
                        <div class="on-screen-keyboard">
                            <div class="keyboard-row">
                                <button class="key-btn" data-key="1">1</button>
                                <button class="key-btn" data-key="2">2</button>
                                <button class="key-btn" data-key="3">3</button>
                                <button class="key-btn" data-key="4">4</button>
                                <button class="key-btn" data-key="5">5</button>
                                <button class="key-btn" data-key="6">6</button>
                                <button class="key-btn" data-key="7">7</button>
                                <button class="key-btn" data-key="8">8</button>
                                <button class="key-btn" data-key="9">9</button>
                                <button class="key-btn" data-key="0">0</button>
                            </div>
                            <div class="keyboard-row">
                                <button class="key-btn" data-key="q">Q</button>
                                <button class="key-btn" data-key="w">W</button>
                                <button class="key-btn" data-key="e">E</button>
                                <button class="key-btn" data-key="r">R</button>
                                <button class="key-btn" data-key="t">T</button>
                                <button class="key-btn" data-key="y">Y</button>
                                <button class="key-btn" data-key="u">U</button>
                                <button class="key-btn" data-key="i">I</button>
                                <button class="key-btn" data-key="o">O</button>
                                <button class="key-btn" data-key="p">P</button>
                            </div>
                            <div class="keyboard-row">
                                <button class="key-btn" data-key="a">A</button>
                                <button class="key-btn" data-key="s">S</button>
                                <button class="key-btn" data-key="d">D</button>
                                <button class="key-btn" data-key="f">F</button>
                                <button class="key-btn" data-key="g">G</button>
                                <button class="key-btn" data-key="h">H</button>
                                <button class="key-btn" data-key="j">J</button>
                                <button class="key-btn" data-key="k">K</button>
                                <button class="key-btn" data-key="l">L</button>
                            </div>
                            <div class="keyboard-row">
                                <button class="key-btn" data-key="z">Z</button>
                                <button class="key-btn" data-key="x">X</button>
                                <button class="key-btn" data-key="c">C</button>
                                <button class="key-btn" data-key="v">V</button>
                                <button class="key-btn" data-key="b">B</button>
                                <button class="key-btn" data-key="n">N</button>
                                <button class="key-btn" data-key="m">M</button>
                                <button class="key-btn key-btn--backspace" data-key="backspace">⌫</button>
                            </div>
                            <div class="keyboard-row">
                                <button class="key-btn key-btn--wide" data-key=" ">SPACE</button>
                            </div>
                        </div>
                    </div>
                    <div class="keyboard-dialog__footer">
                        <button class="keyboard-btn keyboard-btn--cancel" id="keyboardCancel">Cancel</button>
                        <button class="keyboard-btn keyboard-btn--save" id="keyboardSave">✓ Done</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', keyboardHTML);

        const keyboardInputField = document.getElementById('keyboardInput');
        
        // Key button handlers
        document.querySelectorAll('.key-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.dataset.key;
                if (key === 'backspace') {
                    keyboardInputField.value = keyboardInputField.value.slice(0, -1);
                } else {
                    keyboardInputField.value += key;
                }
                keyboardInputField.focus();
            });
        });

        // Close and save handlers
        document.getElementById('keyboardClose').addEventListener('click', closeKeyboard);
        document.getElementById('keyboardCancel').addEventListener('click', closeKeyboard);
        document.getElementById('keyboardSave').addEventListener('click', () => {
            if (currentKeyboardInput) {
                currentKeyboardInput.value = keyboardInputField.value;
            }
            closeKeyboard();
        });

        keyboardInputField.focus();
    }

    function closeKeyboard() {
        const overlay = document.getElementById('keyboardOverlay');
        if (overlay) overlay.remove();
        currentKeyboardInput = null;
    }

    function showEditDialog(ideaId) {
        const idea = ideas.find(i => i.id === ideaId);
        if (!idea) return;

        const dialogHTML = `
            <div class="idea-dialog-overlay" id="ideaEditDialogOverlay">
                <div class="idea-dialog">
                    <div class="idea-dialog__header">
                        <h2>✏️ Edit Your Idea</h2>
                        <button class="idea-dialog__close" id="ideaEditDialogClose">×</button>
                    </div>
                    <div class="idea-dialog__body">
                        <div class="idea-input-group">
                            <label>Idea Title:</label>
                            <div class="input-with-keyboard">
                                <input type="text" id="editIdeaTitle" class="idea-input" value="${escapeHtml(idea.title)}" maxlength="50" readonly />
                                <button class="keyboard-trigger-btn" data-target="editIdeaTitle">⌨️</button>
                            </div>
                        </div>
                        <div class="idea-input-group">
                            <label>Description:</label>
                            <div class="input-with-keyboard">
                                <textarea id="editIdeaDescription" class="idea-textarea" maxlength="200" rows="4" readonly>${escapeHtml(idea.description)}</textarea>
                                <button class="keyboard-trigger-btn" data-target="editIdeaDescription">⌨️</button>
                            </div>
                        </div>
                        <div class="idea-input-group">
                            <label>Your Name (optional):</label>
                            <div class="input-with-keyboard">
                                <input type="text" id="editIdeaAuthor" class="idea-input" value="${escapeHtml(idea.author)}" maxlength="30" readonly />
                                <button class="keyboard-trigger-btn" data-target="editIdeaAuthor">⌨️</button>
                            </div>
                        </div>
                        <div class="idea-input-group">
                            <label>Category:</label>
                            <select id="editIdeaCategory" class="idea-select">
                                <option value="invention" ${idea.category === 'invention' ? 'selected' : ''}>💡 Invention</option>
                                <option value="experiment" ${idea.category === 'experiment' ? 'selected' : ''}>🔬 Experiment</option>
                                <option value="project" ${idea.category === 'project' ? 'selected' : ''}>🛠️ Project</option>
                                <option value="question" ${idea.category === 'question' ? 'selected' : ''}>❓ Question</option>
                                <option value="other" ${idea.category === 'other' ? 'selected' : ''}>✨ Other</option>
                            </select>
                        </div>
                    </div>
                    <div class="idea-dialog__footer">
                        <button class="idea-btn idea-btn--cancel" id="editIdeaCancel">Cancel</button>
                        <button class="idea-btn idea-btn--submit" id="editIdeaSubmit">💾 Save Changes</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', dialogHTML);

        // Event listeners for edit dialog
        document.getElementById('ideaEditDialogClose').addEventListener('click', closeEditDialog);
        document.getElementById('editIdeaCancel').addEventListener('click', closeEditDialog);
        document.getElementById('editIdeaSubmit').addEventListener('click', () => updateIdea(ideaId));

        // Keyboard trigger buttons
        document.querySelectorAll('#ideaEditDialogOverlay .keyboard-trigger-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = btn.dataset.target;
                const input = document.getElementById(targetId);
                showOnScreenKeyboard(input);
            });
        });
    }

    function closeEditDialog() {
        const overlay = document.getElementById('ideaEditDialogOverlay');
        if (overlay) overlay.remove();
    }

    function updateIdea(ideaId) {
        const title = document.getElementById('editIdeaTitle').value.trim();
        const description = document.getElementById('editIdeaDescription').value.trim();
        const author = document.getElementById('editIdeaAuthor').value.trim() || 'Anonymous';
        const category = document.getElementById('editIdeaCategory').value;

        if (!title || !description) {
            alert('Please fill in both title and description!');
            return;
        }

        const idea = ideas.find(i => i.id === ideaId);
        if (idea) {
            idea.title = title;
            idea.description = description;
            idea.author = author;
            idea.category = category;
            localStorage.setItem('stem-ideas', JSON.stringify(ideas));
        }

        closeEditDialog();
        showSuccessMessage('✅ Idea updated successfully!');
        
        // Re-render with current filter
        const activeFilter = document.querySelector('.filter-btn--active');
        const filter = activeFilter ? activeFilter.dataset.filter : 'all';
        renderIdeas(filter);
    }

    function showDeleteConfirmation(ideaId) {
        const idea = ideas.find(i => i.id === ideaId);
        if (!idea) return;

        const confirmHTML = `
            <div class="idea-dialog-overlay" id="deleteConfirmOverlay">
                <div class="idea-dialog idea-dialog--small">
                    <div class="idea-dialog__header idea-dialog__header--danger">
                        <h2>🗑️ Delete Idea?</h2>
                        <button class="idea-dialog__close" id="deleteConfirmClose">×</button>
                    </div>
                    <div class="idea-dialog__body">
                        <p class="confirm-message">Are you sure you want to delete this idea?</p>
                        <div class="confirm-idea-preview">
                            <h4>${escapeHtml(idea.title)}</h4>
                            <p>${escapeHtml(idea.description)}</p>
                        </div>
                        <p class="confirm-warning">⚠️ This action cannot be undone!</p>
                    </div>
                    <div class="idea-dialog__footer">
                        <button class="idea-btn idea-btn--cancel" id="deleteCancel">Cancel</button>
                        <button class="idea-btn idea-btn--danger" id="deleteConfirm">🗑️ Delete</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', confirmHTML);

        document.getElementById('deleteConfirmClose').addEventListener('click', closeDeleteConfirmation);
        document.getElementById('deleteCancel').addEventListener('click', closeDeleteConfirmation);
        document.getElementById('deleteConfirm').addEventListener('click', () => deleteIdea(ideaId));
    }

    function closeDeleteConfirmation() {
        const overlay = document.getElementById('deleteConfirmOverlay');
        if (overlay) overlay.remove();
    }

    function deleteIdea(ideaId) {
        ideas = ideas.filter(i => i.id !== ideaId);
        localStorage.setItem('stem-ideas', JSON.stringify(ideas));

        closeDeleteConfirmation();
        showSuccessMessage('🗑️ Idea deleted successfully!');
        
        // Re-render with current filter
        const activeFilter = document.querySelector('.filter-btn--active');
        const filter = activeFilter ? activeFilter.dataset.filter : 'all';
        renderIdeas(filter);
    }

    function closeSubmitDialog() {
        const overlay = document.getElementById('ideaDialogOverlay');
        if (overlay) overlay.remove();
    }

    function submitIdea() {
        const title = document.getElementById('ideaTitle').value.trim();
        const description = document.getElementById('ideaDescription').value.trim();
        const author = document.getElementById('ideaAuthor').value.trim() || 'Anonymous';
        const category = document.getElementById('ideaCategory').value;

        if (!title || !description) {
            alert('Please fill in both title and description!');
            return;
        }

        const newIdea = {
            id: Date.now(),
            title,
            description,
            author,
            category,
            likes: 0,
            timestamp: new Date().toISOString()
        };

        ideas.push(newIdea);
        localStorage.setItem('stem-ideas', JSON.stringify(ideas));

        closeSubmitDialog();
        showSuccessMessage('✅ Your idea has been submitted!');
        renderIdeas('all');
    }

    function renderIdeas(filter) {
        const grid = document.getElementById('ideasGrid');
        if (!grid) return;

        let filteredIdeas = [...ideas];

        // Apply filter
        if (filter === 'popular') {
            filteredIdeas.sort((a, b) => b.likes - a.likes);
        } else if (filter === 'recent') {
            filteredIdeas.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        } else {
            // 'all' - sort by most recent
            filteredIdeas.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        }

        if (filteredIdeas.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state__icon">💡</div>
                    <h3>No Ideas Yet!</h3>
                    <p>Be the first to share a brilliant STEM idea!</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filteredIdeas.map(idea => `
            <div class="idea-card" data-id="${idea.id}">
                <div class="idea-card__header">
                    <span class="idea-category idea-category--${idea.category}">${getCategoryIcon(idea.category)} ${idea.category}</span>
                    <span class="idea-date">${formatDate(idea.timestamp)}</span>
                </div>
                <h3 class="idea-title">${escapeHtml(idea.title)}</h3>
                <p class="idea-description">${escapeHtml(idea.description)}</p>
                <div class="idea-card__footer">
                    <span class="idea-author">by ${escapeHtml(idea.author)}</span>
                    <div class="idea-actions">
                        <button class="idea-like-btn ${idea.liked ? 'idea-like-btn--liked' : ''}" data-id="${idea.id}">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="${idea.liked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <span>${idea.likes}</span>
                        </button>
                        <button class="idea-edit-btn" data-id="${idea.id}" title="Edit">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="idea-delete-btn" data-id="${idea.id}" title="Delete">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add like button event listeners
        grid.querySelectorAll('.idea-like-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const ideaId = parseInt(btn.dataset.id);
                toggleLike(ideaId);
            });
        });

        // Add edit button event listeners
        grid.querySelectorAll('.idea-edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const ideaId = parseInt(btn.dataset.id);
                showEditDialog(ideaId);
            });
        });

        // Add delete button event listeners
        grid.querySelectorAll('.idea-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const ideaId = parseInt(btn.dataset.id);
                showDeleteConfirmation(ideaId);
            });
        });
    }

    function toggleLike(ideaId) {
        const idea = ideas.find(i => i.id === ideaId);
        if (!idea) return;

        if (idea.liked) {
            idea.likes--;
            idea.liked = false;
        } else {
            idea.likes++;
            idea.liked = true;
        }

        localStorage.setItem('stem-ideas', JSON.stringify(ideas));

        // Re-render with current filter
        const activeFilter = document.querySelector('.filter-btn--active');
        const filter = activeFilter ? activeFilter.dataset.filter : 'all';
        renderIdeas(filter);
    }

    function getCategoryIcon(category) {
        const icons = {
            invention: '💡',
            experiment: '🔬',
            project: '🛠️',
            question: '❓',
            other: '✨'
        };
        return icons[category] || '✨';
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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

    function destroy() {
        // Cleanup if needed
    }

    init();
    return { destroy };
}
