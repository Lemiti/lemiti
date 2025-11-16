// Enhanced Portfolio Functionality
window.addEventListener('DOMContentLoaded', () => {
  // ============================================
  // LOADER
  // ============================================
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.transition = 'opacity 0.5s ease-out';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }, 500);
  });

  // ============================================
  // SMOOTH SCROLL & MOBILE MENU
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      
      if (target) {
        target.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        // Close mobile menu if open
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
          navLinks.classList.remove('active');
        }
      }
    });
  });

  // ============================================
  // HAMBURGER MENU
  // ============================================
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      
      // Animate hamburger
      hamburger.style.transform = navLinks.classList.contains('active') 
        ? 'rotate(90deg)' 
        : 'rotate(0deg)';
    });
  }

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('active') && 
        !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      navLinks.classList.remove('active');
      hamburger.style.transform = 'rotate(0deg)';
    }
  });

  // ============================================
  // PROJECT FILTERING
  // ============================================
  const filterButtons = document.querySelectorAll('[data-filter]');
  const projectGrid = document.getElementById('projectGrid');

  if (filterButtons.length > 0 && projectGrid) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        
        // Highlight active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter and animate projects
        const projects = Array.from(projectGrid.children);
        projects.forEach((project, index) => {
          const show = filter === 'all' || project.dataset.category === filter;
          
          // Fade out animation
          project.style.opacity = '0';
          project.style.transform = 'scale(0.95)';
          project.style.transition = 'all 0.3s ease-out';
          
          setTimeout(() => {
            project.style.display = show ? 'block' : 'none';
            // Fade in animation
            setTimeout(() => {
              project.style.opacity = '1';
              project.style.transform = 'scale(1)';
            }, 10);
          }, index * 50);
        });
      });
    });
  }

  // ============================================
  // MODAL SYSTEM
  // ============================================
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');

  if (modal && modalClose) {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => {
        const title = card.querySelector('h3').textContent;
        const description = card.querySelector('p').textContent;
        const tech = card.dataset.tech || 'Not specified';
        const link = card.dataset.link;

        document.getElementById('modalTitle').textContent = title;
        
        let modalHTML = `<p>${description}</p>`;
        
        if (tech !== 'Not specified') {
          modalHTML += `<p style="margin-top: 1.5rem;"><strong style="color: #00d4ff;">Technologies Used:</strong><br>`;
          const techArray = tech.split(', ');
          techArray.forEach(t => {
            modalHTML += `<span style="display: inline-block; background: rgba(0, 212, 255, 0.2); color: #00d4ff; padding: 0.3rem 0.7rem; border-radius: 15px; margin: 0.3rem 0.3rem 0.3rem 0; font-size: 0.85rem;">${t}</span>`;
          });
          modalHTML += `</p>`;
        }
        
        if (link) {
          modalHTML += `<p style="margin-top: 1.5rem;"><a href="${link}" target="_blank" style="color: #00d4ff; text-decoration: none; font-weight: 600; border-bottom: 2px solid #00d4ff; padding-bottom: 2px;">View Project on GitHub →</a></p>`;
        }

        document.getElementById('modalDescription').innerHTML = modalHTML;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      });
    });

    modalClose.addEventListener('click', () => {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
      }
    });
  }

  // ============================================
  // CONTACT FORM
  // ============================================
  const contactForm = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      feedback.textContent = 'Sending...';
      feedback.style.color = '#00d4ff';

      try {
        const response = await fetch('https://formspree.io/f/mqabgkwj', {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          feedback.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
          feedback.style.color = '#00ff88';
          contactForm.reset();
          
          // Clear feedback after 5 seconds
          setTimeout(() => {
            feedback.textContent = '';
          }, 5000);
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        feedback.textContent = '✗ Error sending message. Please try again or email me directly.';
        feedback.style.color = '#ff006e';
        console.error('Form error:', error);
      }
    });
  }

  // ============================================
  // SCROLL ANIMATIONS
  // ============================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe project cards for animation
  document.querySelectorAll('.project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease-out';
    observer.observe(card);
  });

  // Observe skill categories for animation
  document.querySelectorAll('.skill-category').forEach(category => {
    category.style.opacity = '0';
    category.style.transform = 'translateY(20px)';
    category.style.transition = 'all 0.6s ease-out';
    observer.observe(category);
  });

  // ============================================
  // NAVBAR BACKGROUND ON SCROLL
  // ============================================
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(15, 15, 15, 0.98)';
      navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
    } else {
      navbar.style.background = 'rgba(15, 15, 15, 0.95)';
      navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
    }
  });

  // ============================================
  // SKILL BARS ANIMATION ON SCROLL
  // ============================================
  const skillFills = document.querySelectorAll('.skill-fill');
  let skillsAnimated = false;

  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
          skillsAnimated = true;
          skillFills.forEach(fill => {
            const width = fill.style.width;
            fill.style.width = '0';
            setTimeout(() => {
              fill.style.transition = 'width 1.5s ease-out';
              fill.style.width = width;
            }, 100);
          });
        }
      });
    }, { threshold: 0.5 });

    skillsObserver.observe(skillsSection);
  }

  // ============================================
  // ACTIVE SECTION HIGHLIGHTING IN NAVBAR
  // ============================================
  const sections = document.querySelectorAll('[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href').slice(1) === current) {
        item.style.color = '#00d4ff';
      } else {
        item.style.color = '#e0e0e0';
      }
    });
  });
});
