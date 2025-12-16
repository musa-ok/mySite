// Typewriter Effect
const text = "Merhaba, ben Musa.";
let i = 0;
function typeWriter() {
  if (i < text.length) {
    document.getElementById("typewriter").innerHTML += text.charAt(i);
    i++;
    setTimeout(typeWriter, 100);
  } else {
    // Add blinking cursor effect after typing is complete
    setTimeout(() => {
      document.getElementById("typewriter").classList.add("cursor-blink");
    }, 500);
  }
}
typeWriter();

// Skills Filter
const filterButtons = document.querySelectorAll('.filter-btn');
const skillCards = document.querySelectorAll('.skill-card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked button
    button.classList.add('active');
    
    const filter = button.getAttribute('data-filter');
    
    // Add animation classes for smooth transitions
    skillCards.forEach(card => {
      card.classList.add('skill-transition');
      
      setTimeout(() => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.classList.add('skill-visible');
          }, 50);
        } else {
          card.classList.remove('skill-visible');
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      }, 100);
    });
  });
});

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav ul');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
  });
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (nav && nav.classList.contains('active')) {
    if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
    }
  }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    // Close mobile menu if open
    if (nav && nav.classList.contains('active')) {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
    }
    
    window.scrollTo({
      top: targetElement.offsetTop - 80, // Adjust for header height
      behavior: 'smooth'
    });
  });
});

// Add animation to elements when they come into view
const animateOnScroll = () => {
  const elements = document.querySelectorAll('.skill-card, .hobby-card, .training-category, .contact-item');
  
  elements.forEach(element => {
    const elementPosition = element.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;
    
    if (elementPosition < screenPosition) {
      element.classList.add('animate-in');
    }
  });
};

window.addEventListener('scroll', animateOnScroll);
// Initial check for elements in view
setTimeout(animateOnScroll, 500);
