document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loanForm');
    const steps = document.querySelectorAll('.form-step');
    const progress = document.getElementById('progress');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    let currentStep = 1;

    // Update progress bar
    function updateProgress() {
        const progressWidth = ((currentStep - 1) / (steps.length - 1)) * 100;
        progress.style.width = `${progressWidth}%`;
    }

    // Update step indicators
    function updateSteps() {
        steps.forEach((step, index) => {
            if (index + 1 === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    // Update navigation buttons
    function updateButtons() {
        prevBtn.disabled = currentStep === 1;
        if (currentStep === steps.length) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }

    // Validate current step
    function validateStep() {
        const currentStepElement = steps[currentStep - 1];
        const inputs = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('invalid');
            } else {
                input.classList.remove('invalid');
            }
        });

        return isValid;
    }

    // Show next step
    function nextStep() {
        if (validateStep()) {
            currentStep++;
            updateProgress();
            updateSteps();
            updateButtons();
        }
    }

    // Show previous step
    function prevStep() {
        currentStep--;
        updateProgress();
        updateSteps();
        updateButtons();
    }

    // Handle form submission
    function handleSubmit(e) {
        e.preventDefault();
        if (validateStep()) {
            // Here you would typically send the form data to your server
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message active';
            successMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <h2>Application Submitted Successfully!</h2>
                <p>Thank you for applying with Diamond Finance. We will review your application and contact you shortly.</p>
            `;
            
            form.innerHTML = '';
            form.appendChild(successMessage);
        }
    }

    // Event listeners
    nextBtn.addEventListener('click', nextStep);
    prevBtn.addEventListener('click', prevStep);
    form.addEventListener('submit', handleSubmit);

    // Initialize form
    updateProgress();
    updateSteps();
    updateButtons();

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