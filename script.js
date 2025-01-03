const nav = document.getElementById('mainNav');
let lastScrollY = window.scrollY;
let isDarkMode = true; // Start with dark mode by default

function toggleBackground() {
    const body = document.body;
    const navItems = document.querySelectorAll('.nav-item');
    const textElements = document.querySelectorAll('p, h1, h2, h3, span, li');
    const toggleBtn = document.getElementById('toggle');
    const toggleImg = toggleBtn.querySelector('img');
    const logo = document.querySelector('.nav-logo img');
    
    isDarkMode = !isDarkMode;
    
    if (isDarkMode) {
        // Switch to Dark Mode
        body.classList.remove('bg-white');
        body.classList.add('bg-gray-950');
        
        // Update text colors
        textElements.forEach(element => {
            element.classList.remove('text-black');
            element.classList.add('text-gray-100');
        });
        
        // Update nav items
        navItems.forEach(item => {
            item.classList.remove('text-black');
            item.classList.add('text-gray-400');
        });
        
        // Update logo
        logo.classList.add('invert');
        
        // Update toggle button
        toggleImg.src = 'brightness (1).png';
        toggleImg.classList.remove('invert');
        toggleBtn.classList.add('invert');
        
    } else {
        // Switch to Light Mode
        body.classList.remove('bg-gray-950');
        body.classList.add('bg-white');
        
        // Update text colors
        textElements.forEach(element => {
            element.classList.remove('text-gray-100');
            element.classList.add('text-black');
        });
        
        // Update nav items
        navItems.forEach(item => {
            item.classList.remove('text-gray-400');
            item.classList.add('text-black');
        });
        
        // Update logo
        logo.classList.remove('invert');
        
        // Update toggle button
        toggleImg.src = 'moon.png';
        toggleImg.classList.add('invert');
        toggleBtn.classList.remove('invert');
    }
}

window.addEventListener('scroll', () => {
    const viewportHeight = window.innerHeight;
    if (window.scrollY > viewportHeight * 0.5) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    lastScrollY = window.scrollY;
});

// Add this function for mobile menu toggle
function toggleMenu() {
    const menu = document.querySelector('.nav-container ul');
    if (menu.classList.contains('mobile-menu-hidden')) {
        menu.classList.remove('mobile-menu-hidden');
        menu.classList.add('mobile-menu-visible');
    } else {
        menu.classList.add('mobile-menu-hidden');
        menu.classList.remove('mobile-menu-visible');
    }
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

// Update active nav item on scroll
window.addEventListener('scroll', () => {
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
        item.classList.remove('text-[#FF5D38]');
        if (item.getAttribute('data-section') === current) {
            item.classList.add('text-[#FF5D38]');
        }
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
