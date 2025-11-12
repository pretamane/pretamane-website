// Backend API endpoint (relative path so it works with IP or domain behind Caddy)
const API_ENDPOINT = '/contact';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    setupFormValidation();
});

function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        console.log('Contact form initialized successfully');
    } else {
        console.error('Contact form element not found');
    }
}

function setupFormValidation() {
    const inputs = document.querySelectorAll('#contactForm input, #contactForm textarea, #contactForm select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    if (field.hasAttribute('required') && !field.value.trim()) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#ff7b72';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
        color: #ff7b72;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    `;
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '#30363d';
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Validate all fields first
    const inputs = document.querySelectorAll('#contactForm input, #contactForm textarea, #contactForm select');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please fix the errors in the form', 'error');
        return;
    }

    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        company: document.getElementById('company').value.trim() || 'Not specified',
        service: document.getElementById('service').value || 'Not specified',
        budget: document.getElementById('budget').value || 'Not specified',
        message: document.getElementById('message').value.trim(),
        source: 'thaw-zin-portfolio',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        pageUrl: window.location.href
    };

    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    setButtonLoading(submitBtn, true);

    try {
        console.log('Sending form data to AWS API:', formData);
        
        // Send to AWS API Gateway
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        console.log('API Response status:', response.status);
        
        let result;
        try {
            result = await response.json();
            console.log('API Response data:', result);
        } catch (e) {
            console.log('API Response (non-JSON):', await response.text());
            throw new Error('Invalid response from server');
        }

        if (response.ok) {
            // Success
            showNotification('Message sent successfully! I\'ll get back to you within 24 hours.', 'success');
            document.getElementById('contactForm').reset();
            
            // Track successful submission
            console.log('Form submitted successfully to AWS Lambda');
        } else {
            throw new Error(result.error || result.message || `Server error: ${response.status}`);
        }
    } catch (error) {
        console.error('API Error:', error);
        showNotification('Sorry, there was an error sending your message. Please try emailing me directly.', 'error');
        
        // Fallback to mailto after a delay
        setTimeout(() => {
            initiateEmailFallback(formData);
        }, 2000);
    } finally {
        setButtonLoading(submitBtn, false, originalText);
    }
}

function setButtonLoading(button, isLoading, originalText = '') {
    if (isLoading) {
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        button.disabled = true;
    } else {
        button.innerHTML = originalText || button.dataset.originalText || '<i class="fas fa-paper-plane"></i> Send Message';
        button.disabled = false;
    }
}

function initiateEmailFallback(formData) {
    const emailBody = `New Contact Form Submission (Fallback):

Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company}
Service Required: ${formData.service}
Budget Range: ${formData.budget}

Message:
${formData.message}

---
This message was sent via the fallback method because the API request failed.
Timestamp: ${new Date().toLocaleString()}
User Agent: ${navigator.userAgent}
Page URL: ${window.location.href}`;

    const mailtoLink = `mailto:thawzin252467@gmail.com?subject=Contact Form Submission from ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoLink, '_blank');
}

function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.form-notification');
    existingNotifications.forEach(notification => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    });

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        z-index: 10000;
        font-weight: bold;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        transition: all 0.3s ease;
        max-width: 400px;
        backdrop-filter: blur(10px);
    `;

    // Set background based on type
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, rgba(63, 185, 80, 0.95), rgba(124, 227, 139, 0.95))';
        notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    } else {
        notification.style.background = 'linear-gradient(135deg, rgba(255, 123, 114, 0.95), rgba(255, 174, 87, 0.95))';
        notification.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    }

    // Add to document
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 10);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    setupFormValidation();
    // Mobile menu is now handled by navigation.js
});

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        showNotification,
        handleFormSubmit
    };
}