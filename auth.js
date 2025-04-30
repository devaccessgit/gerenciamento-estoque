// auth.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
  
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
  
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
  
        // Usuário e senha padrão
        if (email === 'admin@teste.com' && senha === '123456') {
          localStorage.setItem('logado', true);
          window.location.href = 'index.html';
        } else {
          alert('E-mail ou senha incorretos!');
        }
      });
    }
  });
  
  function logout() {
    localStorage.removeItem('logado');
    window.location.href = 'login.html';
  }