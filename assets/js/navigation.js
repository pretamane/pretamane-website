// Navigation scroll effect with Flutter-like animation
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('.nav');
    let lastScrollY = window.scrollY;
    let ticking = false;
    let scrollTimeout;

    function setNavState(fadeOut) {
        if (fadeOut) {
            nav.classList.add('fade-out');
            nav.classList.remove('fade-in');
        } else {
            nav.classList.remove('fade-out');
            nav.classList.add('fade-in');
        }
    }

    function handleScroll() {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 50) {
            setNavState(true); // fade out
        } else if (currentScrollY < lastScrollY) {
            setNavState(false); // fade in
        } else if (currentScrollY <= 50) {
            setNavState(false);
        }
        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            if (window.scrollY < 50) setNavState(false);
        }, 400);
    });

    // Mobile: Use touch events for fade logic
    let lastTouchY = null;
    window.addEventListener('touchstart', function(e) {
        lastTouchY = e.touches[0].clientY;
    });
    window.addEventListener('touchmove', function(e) {
        if (lastTouchY === null) return;
        const currentTouchY = e.touches[0].clientY;
        if (window.scrollY > 50) {
            if (currentTouchY < lastTouchY) {
                setNavState(true); // fade out on swipe up
            } else if (currentTouchY > lastTouchY) {
                setNavState(false); // fade in on swipe down
            }
        } else {
            setNavState(false);
        }
        lastTouchY = currentTouchY;
    });
});
