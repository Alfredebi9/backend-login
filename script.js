// script.js
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const homeContainer = document.getElementById('home-container');
  const loginContainer = document.getElementById('login-container');
  const registerContainer = document.getElementById('register-container');
  const userNameSpan = document.getElementById('user-name');
  const logoutButton = document.getElementById('logout-btn');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = loginForm.querySelector('#login-name').value;
    const password = loginForm.querySelector('#login-password').value;

    const response = await fetch('/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, password })
    });

    const data = await response.json();
    if (response.ok) {
      homeContainer.style.display = 'block';
      loginContainer.style.display = 'none';
      registerContainer.style.display = 'none';
      userNameSpan.textContent = name;
    } else {
      alert(data.message);
    }
  });

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = registerForm.querySelector('#register-name').value;
    const password = registerForm.querySelector('#register-password').value;

    const response = await fetch('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, password })
    });

    if (response.ok) {
      alert('Registration successful! Please login.');
      loginForm.reset();
      loginContainer.style.display = 'block';
      registerContainer.style.display = 'none';
    } else {
      alert('Registration failed.');
    }
  });

  logoutButton.addEventListener('click', () => {
    homeContainer.style.display = 'none';
    loginContainer.style.display = 'block';
    registerContainer.style.display = 'none';
  });
});
