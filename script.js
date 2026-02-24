document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            alert('Mobile menu toggled. In a production build, this would open a side menu or fullscreen overlay.');
        });
    }

    // Scroll Reveal Animation with Intersection Observer
    const reveals = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Adjust scroll position to account for fixed navbar
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - setOffset(targetId, navbarHeight);

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    function setOffset(id, navHeight) {
        // give home top 0, others give nav height + some padding
        if (id === '#home') return 0;
        return navHeight;
    }

    // Interactive Book Button & Modal
    const bookBtn = document.getElementById('bookBtn');
    const modal = document.getElementById('bookingModal');
    const closeBtn = document.querySelector('.close-btn');
    const tableItems = document.querySelectorAll('.table-item.available');
    const confirmBtn = document.getElementById('confirmBooking');
    let selectedTable = null;

    if (bookBtn && modal) {
        bookBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('show');
        });

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            resetSelection();
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                resetSelection();
            }
        });

        tableItems.forEach(item => {
            item.addEventListener('click', function () {
                // Remove selected from all
                tableItems.forEach(t => t.classList.remove('selected'));
                // Add selected to clicked
                this.classList.add('selected');
                selectedTable = this.getAttribute('data-table');
                confirmBtn.disabled = false;
            });
        });

        confirmBtn.addEventListener('click', () => {
            if (selectedTable) {
                // Hide table grid and title
                document.querySelector('.table-grid').style.display = 'none';
                document.querySelector('.modal-content h2').style.display = 'none';
                document.getElementById('modalActions').style.display = 'none';

                // Show success view
                const successView = document.getElementById('bookingSuccess');
                const label = document.getElementById('confirmedTableLabel');
                label.textContent = `Table ${selectedTable}`;
                successView.style.display = 'block';

                // Auto close modal after a few seconds
                setTimeout(() => {
                    modal.classList.remove('show');
                    resetSelection();
                }, 3000);
            }
        });

        function resetSelection() {
            tableItems.forEach(t => t.classList.remove('selected'));
            selectedTable = null;
            confirmBtn.disabled = true;

            // Reset view to default
            document.querySelector('.table-grid').style.display = 'grid';
            document.querySelector('.modal-content h2').style.display = 'block';
            document.getElementById('modalActions').style.display = 'block';
            document.getElementById('bookingSuccess').style.display = 'none';
        }
    }
});
