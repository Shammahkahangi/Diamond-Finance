document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loanForm');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-steps .step');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');

    let currentStep = 1;
    const totalSteps = steps.length;

    // Initialize form
    updateFormState();

    // Next button click handler
    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            currentStep++;
            updateFormState();
        }
    });

    // Previous button click handler
    prevBtn.addEventListener('click', () => {
        currentStep--;
        updateFormState();
    });

    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            submitBtn.classList.add('loading');
            try {
                // Collect all form data
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                // Here you would typically send the data to your server
                // For now, we'll just simulate a submission
                await simulateSubmission(data);
                
                // Show success message
                showMessage('Application submitted successfully! We will contact you shortly.', 'success');
                form.reset();
                currentStep = 1;
                updateFormState();
            } catch (error) {
                showMessage('There was an error submitting your application. Please try again.', 'error');
            } finally {
                submitBtn.classList.remove('loading');
            }
        }
    });

    // Update form state based on current step
    function updateFormState() {
        steps.forEach((step, index) => {
            step.classList.remove('active');
            progressSteps[index].classList.remove('active');
        });

        steps[currentStep - 1].classList.add('active');
        for (let i = 0; i < currentStep; i++) {
            progressSteps[i].classList.add('active');
        }

        // Update buttons
        prevBtn.disabled = currentStep === 1;
        if (currentStep === totalSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }

        // Scroll to top of form
        form.scrollIntoView({ behavior: 'smooth' });
    }

    // Validate current step
    function validateStep(step) {
        const currentStepElement = steps[step - 1];
        const inputs = currentStepElement.querySelectorAll('input, select, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                showInputError(input, 'This field is required');
            } else {
                clearInputError(input);
            }

            // Additional validation based on input type
            if (input.type === 'email' && input.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(input.value)) {
                    isValid = false;
                    showInputError(input, 'Please enter a valid email address');
                }
            }

            if (input.type === 'tel' && input.value) {
                const phonePattern = /^\+?\d{10,}$/;
                if (!phonePattern.test(input.value.replace(/\s+/g, ''))) {
                    isValid = false;
                    showInputError(input, 'Please enter a valid phone number');
                }
            }
        });

        return isValid;
    }

    // Show input error message
    function showInputError(input, message) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('error');
        
        let errorMessage = formGroup.querySelector('.error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            formGroup.appendChild(errorMessage);
        }
        errorMessage.textContent = message;
    }

    // Clear input error
    function clearInputError(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('error');
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Show message to user
    function showMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        
        form.insertBefore(messageElement, form.firstChild);
        
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }

    // Simulate form submission (replace with actual API call)
    function simulateSubmission(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form data:', data);
                resolve();
            }, 2000);
        });
    }

    // Add input event listeners for real-time validation
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', () => {
            clearInputError(input);
        });
    });

    // Mobile menu functionality
    const navOpenBtn = document.querySelector('.nav-open-btn');
    const navCloseBtn = document.querySelector('.nav-close-btn');
    const navbar = document.querySelector('.navbar');
    const overlay = document.querySelector('.overlay');

    function openNavbar() {
        navbar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeNavbar() {
        navbar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    navOpenBtn.addEventListener('click', openNavbar);
    navCloseBtn.addEventListener('click', closeNavbar);
    overlay.addEventListener('click', closeNavbar);

    // Close navbar when clicking a link
    document.querySelectorAll('.navbar-link').forEach(link => {
        link.addEventListener('click', closeNavbar);
    });
}); 