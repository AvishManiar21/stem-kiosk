export default async function initBanner() {
    const bannerContainer = document.getElementById('homeBanner');
    if (!bannerContainer) return;

    // Configuration
    const ROTATION_INTERVAL = 5000; // 5 seconds
    const TRANSITION_DURATION = 1000; // 1 second

    // Load images from banner endpoint (all images in main images/ folder)
    let images = [];
    try {
        const res = await fetch('/__banner', { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            images = Array.isArray(data.images) ? data.images : [];
        }
    } catch (err) {
        console.error('Failed to load banner images', err);
    }

    // Fallback to empty if no images
    if (!images.length) {
        bannerContainer.innerHTML = '<div class="banner__content"><h2 class="banner__title">Welcome to STEM Discovery</h2><p class="banner__subtitle">Explore. Learn. Create.</p></div>';
        return;
    }

    let currentIndex = 0;
    let timer = null;

    // Create Slides
    function createSlides() {
        bannerContainer.innerHTML = '';

        images.forEach((src, index) => {
            const slide = document.createElement('div');
            slide.className = `banner__slide ${index === 0 ? 'banner__slide--active' : ''}`;
            slide.style.backgroundImage = `url('${src}')`;
            bannerContainer.appendChild(slide);
        });

        // Add overlay for text readability
        const overlay = document.createElement('div');
        overlay.className = 'banner__overlay';
        bannerContainer.appendChild(overlay);

        // Add content container
        const content = document.createElement('div');
        content.className = 'banner__content';
        content.innerHTML = `
            <h2 class="banner__title">Welcome to STEM Discovery</h2>
            <p class="banner__subtitle">Explore. Learn. Create.</p>
        `;
        bannerContainer.appendChild(content);

        // Add indicators
        const indicators = document.createElement('div');
        indicators.className = 'banner__indicators';
        images.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `banner__dot ${index === 0 ? 'banner__dot--active' : ''}`;
            dot.addEventListener('click', () => goToSlide(index));
            indicators.appendChild(dot);
        });
        bannerContainer.appendChild(indicators);
    }

    function nextSlide() {
        goToSlide((currentIndex + 1) % images.length);
    }

    function goToSlide(index) {
        const slides = bannerContainer.querySelectorAll('.banner__slide');
        const dots = bannerContainer.querySelectorAll('.banner__dot');

        // Update slides
        slides[currentIndex].classList.remove('banner__slide--active');
        slides[index].classList.add('banner__slide--active');

        // Update dots
        dots[currentIndex].classList.remove('banner__dot--active');
        dots[index].classList.add('banner__dot--active');

        currentIndex = index;
        resetTimer();
    }

    function resetTimer() {
        if (timer) clearInterval(timer);
        timer = setInterval(nextSlide, ROTATION_INTERVAL);
    }

    // Initialize
    createSlides();
    resetTimer();

    // Pause on hover (optional)
    bannerContainer.addEventListener('mouseenter', () => clearInterval(timer));
    bannerContainer.addEventListener('mouseleave', resetTimer);
}
