const nav = document.getElementById('mainNav');
let lastScrollY = window.scrollY;
let isDarkMode = localStorage.getItem('darkMode') === 'true' || true;

function toggleBackground() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    
    const elements = {
        body: document.body,
        navItems: document.querySelectorAll('.nav-item'),
        textElements: document.querySelectorAll('p, h1, h2, h3, span, li'),
        toggleBtn: document.getElementById('toggle'),
        logo: document.querySelector('.nav-logo img')
    };
    
    const toggleImg = elements.toggleBtn.querySelector('img');
    
    // Use object literal for cleaner mode switching
    const modeSettings = {
        dark: {
            bodyRemove: 'bg-white-100',
            bodyAdd: 'bg-gray-950',
            textRemove: 'text-black',
            textAdd: 'text-gray-100',
            navRemove: 'text-black',
            navAdd: 'text-gray-400',
            toggleSrc: 'brightness (1).png'
        },
        light: {
            bodyRemove: 'bg-gray-950',
            bodyAdd: 'bg-white',
            textRemove: 'text-gray-100',
            textAdd: 'text-black',
            navRemove: 'text-gray-400',
            navAdd: 'text-black',
            toggleSrc: 'moon.png'
        }
    };
    
    const mode = isDarkMode ? 'dark' : 'light';
    const settings = modeSettings[mode];
    
    elements.body.classList.remove(settings.bodyRemove);
    elements.body.classList.add(settings.bodyAdd);
    
    elements.textElements.forEach(element => {
        element.classList.remove(settings.textRemove);
        element.classList.add(settings.textAdd);
    });
    
    elements.navItems.forEach(item => {
        item.classList.remove(settings.navRemove);
        item.classList.add(settings.navAdd);
    });
    
    // Toggle logo and button states
    elements.logo.classList.toggle('invert', isDarkMode);
    toggleImg.src = settings.toggleSrc;
    toggleImg.classList.toggle('invert', !isDarkMode);
    elements.toggleBtn.classList.toggle('invert', isDarkMode);
}

// Add throttling to scroll event
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Combine scroll event listeners
const handleScroll = throttle(() => {
    // Navbar visibility
    const viewportHeight = window.innerHeight;
    if (window.scrollY > viewportHeight * 0.5) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    // Active section highlighting
    const sections = document.querySelectorAll('main[id], section[id]');
    const navItems = document.querySelectorAll('.nav-item');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - sectionHeight/3)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.toggle('text-[#FF5D38]', 
            item.getAttribute('data-section') === current
        );
    });
    
    lastScrollY = window.scrollY;
}, 100);

// Add passive event listeners for better scroll performance
window.addEventListener('scroll', handleScroll, { passive: true });

// Use IntersectionObserver for section visibility
const observeSection = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.toggle('text-[#FF5D38]', 
                    item.getAttribute('data-section') === id
                );
            });
        }
    });
}, {
    threshold: 0.3
});

document.querySelectorAll('main[id], section[id]').forEach(section => {
    observeSection.observe(section);
});

// Add this function for mobile menu toggle
function toggleMenu() {
    const mobileMenu = document.querySelector('.nav-container ul');
    const hamburger = document.querySelector('.hamburger');
    
    // Toggle both classes
    mobileMenu.classList.toggle('mobile-menu-hidden');
    mobileMenu.classList.toggle('mobile-menu-visible');
    
    // Optional: Toggle hamburger icon state
    hamburger.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const menu = document.querySelector('.nav-container ul');
    const hamburger = document.querySelector('.hamburger');
    
    if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
        menu.classList.add('mobile-menu-hidden');
        menu.classList.remove('mobile-menu-visible');
    }
});

// Close menu when clicking a nav item
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelector('.nav-container').classList.remove('active');
    });
});

