document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const slides = [
        '01.jpg',
        '02.jpg',
        '03.jpg',
        '04.jpg',
        '05.jpg',
        '06.jpg',
        '07.jpg',
        '08.jpg',
        '09.jpg',
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