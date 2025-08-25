// Navigation scroll effect with Flutter-like animation
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('.nav');
    let lastScrollY = window.scrollY;
    let ticking = false;
    let scrollTimeout;
    let lastScrollTime = Date.now();
    let scrollDelta = 0;

    // Function to handle scroll event with enhanced animation
    function handleScroll() {
        const currentTime = Date.now();
        const timeDiff = currentTime - lastScrollTime;
        const currentScrollY = window.scrollY;
        scrollDelta = currentScrollY - lastScrollY;
        
        // Calculate scroll speed
        const scrollSpeed = Math.abs(scrollDelta) / Math.max(1, timeDiff);
        
        if (currentScrollY > 50) { // Reduced threshold for faster response
            if (scrollDelta > 0 && scrollSpeed > 0.1) { // Scrolling down fast
                nav.classList.add('fade-out');
                nav.classList.remove('fade-in');
            } else if (scrollDelta < 0) { // Scrolling up
                nav.classList.remove('fade-out');
                nav.classList.add('fade-in');
            }
        } else {
            nav.classList.remove('fade-out');
            nav.classList.add('fade-in');
        }
        
        lastScrollY = currentScrollY;
        lastScrollTime = currentTime;
        ticking = false;
    }

    // Add scroll event listener with requestAnimationFrame for better performance
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
            });
            ticking = true;
        }

        // Clear the timeout if it exists
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        // Set a timeout to remove the fade-out class after scrolling stops
        scrollTimeout = setTimeout(function() {
            if (window.scrollY < 50) {
                nav.classList.remove('fade-out');
                nav.classList.add('fade-in');
            }
        }, 800); // Reduced timeout for snappier response
    });

    // Handle touch events for mobile devices
    let touchStartY = 0;
    
    window.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    });

    window.addEventListener('touchmove', function(e) {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const touchY = e.touches[0].clientY;
                if (touchStartY < touchY) {
                    // Scrolling up
                    nav.classList.remove('fade-out');
                } else if (touchStartY > touchY && window.scrollY > 100) {
                    // Scrolling down
                    nav.classList.add('fade-out');
                }
                touchStartY = touchY;
            });
            ticking = true;
        }
    });
});
