/**
 * Hasbihal Cafe Lounge - Gallery JavaScript
 * Handles image gallery and modal functionality
 */

document.addEventListener('DOMContentLoaded', function() {

    // ===== Gallery Modal =====
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.modal-close');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Open modal when gallery item is clicked
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            openModal(this);
        });

        // Keyboard accessibility
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `View image ${index + 1}`);

        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(this);
            }
        });
    });

    function openModal(item) {
        const imgSrc = item.getAttribute('data-src') || item.querySelector('img').src;
        const imgAlt = item.querySelector('img').alt || 'Gallery Image';

        modal.style.display = 'block';
        modalImg.src = imgSrc;
        modalImg.alt = imgAlt;
        modalCaption.textContent = imgAlt;

        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';

        // Focus on modal for accessibility
        modal.focus();
    }

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        modalImg.src = '';
    }

    // Close modal when X is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside the image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    // ===== Gallery Image Lazy Loading Enhancement =====
    const galleryImages = document.querySelectorAll('.gallery-item img');

    const imageLoadObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;

                // Add loading animation
                img.style.opacity = '0';

                img.addEventListener('load', function() {
                    img.style.transition = 'opacity 0.5s ease';
                    img.style.opacity = '1';
                });

                // If image is already loaded (cached)
                if (img.complete) {
                    img.style.opacity = '1';
                }

                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    galleryImages.forEach(img => {
        imageLoadObserver.observe(img);
    });

    // ===== Gallery Grid Animation on Scroll =====
    const galleryGrid = document.querySelector('.gallery-grid');

    if (galleryGrid) {
        const gridObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Stagger animation for gallery items
                    const items = entry.target.querySelectorAll('.gallery-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                    gridObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });

        gridObserver.observe(galleryGrid);
    }

    // ===== Image Preloading for Better Performance =====
    function preloadImages() {
        galleryItems.forEach(item => {
            const imgSrc = item.getAttribute('data-src');
            if (imgSrc) {
                const img = new Image();
                img.src = imgSrc;
            }
        });
    }

    // Preload images after page load
    if (window.addEventListener) {
        window.addEventListener('load', preloadImages);
    }

    // ===== Touch Gestures for Mobile =====
    let touchStartX = 0;
    let touchEndX = 0;

    modal.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    modal.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        // Swipe down to close (simplified version)
        if (Math.abs(touchStartX - touchEndX) < 50) {
            closeModal();
        }
    }

    // ===== Modal Navigation (Previous/Next) =====
    // This can be extended to navigate between images in the gallery
    let currentImageIndex = 0;
    const totalImages = galleryItems.length;

    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'block') {
            if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'ArrowLeft') {
                showPreviousImage();
            }
        }
    });

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % totalImages;
        updateModalImage();
    }

    function showPreviousImage() {
        currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
        updateModalImage();
    }

    function updateModalImage() {
        const item = galleryItems[currentImageIndex];
        const imgSrc = item.getAttribute('data-src') || item.querySelector('img').src;
        const imgAlt = item.querySelector('img').alt || 'Gallery Image';

        // Fade out
        modalImg.style.opacity = '0';

        setTimeout(() => {
            modalImg.src = imgSrc;
            modalImg.alt = imgAlt;
            modalCaption.textContent = imgAlt;

            // Fade in
            modalImg.style.transition = 'opacity 0.3s ease';
            modalImg.style.opacity = '1';
        }, 300);
    }

    // Track current image when opening modal
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            currentImageIndex = index;
        });
    });

    // ===== Gallery Filtering (Optional Enhancement) =====
    // This can be used if you want to add category filtering to the gallery
    const filterButtons = document.querySelectorAll('.gallery-filter-btn');

    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');

                // Remove active class from all buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Filter gallery items
                galleryItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ===== Performance: Request Animation Frame for Smooth Animations =====
    function smoothScroll(element) {
        const targetPosition = element.offsetTop - 70;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;

        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // ===== Console Gallery Info =====
    console.log(`%c📸 Gallery loaded with ${totalImages} images`, 'color: #8B4513; font-weight: bold;');
    console.log('%cNavigation: Use arrow keys to browse images in fullscreen mode', 'color: #666;');
});
