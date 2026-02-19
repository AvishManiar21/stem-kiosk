import initBanner from "./modules/banner.js";

const activities = [
  {
    id: "stem2048",
    title: "Fusion 2048",
    module: () => import("./modules/stem2048.js"),
  },
  {
    id: "missionQuiz",
    title: "Mission Quiz",
    module: () => import("./modules/missionQuiz.js"),
  },
  {
    id: "stemTicTacToe",
    title: "Atom vs Electron",
    module: () => import("./modules/stemTicTacToe.js"),
  },
  {
    id: "snakeGame",
    title: "Snake Game",
    module: () => import("./modules/snakeGame.js"),
  },
  {
    id: "whiteboard",
    title: "Whiteboard",
    module: () => import("./modules/whiteboard.js"),
  },
  {
    id: "ideaIncubator",
    title: "Idea Incubator",
    module: () => import("./modules/ideaIncubator.js"),
  },
  {
    id: "teamsGuide",
    title: "Teams Guide",
    module: () => import("./modules/pdfViewer.js"),
    pdfUrl: "ms team instructions.pdf",
  },
];

const navigationPages = {
  leaderboard: {
    title: "Leaderboards",
    module: () => import("./modules/leaderboard.js"),
  },
  statistics: {
    title: "Statistics",
    module: () => import("./modules/statistics.js"),
  },
};

const state = { mountedActivity: null };

function initTheme() {
  const saved = localStorage.getItem("kiosk-theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("kiosk-theme", next);
}

class AudioManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }
  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled && this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
    return this.enabled;
  }
  async initContext() {
    if (!this.enabled) return;
    if (!this.ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) {
        this.enabled = false;
        return;
      }
      this.ctx = new Ctx();
      if (this.ctx.state === "suspended") await this.ctx.resume();
    }
  }
  async playTap() {
    if (!this.enabled) return;
    await this.initContext();
    if (!this.ctx) return;
    const duration = 0.1;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, this.ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }
}

const audioManager = new AudioManager();
const homeView = document.getElementById("homeView");
const activityView = document.getElementById("activityView");
const activityFrame = document.getElementById("activityFrame");
const activityTitle = document.getElementById("activityTitle");
const backBtn = document.getElementById("backBtn");
const exitActivityButton = document.getElementById("exitActivityButton");
const muteButton = document.getElementById("muteButton");
const themeToggle = document.getElementById("themeToggle");
const refreshButton = document.getElementById("refreshButton");
const clockEl = document.getElementById("clock");
const screensaverEl = document.getElementById("screensaver");
const screensaverLayer1 = document.getElementById("screensaverLayer1");
const screensaverLayer2 = document.getElementById("screensaverLayer2");
const screensaverBlur1 = document.getElementById("screensaverBlur1");
const screensaverBlur2 = document.getElementById("screensaverBlur2");
const exitOverlay = document.getElementById("exitOverlay");
const exitCancel = document.getElementById("exitCancel");

const SCREENSAVER_DELAY_MS = 1 * 60 * 1000;
const SCREENSAVER_ADVANCE_MS = 8000;
const MODE_SWITCH_DELAY_MS = 1 * 60 * 1000;
const APP_PREVIEW_ADVANCE_MS = 5000;

const screensaverState = {
  timerId: null,
  intervalId: null,
  appIntervalId: null,
  modeSwitchTimerId: null,
  active: false,
  currentMode: "images",
  index: 0,
  appIndex: 0,
  images: [],
  loading: false,
  currentLayer: 1,
  appCards: [],
};

function bindTouchClick(el, handler) {
  el.addEventListener("click", handler);
  el.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      handler(e);
    },
    { passive: false }
  );
}

function setupActivityCards() {
  document.querySelectorAll("[data-activity-id]").forEach((card) => {
    const activityId = card.dataset.activityId;
    const handler = () => openActivity(activityId);
    bindTouchClick(card, handler);
    card.addEventListener("keydown", (evt) => {
      if (evt.key === "Enter" || evt.key === " ") {
        evt.preventDefault();
        openActivity(activityId);
      }
    });
  });
}

async function openActivity(activityId) {
  await audioManager.playTap();
  const selected = activities.find((a) => a.id === activityId);
  if (!selected) return;
  if (!activityTitle || !homeView || !activityView || !activityFrame) return;
  activityTitle.textContent = selected.title;
  homeView.classList.add("hidden");
  activityView.classList.remove("hidden");
  try {
    const module = await selected.module();
    if (state.mountedActivity && typeof state.mountedActivity.destroy === "function") {
      state.mountedActivity.destroy();
    }
    if (selected.pdfUrl) {
      state.mountedActivity = module.mount(activityFrame);
      await state.mountedActivity.loadPDF(selected.pdfUrl);
    } else {
      state.mountedActivity = module.mount(activityFrame);
    }
  } catch (err) {
    console.error("Failed to load activity", err);
    activityFrame.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);font-size:1.25rem;"><p>Failed to load. Please try again.</p></div>`;
  }
}

