// Menu mobile toggle

function initSkillsAnimation() {
    const skillItems = document.querySelectorAll('.skill-item');
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillItem = entry.target;
                const skillLevel = skillItem.getAttribute('data-skill');
                const progressBar = skillItem.querySelector('.skill-progress');
                
                // Delay para animação em sequência
                setTimeout(() => {
                    progressBar.style.width = skillLevel + '%';
                }, 200);
                
                skillObserver.unobserve(skillItem);
            }
        });
    }, observerOptions);

    skillItems.forEach(item => {
        skillObserver.observe(item);
    });
}

function initLanguagesAnimation() {
    const languageItems = document.querySelectorAll('.language-item');
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const languageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const languageItem = entry.target;
                const progressBar = languageItem.querySelector('.language-progress');
                const percentage = languageItem.getAttribute('data-percentage');
                
                // Reset para animação
                progressBar.style.width = '0%';
                
                setTimeout(() => {
                    progressBar.style.width = percentage + '%';
                }, 300);
                
                languageObserver.unobserve(languageItem);
            }
        });
    }, observerOptions);

    languageItems.forEach(item => {
        languageObserver.observe(item);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
     initSkillsAnimation();
     initLanguagesAnimation();

    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
    
    // Fechar menu ao clicar em um link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Animações de entrada para as seções
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    
    
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animar links sociais
                if (entry.target.id === 'contact') {
                    const socialLinks = document.querySelectorAll('.social-link');
                    socialLinks.forEach((link, index) => {
                        setTimeout(() => {
                            link.style.opacity = '1';
                            link.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observar a seção de contato
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
        observer.observe(contactSection);
    }
    
    // Copiar Discord tag ao clicar
    const discordLink = document.getElementById('discord-link');
    if (discordLink) {
        discordLink.addEventListener('click', function(e) {
            e.preventDefault();
            const discordTag = 'FaylenK#1234'; // Substitua pela sua tag real
            
            // Usar a Clipboard API se disponível
            if (navigator.clipboard) {
                navigator.clipboard.writeText(discordTag).then(function() {
                    // Feedback visual
                    const originalText = discordLink.querySelector('span:not(.social-handle)').textContent;
                    discordLink.querySelector('span:not(.social-handle)').textContent = 'Copiado!';
                    
                    setTimeout(() => {
                        discordLink.querySelector('span:not(.social-handle)').textContent = originalText;
                    }, 2000);
                });
            } else {
                // Fallback para navegadores mais antigos
                const textArea = document.createElement('textarea');
                textArea.value = discordTag;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                // Feedback visual
                const originalText = discordLink.querySelector('span:not(.social-handle)').textContent;
                discordLink.querySelector('span:not(.social-handle)').textContent = 'Copiado!';
                
                setTimeout(() => {
                    discordLink.querySelector('span:not(.social-handle)').textContent = originalText;
                }, 2000);
            }
        });
    }
});