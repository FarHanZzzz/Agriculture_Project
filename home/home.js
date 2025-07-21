    // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.querySelector('.nav-links');
  
  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
  
  // Authentication System
  const ADMIN_CREDENTIALS = {
    email: "admin@gmail.com",
    password: "admin123",
    role: "admin"
  };
  
  let registeredUsers = [
    // Pre-populated with some demo users (optional)
    {
      email: "farmer1@gmail.com",
      password: "farmer123",
      role: "farmer",
      name: "John Farmer"
    },
    {
      email: "analyst1@gmail.com",
      password: "analyst123",
      role: "data_analyst",
      name: "Sarah Analyst"
    },
    {
      email: "pm1@gmail.com",
      password: "pm123",
      role: "product_manager",
      name: "Mike Manager"
    }
  ];
  
  // Modal Functionality
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const modal = document.getElementById('authModal');
  const closeModal = document.querySelector('.close-modal');
  const switchToRegister = document.getElementById('switchToRegister');
  const switchToLogin = document.getElementById('switchToLogin');
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  const modalTitle = document.getElementById('modalTitle');
  
  // Add role dropdown to login form
  const loginForm = document.querySelector('#login-tab form');
  const loginRoleSelect = document.createElement('div');
  loginRoleSelect.className = 'form-group';
  loginRoleSelect.innerHTML = `
    <select id="loginRole" required>
      <option value="">Select your role</option>
      <option value="admin">Admin</option>
      <option value="farmer">Farmer</option>
      <option value="data_analyst">Data Analyst</option>
      <option value="product_manager">Product Manager</option>
    </select>
  `;
  loginForm.insertBefore(loginRoleSelect, loginForm.querySelector('.remember-forgot'));
  
  // Update register form to use email and name
  const registerForm = document.querySelector('#register-tab form');
  registerForm.innerHTML = `
    <div class="form-group">
      <input type="text" id="regName" placeholder="Full Name" required>
    </div>
    <div class="form-group">
      <input type="email" id="regEmail" placeholder="Email Address" required>
    </div>
    <div class="form-group">
      <input type="password" id="regPassword" placeholder="Password" required>
    </div>
    <div class="form-group">
      <input type="password" id="regConfirmPassword" placeholder="Confirm Password" required>
    </div>
    <div class="form-group">
      <select id="regRole" required>
        <option value="">Select your role</option>
        <option value="farmer">Farmer</option>
        <option value="data_analyst">Data Analyst</option>
        <option value="product_manager">Product Manager</option>
      </select>
    </div>
    <div class="form-group">
      <input type="checkbox" id="terms" required>
      <label for="terms">I agree to the Terms & Conditions</label>
    </div>
    <button type="submit" class="submit-btn">Create Account</button>
    <p class="signup-link">Already have an account? <a href="#" id="switchToLogin">Login Now</a></p>
  `;
  
  // Re-attach event listeners after modifying the form
  document.getElementById('switchToLogin').addEventListener('click', (e) => {
    e.preventDefault();
    tabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    document.querySelector('.tab[data-tab="login"]').classList.add('active');
    document.getElementById('login-tab').classList.add('active');
    modalTitle.textContent = 'Login to Your Account';
  });
  
  // Open modal for login
  loginBtn.addEventListener('click', () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  // Open modal for registration
  registerBtn.addEventListener('click', () => {
    modal.classList.add('active');
    // Switch to register tab
    tabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    document.querySelector('.tab[data-tab="register"]').classList.add('active');
    document.getElementById('register-tab').classList.add('active');
    modalTitle.textContent = 'Create an Account';
    document.body.style.overflow = 'hidden';
  });
  
  // Close modal
  closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  });
  
  // Close modal when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });
  
  // Switch between login and register tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.getAttribute('data-tab');
      
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(`${tabId}-tab`).classList.add('active');
      
      if (tabId === 'login') {
        modalTitle.textContent = 'Login to Your Account';
      } else {
        modalTitle.textContent = 'Create an Account';
      }
    });
  });
  
  // Switch to register from login
  switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    tabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    document.querySelector('.tab[data-tab="register"]').classList.add('active');
    document.getElementById('register-tab').classList.add('active');
    modalTitle.textContent = 'Create an Account';
  });
  
  // Login Form Submission
  document.querySelector('#login-tab form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.querySelector('#login-tab input[type="email"]').value;
    const password = document.querySelector('#login-tab input[type="password"]').value;
    const role = document.querySelector('#loginRole').value;
    
    if (!role) {
      alert('Please select your role');
      return;
    }
    
    // Check admin credentials
    if (role === 'admin') {
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        alert('Admin login successful! Redirecting to admin dashboard...');
        // Store user data in session
        sessionStorage.setItem('currentUser', JSON.stringify(ADMIN_CREDENTIALS));
        // Redirect to admin dashboard
        setTimeout(() => {
          window.location.href = '/admin';
        }, 1000);
      } else {
        alert('Invalid admin credentials');
      }
      return;
    }
    
    // Check regular user credentials
    const user = registeredUsers.find(u => 
      u.email === email && 
      u.password === password && 
      u.role === role
    );
    
    if (user) {
      alert(`Login successful! Welcome ${user.name || email}`);
      // Store user data in session
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      // Redirect to appropriate dashboard based on role
      setTimeout(() => {
        window.location.href = `${role}-dashboard.html`;
      }, 1000);
    } else {
      alert('Invalid credentials or role mismatch');
    }
  });
  
  // Register Form Submission
  document.querySelector('#register-tab form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const role = document.getElementById('regRole').value;
    const terms = document.getElementById('terms').checked;
    
    // Validation
    if (!role) {
      alert('Please select your role');
      return;
    }
    
    if (!terms) {
      alert('You must agree to the terms and conditions');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (registeredUsers.some(u => u.email === email)) {
      alert('Email already registered');
      return;
    }
    
    // Create new user object
    const newUser = {
      name,
      email,
      password,
      role
    };
    
    // Add new user
    registeredUsers.push(newUser);
    
    alert(`Registration successful! You are now registered as a ${role.replace('_', ' ')}. Please login.`);
    
    // Store user data in session and redirect (optional auto-login)
    sessionStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // Switch to login tab
    tabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    document.querySelector('.tab[data-tab="login"]').classList.add('active');
    document.getElementById('login-tab').classList.add('active');
    modalTitle.textContent = 'Login to Your Account';
    
    // Clear form
    document.querySelector('#register-tab form').reset();
  });
  
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
        }
      }
    });
  });
