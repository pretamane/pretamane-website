// API Client Library for Thaw Zin Portfolio Backend Integration
// Centralized API calls, error handling, and loading states

class ApiClient {
    constructor() {
        this.baseURL = ''; // Relative path through Caddy proxy
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    // Generic API request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            method: options.method || 'GET',
            headers: { ...this.defaultHeaders, ...options.headers }
        };

        if (options.body && typeof options.body === 'object') {
            config.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, config);
            return await this.handleResponse(response);
        } catch (error) {
            throw new ApiError('Network error', 0, error.message);
        }
    }

    // Handle API response
    async handleResponse(response) {
        let data;
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            throw new ApiError(
                data.error || data.message || 'API request failed',
                response.status,
                data
            );
        }

        return data;
    }

    // GET request
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request(url, { method: 'GET' });
    }

    // POST request
    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: data
        });
    }

    // PUT request
    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: data
        });
    }

    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // Upload file with progress
    async uploadFile(endpoint, fileData, onProgress = null) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();

            // Add file data
            Object.keys(fileData).forEach(key => {
                if (fileData[key] !== undefined && fileData[key] !== null) {
                    formData.append(key, fileData[key]);
                }
            });

            const xhr = new XMLHttpRequest();

            // Track upload progress
            if (onProgress) {
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        onProgress({
                            loaded: e.loaded,
                            total: e.total,
                            percent: percentComplete
                        });
                    }
                });
            }

            // Handle response
            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        resolve(data);
                    } catch (e) {
                        resolve(xhr.responseText);
                    }
                } else {
                    try {
                        const error = JSON.parse(xhr.responseText);
                        reject(new ApiError(error.error || error.message || 'Upload failed', xhr.status));
                    } catch (e) {
                        reject(new ApiError('Upload failed', xhr.status));
                    }
                }
            });

            // Handle errors
            xhr.addEventListener('error', () => {
                reject(new ApiError('Network error during upload', 0));
            });

            xhr.addEventListener('abort', () => {
                reject(new ApiError('Upload cancelled', 0));
            });

            xhr.open('POST', `${this.baseURL}${endpoint}`);
            xhr.send(formData);
        });
    }
}

// API Error class
class ApiError extends Error {
    constructor(message, status, data = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

// Loading state manager
class LoadingManager {
    constructor() {
        this.loadingStates = new Map();
    }

    // Set loading state for an element
    setLoading(element, isLoading, originalText = '') {
        if (isLoading) {
            this.loadingStates.set(element, {
                originalText: element.innerHTML,
                originalDisabled: element.disabled
            });

            element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            element.disabled = true;
        } else {
            const state = this.loadingStates.get(element);
            if (state) {
                element.innerHTML = originalText || state.originalText;
                element.disabled = state.originalDisabled;
                this.loadingStates.delete(element);
            }
        }
    }

    // Check if element is loading
    isLoading(element) {
        return this.loadingStates.has(element);
    }

    // Clear all loading states
    clearAll() {
        this.loadingStates.clear();
    }
}

// Notification manager
class NotificationManager {
    constructor() {
        this.container = null;
        this.createContainer();
    }

    createContainer() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'notification-container';
            this.container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
                pointer-events: none;
            `;
            document.body.appendChild(this.container);
        }
    }

    // Show notification
    show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: ${this.getBackgroundColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideInRight 0.3s ease;
            pointer-events: auto;
        `;

        const icon = this.getIcon(type);
        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                margin-left: auto;
                padding: 5px;
                border-radius: 50%;
                opacity: 0.7;
            ">
                <i class="fas fa-times"></i>
            </button>
        `;

        this.container.appendChild(notification);

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.style.animation = 'slideOutRight 0.3s ease';
                    setTimeout(() => notification.remove(), 300);
                }
            }, duration);
        }

        return notification;
    }

    getBackgroundColor(type) {
        const colors = {
            success: 'linear-gradient(135deg, #3fb950, #7ce38b)',
            error: 'linear-gradient(135deg, #ff7b72, #ffae57)',
            warning: 'linear-gradient(135deg, #f39c12, #e67e22)',
            info: 'linear-gradient(135deg, #59b8ff, #3498db)'
        };
        return colors[type] || colors.info;
    }

    getIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-triangle',
            warning: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
}

// Form validator
class FormValidator {
    constructor(form) {
        this.form = form;
        this.errors = new Map();
        this.setupValidation();
    }

    setupValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const rules = this.getFieldRules(field);
        let isValid = true;
        let errorMessage = '';

        for (const rule of rules) {
            if (!rule.test(field.value)) {
                isValid = false;
                errorMessage = rule.message;
                break;
            }
        }

        if (isValid) {
            this.clearFieldError(field);
        } else {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    getFieldRules(field) {
        const rules = [];

        // Required field
        if (field.hasAttribute('required')) {
            rules.push({
                test: value => value && value.trim().length > 0,
                message: 'This field is required'
            });
        }

        // Email validation
        if (field.type === 'email') {
            rules.push({
                test: value => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                message: 'Please enter a valid email address'
            });
        }

        // File validation
        if (field.type === 'file') {
            const accept = field.getAttribute('accept');
            if (accept) {
                const allowedTypes = accept.split(',').map(type => type.trim());
                rules.push({
                    test: value => {
                        if (!value) return true;
                        const file = field.files[0];
                        return allowedTypes.some(type => {
                            if (type.startsWith('.')) {
                                return file.name.toLowerCase().endsWith(type.toLowerCase());
                            }
                            return file.type.match(type.replace('*', '.*'));
                        });
                    },
                    message: `Please select a valid file type: ${accept}`
                });
            }
        }

        return rules;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);

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
        this.errors.set(field, errorDiv);
    }

    clearFieldError(field) {
        field.style.borderColor = '#30363d';

        const existingError = this.errors.get(field);
        if (existingError) {
            existingError.remove();
            this.errors.delete(field);
        }
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    clearAllErrors() {
        this.errors.forEach(errorElement => errorElement.remove());
        this.errors.clear();

        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.style.borderColor = '#30363d';
        });
    }
}

// Export global instances
window.apiClient = new ApiClient();
window.loadingManager = new LoadingManager();
window.notificationManager = new NotificationManager();

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
