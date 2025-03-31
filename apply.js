document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loanForm');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-steps .step');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    const currentStepSpan = document.getElementById('currentStep');
    const totalStepsSpan = document.getElementById('totalSteps');
    const fileInput = document.getElementById('id_upload');
    const filePreview = document.getElementById('id_preview');
    const fileName = document.querySelector('.file-name');
    const uploadBtn = document.getElementById('upload_btn');

    let currentStep = 1;
    const totalSteps = steps.length;

    // Initialize form
    updateFormState();
    totalStepsSpan.textContent = totalSteps;

    // File upload handling
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                showMessage('File size should not exceed 5MB', 'error');
                fileInput.value = '';
                return;
            }

            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            if (!validTypes.includes(file.type)) {
                showMessage('Please upload a valid file type (JPG, PNG, or PDF)', 'error');
                fileInput.value = '';
                return;
            }

            fileName.textContent = file.name;

            // Show preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    filePreview.src = e.target.result;
                    filePreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                filePreview.style.display = 'none';
            }
        } else {
            fileName.textContent = 'No file chosen';
            filePreview.style.display = 'none';
        }
    });

    uploadBtn.addEventListener('click', () => fileInput.click());

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
                
                // Simulate API call
                await simulateSubmission(formData);
                
                // Show success message and reset form
                showMessage('Application submitted successfully! We will contact you shortly.', 'success');
                setTimeout(() => {
                    form.reset();
                    currentStep = 1;
                    updateFormState();
                    filePreview.style.display = 'none';
                    fileName.textContent = 'No file chosen';
                }, 2000);
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

        currentStepSpan.textContent = currentStep;

        // Update buttons
        prevBtn.disabled = currentStep === 1;
        if (currentStep === totalSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-flex';
        } else {
            nextBtn.style.display = 'inline-flex';
            submitBtn.style.display = 'none';
        }

        // Smooth scroll to form top
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

                // Additional validation based on input type
                if (input.value.trim()) {
                    if (input.type === 'email') {
                        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailPattern.test(input.value)) {
                            isValid = false;
                            showInputError(input, 'Please enter a valid email address');
                        }
                    }

                    if (input.type === 'tel') {
                        const phonePattern = /^\+?\d{10,}$/;
                        if (!phonePattern.test(input.value.replace(/\s+/g, ''))) {
                            isValid = false;
                            showInputError(input, 'Please enter a valid phone number');
                        }
                    }

                    if (input.type === 'number') {
                        const value = Number(input.value);
                        if (input.hasAttribute('min') && value < Number(input.getAttribute('min'))) {
                            isValid = false;
                            showInputError(input, `Minimum value is ${input.getAttribute('min')}`);
                        }
                    }
                }
            }
        });

        if (!isValid) {
            showMessage('Please fill in all required fields correctly', 'error');
        }

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
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        
        document.body.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }

    // Simulate form submission (replace with actual API call)
    function simulateSubmission(formData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form data:', Object.fromEntries(formData));
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