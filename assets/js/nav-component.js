// Navigation Component Loader
(function () {
    'use strict';

    const NAV_HTML = `
    <nav class="nav">
        <div class="container nav-container">
            <a href="/" class="nav-logo" style="flex-shrink: 0;">tz</a>
            <button class="mobile-menu-btn" id="mobileMenuBtn">
                <i class="fas fa-bars"></i>
            </button>
            <ul class="nav-menu" id="navMenu">
                <li><a href="/">Home</a></li>
                <li><a href="/pages/about.html">About</a></li>
                <li><a href="/pages/services.html">Services</a></li>
                <li><a href="/pages/contact.html">Contact</a></li>
                <li><a href="/pages/analytics.html">Analytics</a></li>
                <li><a href="/pages/upload.html">Upload</a></li>
                <li><a href="/pages/search.html">Search</a></li>
                <li><a href="/pages/health.html">Health</a></li>
                <li><a href="/assets/docs/cv.pdf" download="Thaw-Zin-CV.pdf" class="nav-cv-btn">
                        <i class="fas fa-download"></i>
                        <span>Download CV</span>
                    </a></li>
                <li style="margin-left: 2rem; border-left: 1px solid var(--border); padding-left: 2rem;">
                    <!-- Custom Google Login Button -->
                    <div id="google-login-btn" class="google-btn-wrapper">
                        <div id="g_id_onload"
                            data-client_id="881572313374-qmautsh2vauq7oveeftt9cgvg3rv74de.apps.googleusercontent.com"
                            data-context="signin" data-ux_mode="popup" data-callback="handleCredentialResponse"
                            data-auto_prompt="false">
                        </div>

                        <!-- Hidden standard button to trigger logic if needed, but we use custom trigger -->
                        <div class="g_id_signin" data-type="standard" data-shape="rectangular" data-theme="filled_black"
                            data-text="signin_with" data-size="medium" data-logo_alignment="left" style="display: none;">
                        </div>

                        <!-- Custom Button Matching CV Button Theme -->
                        <button class="nav-cv-btn" onclick="google.accounts.id.prompt()">
                            <i class="fab fa-google"></i>
                            <span>Sign In</span>
                        </button>
                    </div>

                    <!-- User Profile (Hidden by default) -->
                    <div id="user-profile" style="display: none; align-items: center; gap: 10px;">
                        <img id="user-avatar" src="" alt="Profile"
                            style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--accent-blue);">
                        <span id="user-name" style="color: var(--text-primary); font-weight: bold;"></span>
                    </div>
                </li>
            </ul>
        </div>
    </nav>
    `;

    // Insert navigation at the beginning of body
    function loadNavigation() {
        if (document.body) {
            document.body.insertAdjacentHTML('afterbegin', NAV_HTML);

            // Initialize mobile menu after injection
            initializeMobileMenu();
        }
    }

    // Mobile menu functionality
    function initializeMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.getElementById('navMenu');

        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', function () {
                navMenu.classList.toggle('active');
            });
        }
    }

    // Load immediately if DOM is ready, otherwise wait
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadNavigation);
    } else {
        loadNavigation();
    }
})();
