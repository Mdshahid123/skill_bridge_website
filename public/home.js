   // FIXED DYNAMIC TYPING - Cursor moves perfectly with text
        const words = [
            "Web Development",
            "Data Science ",
            "DSA ",
            "Data Analytics ",
            "Digital Marketing ",
            "C Programming",
            "Python Programming",
            "c++ Programming",
            "Java Programming",
        ];
        
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isWaiting = false;
        
        const textElement = document.getElementById('dynamic-word');
        const cursorElement = document.getElementById('dynamic-cursor');
        
        function typeEffect() {
            if (isWaiting) {
                setTimeout(typeEffect, 100);
                return;
            }
            
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                // Remove characters
                charIndex--;
                textElement.textContent = currentWord.substring(0, charIndex);
                
                // If completely deleted, move to next word
                if (charIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    setTimeout(typeEffect, 300);
                    return;
                }
            } else {
                // Add characters
                charIndex++;
                textElement.textContent = currentWord.substring(0, charIndex);
                
                // If word complete, wait then start deleting
                if (charIndex === currentWord.length) {
                    isDeleting = true;
                    isWaiting = true;
                    setTimeout(() => {
                        isWaiting = false;
                        typeEffect();
                    }, 2000);
                    return;
                }
            }
            
            // Speed: faster when deleting, slower when typing
            const speed = isDeleting ? 40 : 80;
            setTimeout(typeEffect, speed);
        }
        
        // Start the typing animation when page loads
        window.addEventListener('DOMContentLoaded', () => {
            setTimeout(typeEffect, 500);
        });
        
        // BACKGROUND SLIDESHOW FUNCTIONALITY
        let currentBgSlide = 0;
        const bgSlides = document.querySelectorAll('.bg-slide');
        const indicators = document.querySelectorAll('.indicator-dot');
        let slideshowInterval;
        
        function changeBgSlide(index) {
            bgSlides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
            currentBgSlide = index;
        }
        
        function nextBgSlide() {
            let nextIndex = (currentBgSlide + 1) % bgSlides.length;
            changeBgSlide(nextIndex);
        }
        
        function startSlideshow() {
            if (slideshowInterval) clearInterval(slideshowInterval);
            slideshowInterval = setInterval(nextBgSlide, 5000);
        }
        
        if (indicators.length > 0) {
            indicators.forEach((indicator, idx) => {
                indicator.addEventListener('click', () => {
                    clearInterval(slideshowInterval);
                    changeBgSlide(idx);
                    startSlideshow();
                });
            });
            startSlideshow();
        }
        
        // Mobile menu
        const menuBtn = document.getElementById('menuBtn'), mobileMenu = document.getElementById('mobileMenu'), closeMenu = document.getElementById('closeMenu');
        if (menuBtn) { menuBtn.addEventListener('click', () => mobileMenu.classList.remove('hidden')); closeMenu.addEventListener('click', () => mobileMenu.classList.add('hidden')); }
        
        // Scroll reveal
        const revealElements = document.querySelectorAll('.scroll-reveal');
        const observer = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }); }, { threshold: 0.1 });
        revealElements.forEach(el => observer.observe(el));
        
        // Smooth anchor
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== "#" && href !== "") {
                    const target = document.querySelector(href);
                    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); if (mobileMenu && !mobileMenu.classList.contains('hidden')) mobileMenu.classList.add('hidden'); }
                }
            });
        });
        
        document.querySelectorAll('button').forEach(btn => {
            if (btn.innerText.includes('Enroll Now') || btn.innerText.includes('Contact Us')) 
                btn.addEventListener('click', (e) => {
                   e.preventDefault()
                   
              });
        });