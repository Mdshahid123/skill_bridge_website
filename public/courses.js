  // Filter and Search Functionality
        const coursesGrid = document.getElementById('coursesGrid');
        const courseCards = document.querySelectorAll('.course-card');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const searchInput = document.getElementById('searchCourseInput');
        const mobileSearchInput = document.getElementById('mobileSearchInput');
        const resultsCountSpan = document.getElementById('resultsCount');
        const noResultsDiv = document.getElementById('noResults');
        
        let currentFilter = 'all';
        let currentSearch = '';
        
        function filterCourses() {
            let visibleCount = 0;
            courseCards.forEach(card => {
                const category = card.dataset.category;
                const courseName = card.dataset.name.toLowerCase();
                let matchesFilter = currentFilter === 'all' || category === currentFilter;
                let matchesSearch = courseName.includes(currentSearch.toLowerCase());
                if (matchesFilter && matchesSearch) {
                    card.style.display = '';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            resultsCountSpan.textContent = `Showing ${visibleCount} course${visibleCount !== 1 ? 's' : ''}`;
            if (visibleCount === 0) { noResultsDiv.classList.remove('hidden'); } 
            else { noResultsDiv.classList.add('hidden'); }
        }
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                filterCourses();
            });
        });
        
        function handleSearch(e) { currentSearch = e.target.value; filterCourses(); }
        if (searchInput) searchInput.addEventListener('input', handleSearch);
        if (mobileSearchInput) mobileSearchInput.addEventListener('input', handleSearch);
        
        document.querySelectorAll('.view-course-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const courseId = link.dataset.id;
                window.location.href = `/viewCourse/${courseId}`;
            });
        });
        
        // Mobile menu
        const menuBtn = document.getElementById('menuBtn'), mobileMenu = document.getElementById('mobileMenu'), closeMenu = document.getElementById('closeMenu');
        if (menuBtn) { menuBtn.addEventListener('click', () => mobileMenu.classList.remove('hidden')); closeMenu.addEventListener('click', () => mobileMenu.classList.add('hidden')); }
        
        // Enrollment Modal
        const enrollModal = document.getElementById('enrollModal');
        const enrollBtns = document.querySelectorAll('.enroll-btn');
        const closeEnrollModal = document.getElementById('closeEnrollModal');
        const enrollmentForm = document.getElementById('enrollmentForm');
        
        function openEnrollModal() { enrollModal.classList.add('active'); document.body.style.overflow = 'hidden'; }
        function closeEnrollModalFunc() { enrollModal.classList.remove('active'); document.body.style.overflow = ''; }
        
        enrollBtns.forEach(btn => btn.addEventListener('click', openEnrollModal));
        if (closeEnrollModal) closeEnrollModal.addEventListener('click', closeEnrollModalFunc);
        if (enrollModal) enrollModal.addEventListener('click', (e) => { if (e.target === enrollModal) closeEnrollModalFunc(); });
        if (enrollmentForm) {
            enrollmentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('🎉 Thank you for your interest! Our counselor will contact you within 24 hours.');
                closeEnrollModalFunc();
                enrollmentForm.reset();
            });
        }