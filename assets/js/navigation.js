// Navigation scroll effect with Flutter-like animation
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('.nav');
    let lastScrollY = window.scrollY;
    let ticking = false;
    let scrollTimeout;

    function setNavState(fadeOut) {
        // Don't apply fade-out if mobile menu is open
        if (nav.classList.contains('menu-open')) {
            return;
        }
        
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

    // Mobile Menu Functionality
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn && navMenu) {
        // Toggle menu function
        function toggleMenu() {
            navMenu.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fas fa-times';
                // Add menu-open class to prevent nav from fading out
                nav.classList.add('menu-open');
                // Ensure nav is visible when menu opens
                nav.classList.remove('fade-out');
                nav.classList.add('fade-in');
                // Add body scroll lock
                document.body.style.overflow = 'hidden';
            } else {
                icon.className = 'fas fa-bars';
                // Remove menu-open class
                nav.classList.remove('menu-open');
                // Restore body scroll
                document.body.style.overflow = '';
            }
        }
        
        // Close menu function
        function closeMenu() {
            navMenu.classList.remove('active');
            nav.classList.remove('menu-open');
            const icon = mobileMenuBtn.querySelector('i');
            icon.className = 'fas fa-bars';
            document.body.style.overflow = '';
        }
        
        // Event listeners - Support both click and touch events
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });
        
        // Explicit touch event for mobile devices
        mobileMenuBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });
        
        // Close menu when clicking/touching on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            // Track if touch event was handled to prevent duplicate click
            let touchHandled = false;
            
            // Check if this is the CV download button
            const isCVDownloadBtn = link.classList.contains('nav-cv-btn');
            
            link.addEventListener('touchend', function(e) {
                // Special handling for CV download button
                if (isCVDownloadBtn) {
                    e.preventDefault();
                    e.stopPropagation();
                    touchHandled = true;
                    
                    // Close menu first
                    closeMenu();
                    
                    // Trigger download after menu closes
                    setTimeout(function() {
                        const href = link.getAttribute('href');
                        const downloadAttr = link.getAttribute('download');
                        
                        // Create a temporary anchor element for reliable download
                        const tempLink = document.createElement('a');
                        tempLink.href = href;
                        if (downloadAttr) {
                            tempLink.download = downloadAttr;
                        }
                        tempLink.style.display = 'none';
                        document.body.appendChild(tempLink);
                        tempLink.click();
                        document.body.removeChild(tempLink);
                        
                        touchHandled = false;
                    }, 150);
                    return;
                }
                
                // For other links: handle navigation explicitly
                e.preventDefault();
                e.stopPropagation();
                touchHandled = true;
                
                // Close menu first
                closeMenu();
                
                // Navigate after a small delay to ensure menu closes smoothly
                setTimeout(function() {
                    const href = link.getAttribute('href');
                    if (href && href !== '#') {
                        window.location.href = href;
                    }
                    touchHandled = false;
                }, 100);
            });
            
            link.addEventListener('click', function(e) {
                // If touch was already handled, prevent duplicate navigation
                if (touchHandled) {
                    e.preventDefault();
                    return;
                }
                
                // For CV download button on mobile, ensure download works
                if (isCVDownloadBtn && window.innerWidth <= 768) {
                    // Let the download attribute handle it, but close menu
                    closeMenu();
                    // Don't prevent default to allow download
                    return;
                }
                
                // Don't prevent default - let the link navigate on desktop
                closeMenu();
            });
        });
        
        // Close menu when clicking/touching outside
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target) && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
        
        document.addEventListener('touchend', function(event) {
            if (!nav.contains(event.target) && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
        
        // Close menu when resizing to desktop view
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }
});