// Add smooth scrolling functionality
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = item.getAttribute('data-section');
        const section = document.getElementById(sectionId);
        
        // Check if section exists before scrolling
        if (!section) {
            console.warn(`Section with id "${sectionId}" not found`);
            return;
        }
        
        // Close mobile menu if open
        const navContainer = document.querySelector('.nav-container');
        if (navContainer) {
            navContainer.classList.remove('active');
            const menuList = navContainer.querySelector('ul');
            if (menuList) {
                menuList.classList.add('mobile-menu-hidden');
                menuList.classList.remove('mobile-menu-visible');
            }
        }

        // Add active state to clicked item
        document.querySelectorAll('.nav-item').forEach(navItem => {
            navItem.classList.remove('text-[#FF5D38]');
        });
        item.classList.add('text-[#FF5D38]');

        // Smooth scroll to section
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Wrap popup-related code in DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    // Popup functions
    window.openHirePopup = function() {
        const popup = document.getElementById('hirePopup');
        popup.classList.remove('hidden');
        popup.classList.add('flex');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when popup is open
    }

    window.closeHirePopup = function() {
        const popup = document.getElementById('hirePopup');
        popup.classList.add('hidden');
        popup.classList.remove('flex');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Close popup when clicking outside the form
    const popup = document.getElementById('hirePopup');
    if (popup) {
        popup.addEventListener('click', function(e) {
            if (e.target === this) {
                closeHirePopup();
            }
        });
    }
});

// Organize cursor-related code into a class
class CursorEffect {
    constructor() {
        // Check if device is mobile/tablet
        if (this.isMobileDevice()) {
            // Remove cursor elements if on mobile
            this.removeCursorElements();
            return;
        }

        this.cursorDot = document.querySelector('.cursor-dot');
        this.trails = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
    }

    isMobileDevice() {
        return (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
            window.matchMedia("(max-width: 768px)").matches ||
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0
        );
    }

    removeCursorElements() {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorTrails = document.querySelectorAll('.cursor-trail');
        
        if (cursorDot) cursorDot.remove();
        cursorTrails.forEach(trail => trail.remove());
    }

    init() {
        this.createTrails();
        this.bindEvents();
        this.animate();
    }

    createTrails() {
        const trailCount = 10;
        for (let i = 0; i < trailCount; i++) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.opacity = 1 - (i / trailCount);
            document.body.appendChild(trail);
            this.trails.push({
                element: trail,
                x: 0,
                y: 0
            });
        }
    }

    bindEvents() {
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    handleMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        
        const dx = e.movementX;
        const dy = e.movementY;
        const velocity = Math.sqrt(dx * dx + dy * dy);
        
        this.cursorDot.style.left = this.mouseX + 'px';
        this.cursorDot.style.top = this.mouseY + 'px';
        this.cursorDot.style.transform = `scale(${1 + velocity * 0.05})`;
    }

    handleMouseDown() {
        this.trails.forEach(trail => {
            trail.element.style.width = '8px';
            trail.element.style.height = '8px';
        });
    }

    handleMouseUp() {
        this.trails.forEach(trail => {
            trail.element.style.width = '16px';
            trail.element.style.height = '16px';
        });
    }

    animate() {
        let prevX = this.mouseX;
        let prevY = this.mouseY;
        
        this.trails.forEach((trail, index) => {
            let dx = prevX - trail.x;
            let dy = prevY - trail.y;
            
            trail.x += dx * (0.2 - index * 0.015);
            trail.y += dy * (0.2 - index * 0.015);
            
            trail.element.style.left = (trail.x - 8) + 'px';
            trail.element.style.top = (trail.y - 8) + 'px';
            
            const speed = Math.sqrt(dx * dx + dy * dy);
            const scale = 1 + speed * 0.01;
            trail.element.style.transform = `scale(${scale})`;
            
            prevX = trail.x;
            prevY = trail.y;
        });
        
        requestAnimationFrame(this.animate.bind(this));
    }
}

class MobileMenu {
    constructor() {
        this.menu = document.querySelector('.nav-container ul');
        this.hamburger = document.querySelector('.hamburger');
        this.isOpen = false;
        this.init();
    }

    init() {
        this.hamburger.addEventListener('click', () => this.toggle());
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
        this.setupNavItems();
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.menu.classList.toggle('mobile-menu-hidden', !this.isOpen);
        this.menu.classList.toggle('mobile-menu-visible', this.isOpen);
        this.hamburger.classList.toggle('active', this.isOpen);
    }

    handleOutsideClick(e) {
        if (this.isOpen && !this.menu.contains(e.target) && !this.hamburger.contains(e.target)) {
            this.toggle();
        }
    }

    setupNavItems() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                if (this.isOpen) this.toggle();
            });
        });
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    new MobileMenu();
    new CursorEffect();
});
