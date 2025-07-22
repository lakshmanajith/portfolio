// Animate fade-in elements on scroll
function animateOnScroll() {
    const fadeEls = document.querySelectorAll('.fade-in-up');
    fadeEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
            el.style.animationPlayState = 'running';
        }
    });
}

// Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Copy to clipboard with visual feedback
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        const btn = event.target.closest('.copy-btn');
        const originalText = btn.innerHTML;
        const originalBg = btn.style.background;
        
        // Visual feedback
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        btn.style.background = 'var(--accent-primary)';
        btn.style.color = 'var(--bg-primary)';
        
        // Reset after 2 seconds
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = originalBg;
            btn.style.color = 'var(--text-primary)';
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
    }
}

// Menu functionality
function setupMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (menuToggle && dropdownMenu) {
        // Toggle menu on button click
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Close all sections when closing the menu
            if (!dropdownMenu.classList.contains('active')) {
                document.querySelectorAll('.menu-section').forEach(section => {
                    section.classList.remove('active');
                });
            }
        });

        // Setup section toggles
        document.querySelectorAll('.section-header').forEach(header => {
            header.addEventListener('click', (e) => {
                e.stopPropagation();
                const section = header.closest('.menu-section');
                
                // Close other sections
                document.querySelectorAll('.menu-section').forEach(otherSection => {
                    if (otherSection !== section) {
                        otherSection.classList.remove('active');
                    }
                });
                
                // Toggle current section
                section.classList.toggle('active');
            });
        });

        // Close menu when clicking anywhere else
        document.addEventListener('click', (e) => {
            if (!dropdownMenu.contains(e.target) && dropdownMenu.classList.contains('active')) {
                dropdownMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                // Close all sections
                document.querySelectorAll('.menu-section').forEach(section => {
                    section.classList.remove('active');
                });
            }
        });

        // Prevent menu from closing when clicking inside it
        dropdownMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('DOMContentLoaded', () => {
    // Initialize menu
    setupMenu();
    
    // Trigger initial animation
    document.querySelectorAll('.fade-in, .fade-in-up').forEach(el => {
        el.style.animationPlayState = 'running';
    });
    animateOnScroll();

    // Initialize feedback system
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        const nameInput = feedbackForm.querySelector('#name');
        const feedbackInput = feedbackForm.querySelector('#feedback');
        const ratingInput = feedbackForm.querySelector('#rating');
        const submitBtn = feedbackForm.querySelector('.submit-btn');
        const stars = document.querySelectorAll('#ratingStars i');
        
        // Load existing feedback
        loadFeedback();

        // Initialize star rating system with proper styling
        function initializeStars() {
            stars.forEach(star => {
                star.style.transition = 'transform 0.2s, color 0.2s';
                star.classList.add('far'); // Start with empty stars
            });
        }
        
        // Star rating handling
        stars.forEach(star => {
            star.addEventListener('mouseover', () => {
                const rating = parseInt(star.getAttribute('data-rating'));
                stars.forEach(s => {
                    const starRating = parseInt(s.getAttribute('data-rating'));
                    s.classList.remove('fas', 'far');
                    if (starRating <= rating) {
                        s.classList.add('fas');
                        s.style.color = '#ffd700'; // Golden color on hover
                    } else {
                        s.classList.add('far');
                        s.style.color = 'var(--text-secondary)'; // Theme color for empty stars
                    }
                });
            });

            star.addEventListener('mouseout', () => {
                const currentRating = parseInt(ratingInput.value) || 0;
                stars.forEach(s => {
                    const starRating = parseInt(s.getAttribute('data-rating'));
                    s.classList.remove('fas', 'far');
                    if (starRating <= currentRating) {
                        s.classList.add('fas');
                        s.style.color = '#ffd700'; // Golden color for selected rating
                    } else {
                        s.classList.add('far');
                        s.style.color = 'var(--text-secondary)'; // Theme color for empty stars
                    }
                });
            });

            star.addEventListener('click', () => {
                const rating = star.getAttribute('data-rating');
                ratingInput.value = rating;
                stars.forEach(s => {
                    const starRating = parseInt(s.getAttribute('data-rating'));
                    s.classList.remove('fas', 'far');
                    if (starRating <= rating) {
                        s.classList.add('fas');
                        s.style.color = '#ffd700'; // Golden color for selected stars
                    } else {
                        s.classList.add('far');
                        s.style.color = 'var(--text-secondary)'; // Theme color for empty stars
                    }
                });
            });
        });

        // Initialize stars
        initializeStars();

        // Show error message
        function showError(input, message) {
            const errorDiv = document.getElementById(`${input.id}-error`);
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            input.style.borderColor = '#ff4d4d';
        }

        // Clear error message
        function clearError(input) {
            const errorDiv = document.getElementById(`${input.id}-error`);
            errorDiv.style.display = 'none';
            input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }

        // Form validation
        function validateForm() {
            let isValid = true;
            
            clearError(nameInput);
            clearError(feedbackInput);

            if (nameInput.value.trim().length < 2) {
                showError(nameInput, 'Name must be at least 2 characters long');
                isValid = false;
            }

            if (feedbackInput.value.trim().length < 10) {
                showError(feedbackInput, 'Feedback must be at least 10 characters long');
                isValid = false;
            }

            if (ratingInput.value === '0') {
                alert('Please select a rating');
                isValid = false;
            }

            return isValid;
        }

        // Load feedback from localStorage
        function loadFeedback() {
            const feedbackList = document.getElementById('feedbackList');
            const feedback = JSON.parse(localStorage.getItem('feedback') || '[]');
            
            feedbackList.innerHTML = feedback.map(item => `
                <div class="feedback-item fade-in-up">
                    <div class="feedback-header">
                        <span class="feedback-author">${item.name}</span>
                        <span class="feedback-date">${new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <div class="feedback-rating">
                        ${Array(5).fill(0).map((_, i) => 
                            `<i class="${i < item.rating ? 'fas' : 'far'} fa-star" 
                                style="color: ${i < item.rating ? '#ffd700' : 'var(--text-secondary)'};
                                margin-right: 0.2rem;"></i>`
                        ).join('')}
                    </div>
                    <div class="feedback-content">${item.feedback}</div>
                </div>
            `).join('');
        }

        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateForm()) return;

            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            // Create new feedback object
            const newFeedback = {
                name: nameInput.value.trim(),
                rating: parseInt(ratingInput.value),
                feedback: feedbackInput.value.trim(),
                date: new Date().toISOString()
            };

            // Get existing feedback and add new one
            const feedback = JSON.parse(localStorage.getItem('feedback') || '[]');
            feedback.unshift(newFeedback); // Add to beginning of array
            localStorage.setItem('feedback', JSON.stringify(feedback));

            // Reset form
            feedbackForm.reset();
            ratingInput.value = '0';
            highlightStars(0);
            submitBtn.innerHTML = originalBtnHtml;
            submitBtn.disabled = false;

            // Reload feedback display
            loadFeedback();
        });

        // Real-time validation
        nameInput.addEventListener('input', () => clearError(nameInput));
        feedbackInput.addEventListener('input', () => clearError(feedbackInput));
    }
});
