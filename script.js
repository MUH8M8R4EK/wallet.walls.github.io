document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const slides = [
        '10.jpg'
    ];

    let currentIndex = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    // Create slides
    slides.forEach((slide, index) => {
        const div = document.createElement('div');
        div.className = 'carousel-slide';
        div.style.backgroundImage = `url(${slide})`;
        track.appendChild(div);
    });

    // Update progress
    const updateProgress = () => {
        const indicator = document.querySelector('.progress-indicator');
        const progressText = document.querySelector('.progress-text');
        indicator.style.left = `${(currentIndex / (slides.length - 1)) * 216}px`;
        progressText.textContent = `${currentIndex + 1}/${slides.length}`;
    };

    // Navigation
    document.querySelector('.prev').addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateProgress();
        }
    });

    document.querySelector('.next').addEventListener('click', () => {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateProgress();
        }
    });

    // Touch events
    track.addEventListener('touchstart', touchStart);
    track.addEventListener('touchmove', touchMove);
    track.addEventListener('touchend', touchEnd);

    // Mouse events
    track.addEventListener('mousedown', touchStart);
    track.addEventListener('mousemove', touchMove);
    track.addEventListener('mouseup', touchEnd);
    track.addEventListener('mouseleave', touchEnd);

    function touchStart(event) {
        isDragging = true;
        startPos = getPositionX(event);
        track.style.cursor = 'grabbing';
    }

    function touchMove(event) {
        if (!isDragging) return;
        
        const currentPosition = getPositionX(event);
        const diff = currentPosition - startPos;
        const slideWidth = track.clientWidth;
        
        currentTranslate = prevTranslate + diff;
        
        // Add resistance at the edges
        if (currentIndex === 0 && diff > 0) {
            currentTranslate = prevTranslate + (diff * 0.3);
        }
        if (currentIndex === slides.length - 1 && diff < 0) {
            currentTranslate = prevTranslate + (diff * 0.3);
        }
        
        track.style.transform = `translateX(${currentTranslate}px)`;
    }

    function touchEnd() {
        isDragging = false;
        const slideWidth = track.clientWidth;
        const diff = currentTranslate - prevTranslate;
        
        if (Math.abs(diff) > slideWidth / 3) {
            if (diff > 0 && currentIndex > 0) {
                currentIndex--;
            } else if (diff < 0 && currentIndex < slides.length - 1) {
                currentIndex++;
            }
        }
        
        currentTranslate = currentIndex * -slideWidth;
        prevTranslate = currentTranslate;
        
        track.style.transform = `translateX(${currentTranslate}px)`;
        track.style.cursor = 'grab';
        updateProgress();
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    // Initialize progress
    updateProgress();

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            currentIndex--;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateProgress();
        }
        if (e.key === 'ArrowRight' && currentIndex < slides.length - 1) {
            currentIndex++;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateProgress();
        }
    });
});

// Инициализация AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Кнопка прокрутки наверх
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.display = 'flex';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Плавная прокрутка для всех якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Обработка FAQ аккордеона
document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('active');
    });
});