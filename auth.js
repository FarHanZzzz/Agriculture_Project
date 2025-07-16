// Authentication functions
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in when loading any page
    const isLoginPage = window.location.pathname.endsWith('index.html') || 
                       window.location.pathname.endsWith('/');
    
    if (localStorage.getItem('isLoggedIn') === 'true') {
        if (isLoginPage) {
            window.location.href = 'dashboard.html';
        }
    } else {
        if (!isLoginPage) {
            window.location.href = 'index.html';
        }
    }
    
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            
            // Simple validation
            if (!username || !password) {
                alert('Please enter both username and password');
                return;
            }
            
            // Hardcoded admin credentials (for demo purposes)
            if (username === 'admin' && password === 'admin123') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid credentials. Please use admin/admin123');
                document.getElementById('password').value = '';
            }
        });
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            window.location.href = 'index.html';
        });
    }
    
    // Display username in navbar if logged in
    const usernameDisplay = document.getElementById('usernameDisplay');
    if (usernameDisplay) {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            usernameDisplay.textContent = storedUsername;
        }
    }
});