async function openNavigationPage(pageId) {
  await audioManager.playTap();
  const page = navigationPages[pageId];
  if (!page) return;
  if (!activityTitle || !homeView || !activityView || !activityFrame) return;
  activityTitle.textContent = page.title;
  homeView.classList.add("hidden");
  activityView.classList.remove("hidden");
  try {
    const module = await page.module();
    if (state.mountedActivity && typeof state.mountedActivity.destroy === "function") {
      state.mountedActivity.destroy();
    }
    state.mountedActivity = module.mount(activityFrame);
  } catch (err) {
    console.error("Failed to load page", err);
    activityFrame.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);font-size:1.25rem;"><p>Failed to load.</p></div>`;
  }
}

function closeActivity() {
  audioManager.playTap();
  if (!homeView || !activityView || !activityFrame) return;
  if (state.mountedActivity && typeof state.mountedActivity.destroy === "function") {
    state.mountedActivity.destroy();
  }
  state.mountedActivity = null;
  activityFrame.innerHTML = "";
  activityView.classList.add("hidden");
  homeView.classList.remove("hidden");
}

function initClock() {
  if (!clockEl) return;
  function update() {
    clockEl.textContent = new Date().toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
  update();
  setInterval(update, 30000);
}

function setupControls() {
  if (!backBtn || !exitActivityButton || !muteButton) return;
  bindTouchClick(backBtn, closeActivity);
  bindTouchClick(exitActivityButton, closeActivity);
  if (themeToggle) {
    bindTouchClick(themeToggle, () => {
      toggleTheme();
      audioManager.playTap();
    });
  }
  const muteHandler = async () => {
    const enabled = audioManager.toggle();
    const svg = muteButton.querySelector("svg");
    if (enabled) {
      svg.innerHTML = `<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>`;
      await audioManager.playTap();
    } else {
      svg.innerHTML = `<path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>`;
    }
  };
  bindTouchClick(muteButton, muteHandler);
  if (refreshButton) {
    bindTouchClick(refreshButton, async () => {
      await audioManager.playTap();
      setTimeout(() => {
        if ("caches" in window) caches.keys().then((names) => names.forEach((n) => caches.delete(n)));
        window.location.reload(true);
      }, 100);
    });
  }
  if (exitCancel && exitOverlay) {
    bindTouchClick(exitCancel, () => {
      exitOverlay.classList.add("hidden");
      audioManager.playTap();
    });
  }
  document.addEventListener("keydown", (evt) => {
    if (!exitOverlay) return;
    if (evt.ctrlKey && evt.shiftKey && evt.key === "Q") {
      evt.preventDefault();
      exitOverlay.classList.remove("hidden");
    }
    if (evt.key === "Escape" && !exitOverlay.classList.contains("hidden")) {
      exitOverlay.classList.add("hidden");
    }
  });
  setupScreensaver();
}

function setupScreensaver() {
  ["mousemove", "mousedown", "keydown", "touchstart", "wheel"].forEach((evt) => {
    document.addEventListener(evt, handleUserActivity, { passive: true });
  });
  if (!screensaverEl) return;
  const screensaverTap = (e) => {
    const t = e.target;
    const isScreensaverArea =
      t === screensaverEl ||
      t.closest?.(".attract-mode__blur") ||
      t.closest?.(".attract-mode__img") ||
      t.closest?.(".attract-mode__cta") ||
      t.closest?.(".attract-mode__banner") ||
      t.closest?.(".attract-mode__simple-hint");
    if (isScreensaverArea) {
      e.preventDefault();
      handleUserActivity();
    }
  };
  screensaverEl.addEventListener("click", screensaverTap);
  screensaverEl.addEventListener("touchstart", screensaverTap, { passive: false });
  resetScreensaverTimer();
}

function resetScreensaverTimer() {
  if (screensaverState.timerId) clearTimeout(screensaverState.timerId);
  screensaverState.timerId = setTimeout(activateScreensaver, SCREENSAVER_DELAY_MS);
}

function createAppPreviewCards() {
  const appPreviewEl = document.getElementById("appPreview");
  if (!appPreviewEl) return;
  appPreviewEl.innerHTML = "";
  screensaverState.appCards = [];
  activities.forEach((activity, idx) => {
    const card = document.createElement("div");
    card.className = "attract-mode__app-card";
    card.dataset.activityId = activity.id;
    let iconColorClass = "";
    if (idx === 1 || idx === 3) iconColorClass = "attract-mode__app-icon--green";
    else if (idx === 2) iconColorClass = "attract-mode__app-icon--orange";
    else if (idx === 4 || idx === 5) iconColorClass = "attract-mode__app-icon--purple";
    else if (idx === 6) iconColorClass = "attract-mode__app-icon--yellow";
    const homeCard = document.querySelector(`[data-activity-id="${activity.id}"]`);
    let iconSvg = "";
    let description = "";
    if (homeCard) {
      const iconEl = homeCard.querySelector(".activity-card__icon svg");
      iconSvg = iconEl ? iconEl.outerHTML : "";
      const descEl = homeCard.querySelector(".activity-card__desc");
      description = descEl ? descEl.textContent : "";
    }
    card.innerHTML = `
      <div class="attract-mode__app-icon ${iconColorClass}">${iconSvg}</div>
      <h3 class="attract-mode__app-title">${activity.title}</h3>
      <p class="attract-mode__app-desc">${description}</p>
      <div class="attract-mode__app-tap-hint">Tap to play</div>
    `;
    const cardTap = (e) => {
      e.stopPropagation();
      e.preventDefault();
      deactivateScreensaver();
      openActivity(activity.id);
    };
    card.addEventListener("click", cardTap);
    card.addEventListener("touchstart", cardTap, { passive: false });
    appPreviewEl.appendChild(card);
    screensaverState.appCards.push(card);
  });
}

function updateAppPreview() {
  if (!screensaverState.appCards.length) return;
  screensaverState.appCards.forEach((card) => card.classList.remove("active"));
  const current = screensaverState.appCards[screensaverState.appIndex];
  if (current) current.classList.add("active");
}

function switchToAppMode() {
  if (!screensaverState.active || screensaverState.currentMode === "apps") return;
  screensaverState.currentMode = "apps";
  screensaverState.appIndex = 0;
  if (screensaverState.intervalId) {
    clearInterval(screensaverState.intervalId);
    screensaverState.intervalId = null;
  }
  if (!screensaverState.appCards.length) createAppPreviewCards();
  screensaverEl.classList.add("showing-apps");
  screensaverLayer1.classList.remove("active");
  screensaverLayer2.classList.remove("active");
  screensaverBlur1.classList.remove("active");
  screensaverBlur2.classList.remove("active");
  const simpleHintEl = document.getElementById("simpleHint");
  const appPreviewEl = document.getElementById("appPreview");
  const ctaEl = document.querySelector(".attract-mode__cta");
  const bannerEl = document.querySelector(".attract-mode__banner");
  if (simpleHintEl) simpleHintEl.style.display = "none";
  if (appPreviewEl) appPreviewEl.style.display = "flex";
  if (ctaEl) ctaEl.style.display = "block";
  if (bannerEl) bannerEl.style.display = "flex";
  updateAppPreview();
  screensaverState.appIntervalId = setInterval(() => {
    screensaverState.appIndex = (screensaverState.appIndex + 1) % screensaverState.appCards.length;
    updateAppPreview();
  }, APP_PREVIEW_ADVANCE_MS);
  screensaverState.modeSwitchTimerId = setTimeout(switchToImageMode, MODE_SWITCH_DELAY_MS);
}

function switchToImageMode() {
  if (!screensaverState.active || screensaverState.currentMode === "images") return;
  screensaverState.currentMode = "images";
  screensaverState.index = 0;
  if (screensaverState.appIntervalId) {
    clearInterval(screensaverState.appIntervalId);
    screensaverState.appIntervalId = null;
  }
  screensaverEl.classList.remove("showing-apps");
  const simpleHintEl = document.getElementById("simpleHint");
  const appPreviewEl = document.getElementById("appPreview");
  const ctaEl = document.querySelector(".attract-mode__cta");
  const bannerEl = document.querySelector(".attract-mode__banner");
  if (appPreviewEl) appPreviewEl.style.display = "none";
  if (ctaEl) ctaEl.style.display = "none";
  if (bannerEl) bannerEl.style.display = "none";
  if (simpleHintEl) simpleHintEl.style.display = "block";
  screensaverState.appCards.forEach((card) => card.classList.remove("active"));
  updateScreensaverImage();
  screensaverState.intervalId = setInterval(() => {
    screensaverState.index = (screensaverState.index + 1) % screensaverState.images.length;
    updateScreensaverImage();
  }, SCREENSAVER_ADVANCE_MS);
  screensaverState.modeSwitchTimerId = setTimeout(switchToAppMode, MODE_SWITCH_DELAY_MS);
}

async function activateScreensaver() {
  if (screensaverState.active) return;
  const images = await loadScreensaverImages();
  if (!images.length) {
    resetScreensaverTimer();
    return;
  }
  closeActivity();
  screensaverState.active = true;
  screensaverState.currentMode = "images";
  screensaverState.index = 0;
  const simpleHintEl = document.getElementById("simpleHint");
  const appPreviewEl = document.getElementById("appPreview");
  const ctaEl = document.querySelector(".attract-mode__cta");
  const bannerEl = document.querySelector(".attract-mode__banner");
  if (simpleHintEl) simpleHintEl.style.display = "block";
  if (appPreviewEl) appPreviewEl.style.display = "none";
  if (ctaEl) ctaEl.style.display = "none";
  if (bannerEl) bannerEl.style.display = "none";
  updateScreensaverImage();
  screensaverEl.classList.remove("hidden");
  screensaverState.intervalId = setInterval(() => {
    screensaverState.index = (screensaverState.index + 1) % screensaverState.images.length;
    updateScreensaverImage();
  }, SCREENSAVER_ADVANCE_MS);
  screensaverState.modeSwitchTimerId = setTimeout(switchToAppMode, MODE_SWITCH_DELAY_MS);
}

function deactivateScreensaver() {
  if (!screensaverState.active) return;
  screensaverState.active = false;
  screensaverState.currentMode = "images";
  audioManager.playTap();
  if (screensaverState.intervalId) {
    clearInterval(screensaverState.intervalId);
    screensaverState.intervalId = null;
  }
  if (screensaverState.appIntervalId) {
    clearInterval(screensaverState.appIntervalId);
    screensaverState.appIntervalId = null;
  }
  if (screensaverState.modeSwitchTimerId) {
    clearTimeout(screensaverState.modeSwitchTimerId);
    screensaverState.modeSwitchTimerId = null;
  }
  screensaverEl.classList.add("hidden");
  screensaverEl.classList.remove("showing-apps");
  screensaverLayer1.classList.remove("active");
  screensaverLayer2.classList.remove("active");
  screensaverBlur1.classList.remove("active");
  screensaverBlur2.classList.remove("active");
  screensaverState.currentLayer = 1;
  screensaverState.appCards.forEach((card) => card.classList.remove("active"));
  const appPreviewEl = document.getElementById("appPreview");
  const simpleHintEl = document.getElementById("simpleHint");
  const ctaEl = document.querySelector(".attract-mode__cta");
  const bannerEl = document.querySelector(".attract-mode__banner");
  if (appPreviewEl) appPreviewEl.style.display = "none";
  if (simpleHintEl) simpleHintEl.style.display = "none";
  if (ctaEl) ctaEl.style.display = "none";
  if (bannerEl) bannerEl.style.display = "none";
}

function handleUserActivity() {
  if (screensaverState.active) deactivateScreensaver();
  resetScreensaverTimer();
}

async function loadScreensaverImages() {
  if (screensaverState.images.length || screensaverState.loading) return screensaverState.images;
  screensaverState.loading = true;
  try {
    const res = await fetch("/__screensaver", { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    screensaverState.images = Array.isArray(data.images) ? data.images : [];
  } catch (err) {
    console.error("Failed to load screensaver images", err);
  } finally {
    screensaverState.loading = false;
  }
  return screensaverState.images;
}

function updateScreensaverImage() {
  if (!screensaverState.images.length) return;
  const src = screensaverState.images[screensaverState.index];
  const activeLayer = screensaverState.currentLayer === 1 ? screensaverLayer1 : screensaverLayer2;
  const inactiveLayer = screensaverState.currentLayer === 1 ? screensaverLayer2 : screensaverLayer1;
  const activeBlur = screensaverState.currentLayer === 1 ? screensaverBlur1 : screensaverBlur2;
  const inactiveBlur = screensaverState.currentLayer === 1 ? screensaverBlur2 : screensaverBlur1;
  activeLayer.style.backgroundImage = `url(${src})`;
  activeBlur.style.backgroundImage = `url(${src})`;
  inactiveLayer.classList.remove("active");
  inactiveBlur.classList.remove("active");
  activeLayer.classList.add("active");
  activeBlur.classList.add("active");
  screensaverState.currentLayer = screensaverState.currentLayer === 1 ? 2 : 1;
}

function setupNavigation() {
  const navLeaderboard = document.getElementById("navLeaderboard");
  const navStatistics = document.getElementById("navStatistics");
  const handleNavClick = (pageId) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    openNavigationPage(pageId);
  };
  if (navLeaderboard) {
    navLeaderboard.addEventListener("click", handleNavClick("leaderboard"));
    navLeaderboard.addEventListener("touchstart", handleNavClick("leaderboard"), { passive: false });
  }
  if (navStatistics) {
    navStatistics.addEventListener("click", handleNavClick("statistics"));
    navStatistics.addEventListener("touchstart", handleNavClick("statistics"), { passive: false });
  }
}

async function init() {
  initTheme();
  setupActivityCards();
  setupNavigation();
  initClock();
  setupControls();
  await initBanner();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
