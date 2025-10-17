// Efeito de atração do buraco negro nas partículas - Versão Otimizada
document.addEventListener('DOMContentLoaded', function() {
    const blackHole = document.getElementById('black-hole');
    let particles = [];
    let animationId = null;
    let lastScrollY = window.scrollY;
    
    // Configurações otimizadas
    const MAX_PARTICLES = 30; // Reduzido para melhor performance
    const PARTICLE_LIFETIME = 3000; // 3 segundos
    
    // Criar partículas iniciais
    function createInitialParticles() {
        for (let i = 0; i < MAX_PARTICLES; i++) {
            setTimeout(() => createParticle(), i * 100);
        }
    }
    
    // Criar uma partícula
    function createParticle() {
        if (particles.length >= MAX_PARTICLES) return;
        
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Posição inicial aleatória na tela
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        
        document.body.appendChild(particle);
        
        const particleData = {
            element: particle,
            x: startX,
            y: startY,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            createdAt: Date.now(),
            size: Math.random() * 2 + 1
        };
        
        particles.push(particleData);
        
        // Remover automaticamente após o tempo de vida
        setTimeout(() => {
            removeParticle(particleData);
        }, PARTICLE_LIFETIME);
    }
    
    // Remover partícula
    function removeParticle(particleData) {
        const index = particles.indexOf(particleData);
        if (index > -1) {
            particles.splice(index, 1);
            if (particleData.element.parentNode) {
                particleData.element.remove();
            }
        }
    }
    
    // Atualizar posição do buraco negro com base no scroll (debounced)
    function updateBlackHolePosition() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Calcular a posição vertical baseada no scroll
        const scrollPercent = scrollY / (documentHeight - windowHeight);
        const newTop = 50 + (scrollPercent * 20); // Movimento mais suave
        
        blackHole.style.top = `calc(${newTop}% + ${scrollY * 0.2}px)`;
    }
    
    // Debounce para otimizar o scroll
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                updateBlackHolePosition();
                scrollTimeout = null;
            }, 16); // ~60fps
        }
    });
    
    // Animação das partículas (otimizada)
    function animateParticles() {
        const blackHoleRect = blackHole.getBoundingClientRect();
        const blackHoleX = blackHoleRect.left + blackHoleRect.width / 2;
        const blackHoleY = blackHoleRect.top + blackHoleRect.height / 2;
        
        particles.forEach(particle => {
            // Calcular direção para o buraco negro
            const dx = blackHoleX - particle.x;
            const dy = blackHoleY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Força de atração (inversamente proporcional à distância)
            const force = Math.min(0.5, 100 / (distance * distance));
            
            // Atualizar velocidade
            particle.vx += (dx / distance) * force;
            particle.vy += (dy / distance) * force;
            
            // Atualizar posição
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Atualizar elemento
            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
            
            // Efeito de escala baseado na distância
            const scale = Math.max(0.3, distance / 200);
            particle.element.style.transform = `scale(${scale})`;
            
            // Remover se muito próximo do buraco negro
            if (distance < blackHoleRect.width / 2) {
                removeParticle(particle);
                createParticle(); // Criar nova partícula
            }
        });
        
        // Manter número constante de partículas
        if (particles.length < MAX_PARTICLES * 0.8) {
            createParticle();
        }
        
        animationId = requestAnimationFrame(animateParticles);
    }
    
    // Inicializar
    function init() {
        createInitialParticles();
        animateParticles();
        updateBlackHolePosition();
        
        // Adicionar distorção gravitacional
        const distortion = document.createElement('div');
        distortion.className = 'gravity-distortion';
        blackHole.appendChild(distortion);
        
        // Adicionar lens flare
        const lensFlare = document.createElement('div');
        lensFlare.className = 'lens-flare';
        blackHole.appendChild(lensFlare);
    }
    
    // Cleanup para evitar memory leaks
    function cleanup() {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        particles.forEach(particle => {
            if (particle.element.parentNode) {
                particle.element.remove();
            }
        });
        particles = [];
    }
    
    // Gerenciar performance baseado na visibilidade da página
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        } else {
            if (!animationId) {
                animateParticles();
            }
        }
    });
    
    // Redimensionamento da janela
    window.addEventListener('resize', function() {
        // Recriar partículas ao redimensionar
        particles.forEach(particle => particle.element.remove());
        particles = [];
        createInitialParticles();
    });
    
    // Inicializar quando a página carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Cleanup antes da página descarregar
    window.addEventListener('beforeunload', cleanup);
});