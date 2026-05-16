// Dynamic Typing Animation
const words = ["Web Development ", "Data Science ", "DSA ", "Data Analytics ", "Digital Marketing ", "Programming Languages "];
let wordIndex = 0, charIndex = 0, isDeleting = false, isWaiting = false;
const textElement = document.getElementById('dynamic-word');

function typeEffect() {
    if (isWaiting) { 
        setTimeout(typeEffect, 100); 
        return; 
    }
    const currentWord = words[wordIndex];
    if (isDeleting) {
        charIndex--;
        textElement.textContent = currentWord.substring(0, charIndex);
        if (charIndex === 0) { 
            isDeleting = false; 
            wordIndex = (wordIndex + 1) % words.length; 
            setTimeout(typeEffect, 300); 
            return; 
        }
    } else {
        charIndex++;
        textElement.textContent = currentWord.substring(0, charIndex);
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
    setTimeout(typeEffect, isDeleting ? 40 : 80);
}
window.addEventListener('DOMContentLoaded', () => setTimeout(typeEffect, 3000));




// Background Slideshow
let currentBgSlide = 0;
const bgSlides = document.querySelectorAll('.bg-slide');
const indicators = document.querySelectorAll('.indicator-dot');
let slideshowInterval;

function changeBgSlide(index) { 
    bgSlides.forEach((s, i) => {
        s.classList.toggle('active', i === index);
        s.style.opacity = i === index ? '1' : '0';
    }); 
    indicators.forEach((d, i) => d.classList.toggle('active', i === index)); 
    currentBgSlide = index; 
}

function nextBgSlide() { 
    changeBgSlide((currentBgSlide + 1) % bgSlides.length); 
}

function startSlideshow() { 
    if (slideshowInterval) clearInterval(slideshowInterval); 
    slideshowInterval = setInterval(nextBgSlide, 3000); 
}

if (indicators.length) { 
    indicators.forEach((dot, idx) => dot.addEventListener('click', () => { 
        clearInterval(slideshowInterval); 
        changeBgSlide(idx); 
        startSlideshow(); 
    })); 
    startSlideshow(); 
}

//Inquiry Modal
const inquiryModal = document.getElementById('inquiryModal');
const inquiryBtn = document.getElementById('inquiryBtn');
const ctaInquiryBtn = document.getElementById('ctaInquiryBtn');
const closeInquiryModal = document.getElementById('closeInquiryModal');
const inquiryForm = document.getElementById('inquiryForm');

function openInquiryModal() { 
    if (inquiryModal) {
        inquiryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeInquiryModalFunc() { 
    if (inquiryModal) {
        inquiryModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

//close the enquery form if user click on the close button(x)
closeInquiryModal.addEventListener('click', closeInquiryModalFunc);

//open the enquery form if user click on the inquery button
inquiryBtn.addEventListener('click', openInquiryModal);


// showing a green toast after server send back a response(redirect to the same page with search parameter)

function showSuccessToastMessage(message) {

    const existingToast = document.querySelector(".success-toast");

    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement("div");

    toast.className =
        "success-toast fixed top-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-50";

    toast.innerHTML = `✅ ${message}`;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.style.opacity = "0";

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 3000);
}

//CHECK URL PARAMS or search params 
const urlParams = new URLSearchParams(window.location.search);


const success = urlParams.get("success");

if (success === "true") {

    showSuccessToastMessage(
        "Thank you! Your inquiry has been submitted successfully. Our counselor will contact you shortly."
    );

    // REMOVE PARAM FROM URL
    window.history.replaceState(
        {},
        document.title,
        window.location.pathname
    );
}






ctaInquiryBtn.addEventListener('click', openInquiryModal);

    


//Tab Switching Logic for Modal
const modalCoursesTab = document.getElementById('modalCoursesTab');
const modalDegreeTab = document.getElementById('modalDegreeTab');
const modalCourseOptions = document.getElementById('modalCourseOptions');
const modalDegreeOptions = document.getElementById('modalDegreeOptions');

if (modalCoursesTab && modalDegreeTab) {
    modalCoursesTab.addEventListener('click', () => {
        modalCoursesTab.classList.add('active');
        modalDegreeTab.classList.remove('active');
        modalCourseOptions.classList.remove('hidden');
        modalDegreeOptions.classList.add('hidden');
    });
    
    modalDegreeTab.addEventListener('click', () => {
        modalDegreeTab.classList.add('active');
        modalCoursesTab.classList.remove('active');
        modalDegreeOptions.classList.remove('hidden');
        modalCourseOptions.classList.add('hidden');
    });
}





// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');

if (menuBtn) {
    menuBtn.addEventListener('click', () => mobileMenu.classList.remove('hidden'));
    closeMenu.addEventListener('click', () => mobileMenu.classList.add('hidden'));
}

// Close mobile menu when clicking on links
document.querySelectorAll('#mobileMenu a').forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenu) mobileMenu.classList.add('hidden');
    });
});

// Scroll reveal
const revealElements = document.querySelectorAll('.scroll-reveal');
const observer = new IntersectionObserver((entries) => { 
    entries.forEach(e => { 
        if (e.isIntersecting) { 
            e.target.classList.add('visible'); 
            observer.unobserve(e.target); 
        } 
    }); 
}, { threshold: 0.1 });
revealElements.forEach(el => observer.observe(el));

//Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => { 
    anchor.addEventListener('click', function(e) { 
        const href = this.getAttribute('href'); 
        if (href !== "#" && href !== "") { 
            const target = document.querySelector(href); 
            if (target) { 
                e.preventDefault(); 
                target.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            } 
        } 
    }); 
});
