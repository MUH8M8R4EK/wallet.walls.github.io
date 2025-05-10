document.addEventListener('DOMContentLoaded', () => {
    // Инициализация карусели
    initCarousel();
    
    // Инициализация AOS
    initAOS();
    
    // Инициализация кнопки прокрутки наверх
    initScrollToTop();
    
    // Инициализация плавной прокрутки
    initSmoothScroll();
});

function initCarousel() {
    const carousel = document.querySelector('.carousel');
    const track = carousel.querySelector('.carousel-track');
    const slides = track.querySelectorAll('.carousel-slide');
    const prevButton = carousel.querySelector('.prev');
    const nextButton = carousel.querySelector('.next');
    const indicators = carousel.querySelector('.carousel-indicators');
    const progressText = carousel.querySelector('.progress-text');
    
    let currentIndex = 5;
    let isAnimating = false;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Создаем индикаторы
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        indicators.appendChild(dot);
    });
    
    function updateCarousel() {
        if (isAnimating) return;
        isAnimating = true;
        
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Обновляем активные классы с задержкой для плавности
        slides.forEach((slide, index) => {
            if (index === currentIndex) {
                setTimeout(() => {
                    slide.classList.add('active');
                }, 50);
            } else {
                slide.classList.remove('active');
            }
        });
        
        // Обновляем индикаторы
        const dots = indicators.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Обновляем прогресс
        progressText.textContent = `${currentIndex + 1}/${slides.length}`;
        
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }
    
    function goToSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        currentIndex = index;
        updateCarousel();
    }
    
    function nextSlide() {
        if (!isAnimating) {
            goToSlide(currentIndex + 1);
        }
    }
    
    function prevSlide() {
        if (!isAnimating) {
            goToSlide(currentIndex - 1);
        }
    }
    
    // Добавляем обработчики событий
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);
    
    // Добавляем управление с клавиатуры
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
    
    // Добавляем поддержку свайпов
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
    
    // Автопрокрутка с паузой при наведении
    let autoplayInterval = setInterval(nextSlide, 5000);
    
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(nextSlide, 5000);
    });
    
    // Инициализация
    updateCarousel();
}

function initAOS() {
    try {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            disable: 'mobile'
        });
    } catch (error) {
        console.error('Ошибка при инициализации AOS:', error);
    }
}

function initScrollToTop() {
    try {
        const scrollToTopBtn = document.getElementById('scrollToTop');
        if (!scrollToTopBtn) return;

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
    } catch (error) {
        console.error('Ошибка при инициализации кнопки прокрутки:', error);
    }
}

function initSmoothScroll() {
    try {
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
    } catch (error) {
        console.error('Ошибка при инициализации плавной прокрутки:', error);
    }
}

// Обработка FAQ аккордеона
document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('active');
    });
});