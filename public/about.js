 const menuBtn = document.getElementById('menuBtn'), mobileMenu = document.getElementById('mobileMenu'), closeMenu = document.getElementById('closeMenu');
        if (menuBtn) { menuBtn.addEventListener('click', () => mobileMenu.classList.remove('hidden')); closeMenu.addEventListener('click', () => mobileMenu.classList.add('hidden')); }
        const revealElements = document.querySelectorAll('.scroll-reveal');
        const observer = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }); }, { threshold: 0.1 });
        revealElements.forEach(el => observer.observe(el));