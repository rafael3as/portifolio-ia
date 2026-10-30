/* ============================================
   PORTFÓLIO - Rafael Andrade Simião
   JavaScript: interatividade, scroll reveal,
   modo escuro, validação de formulário
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Elementos ----
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.navbar-links a');
  const hamburger = document.querySelector('.hamburger');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-overlay a');
  const themeToggle = document.getElementById('theme-toggle');
  const contactForm = document.getElementById('contact-form');
  const sections = document.querySelectorAll('section[id]');
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  // ---- Navbar scroll ----
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;

    // Atualizar link ativo
    updateActiveLink();
  });

  // ---- Active link por seção ----
  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  // ---- Hamburger menu ----
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileOverlay.classList.toggle('active');
      document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Modo claro/escuro ----
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label',
      theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'
    );
  }

  // ---- Scroll Reveal ----
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => observer.observe(el));

  // ---- Smooth scroll para links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Validação do formulário ----
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Limpar erros
      contactForm.querySelectorAll('.form-group').forEach(g => g.classList.remove('invalid'));

      // Validar nome
      const nome = contactForm.querySelector('#form-nome');
      if (!nome.value.trim()) {
        showError(nome, 'Por favor, insira seu nome.');
        isValid = false;
      }

      // Validar email
      const email = contactForm.querySelector('#form-email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim()) {
        showError(email, 'Por favor, insira seu e-mail.');
        isValid = false;
      } else if (!emailRegex.test(email.value.trim())) {
        showError(email, 'Insira um e-mail válido.');
        isValid = false;
      }

      // Validar mensagem
      const mensagem = contactForm.querySelector('#form-mensagem');
      if (!mensagem.value.trim()) {
        showError(mensagem, 'Por favor, escreva uma mensagem.');
        isValid = false;
      }

      if (isValid) {
        const successMsg = contactForm.querySelector('.form-success');
        successMsg.classList.add('show');
        contactForm.reset();
        setTimeout(() => successMsg.classList.remove('show'), 4000);
      }
    });

    function showError(input, message) {
      const group = input.closest('.form-group');
      group.classList.add('invalid');
      group.querySelector('.error-msg').textContent = message;
    }

    // Limpar erro ao digitar
    contactForm.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('input', () => {
        input.closest('.form-group').classList.remove('invalid');
      });
    });
  }

  // ---- Cursor custom interativo (desktop) ----
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border: 2px solid var(--accent);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.15s ease, opacity 0.15s ease;
      mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX - 10 + 'px';
      cursor.style.top = e.clientY - 10 + 'px';
    });

    document.querySelectorAll('a, button, .project-card, .detail-card, .contact-method, .tag').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
        cursor.style.opacity = '0.5';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.opacity = '1';
      });
    });
  }

  // ---- Parallax suave nos circulos do hero ----
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
      hero.style.setProperty('--parallax', scrolled * 0.3 + 'px');
    }
  });

});
