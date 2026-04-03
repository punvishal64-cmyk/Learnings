// Select the form and message elements
const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

// Add an event listener for form submission
form.addEventListener('submit', function(event) {
    // Prevent the default page reload
    event.preventDefault();

    // Get the values from the inputs
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Basic Validation
    if (name === "" || email === "" || message === "") {
        // Show error message
        formMessage.textContent = "Please fill out all fields.";
        formMessage.className = "form-message error";
        return;
    }

    // Email format validation using a simple Regular Expression
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  
    if (!emailPattern.test(email)) {
        formMessage.textContent = "Please enter a valid email address.";
        formMessage.className = "form-message error";
        return;
    }

    // If everything is correct, simulate a successful submission
    formMessage.textContent = `Thank you, ${name}! Your message has been sent.`;
    formMessage.className = "form-message success";

    // Clear the form fields
    form.reset();

    // Remove the success message after 5 seconds
    setTimeout(() => {
        formMessage.textContent = "";
    }, 5000);
});


// --- Scroll Reveal Animation ---
// Create the observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        // If the element is visible on screen
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1 // Triggers when 10% of the element is visible
});

// Grab all elements with the 'reveal' class and observe them
const hiddenElements = document.querySelectorAll('.reveal');
hiddenElements.forEach((el) => observer.observe(el));