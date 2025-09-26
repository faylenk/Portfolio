// Sistema de animações para os cards
class CardAnimations {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            // Criar elementos de efeito
            this.createEffectElements(card);

            // Adicionar evento de clique
            card.addEventListener('click', (e) => {
                // Verifica se o clique foi em um link filho (que tem onclick="event.stopPropagation()")
                // Se sim, o flip não deve ocorrer. Se não, o flip ocorre.
                if (!e.target.closest('a')) {
                    this.animateCard(card, e);
                }
            });

            // Adicionar efeito hover
            card.addEventListener('mouseenter', () => {
                this.hoverEffect(card);
            });

            card.addEventListener('mouseleave', () => {
                this.resetHoverEffect(card);
            });
        });
    }

    createEffectElements(card) {
        // Criar elemento para partículas
        const particles = document.createElement('div');
        particles.className = 'card-particles';
        card.appendChild(particles);

        // Criar elemento para glow
        const glow = document.createElement('div');
        glow.className = 'card-glow';
        card.appendChild(glow);
    }

    hoverEffect(card) {
        card.style.transform = 'translateY(-10px)';
        card.style.boxShadow = '0 20px 40px rgba(108, 99, 255, 0.2)';
    }

    resetHoverEffect(card) {
        // Verifica se o card NÃO está com flip antes de resetar o hover
        if (!card.classList.contains('flip-effect')) {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        }
    }

    animateCard(card, event) {
        // Prevenir múltiplas animações simultâneas
        if (card.classList.contains('animating')) return;
        card.classList.add('animating');

        // Executar todas as animações
        this.rippleEffect(card, event);
        this.pulseEffect(card);
        this.particleEffect(card, event);
        this.glowEffect(card);
        this.waveEffect(card, event);
        this.flipEffect(card); 

        setTimeout(() => {
            card.classList.remove('animating');
        }, 1000);
    }

    rippleEffect(card, event) {
        card.classList.add('ripple-effect');
        setTimeout(() => {
            card.classList.remove('ripple-effect');
        }, 600);
    }

    pulseEffect(card) {
        card.classList.add('click-animation');
        setTimeout(() => {
            card.classList.remove('click-animation');
        }, 400);
    }

    particleEffect(card, event) {
        const particlesContainer = card.querySelector('.card-particles');
        const rect = card.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        // Limpar partículas anteriores
        particlesContainer.innerHTML = '';

        // Criar partículas
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Posição aleatória
            const angle = (i / 15) * Math.PI * 2;
            const distance = 60 + Math.random() * 40;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;

            // Cor aleatória baseada no tema
            const colors = ['#6c63ff', '#36d1dc', '#ff6584'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            particle.style.backgroundColor = randomColor;
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            particle.style.left = `${clickX}px`;
            particle.style.top = `${clickY}px`;
            particle.style.animation = `particleFloat 0.8s ease-out forwards`;
            particle.style.animationDelay = `${i * 0.03}s`;

            particlesContainer.appendChild(particle);

            // Remover partícula após animação
            setTimeout(() => {
                if (particle.parentNode === particlesContainer) {
                    particle.remove();
                }
            }, 1000);
        }
    }

    glowEffect(card) {
        card.classList.add('glow-effect');
        setTimeout(() => {
            card.classList.remove('glow-effect');
        }, 2000);
    }

    waveEffect(card, event) {
        const wave = document.createElement('div');
        wave.className = 'wave-effect';

        const rect = card.getBoundingClientRect();
        wave.style.left = `${event.clientX - rect.left}px`;
        wave.style.top = `${event.clientY - rect.top}px`;

        card.appendChild(wave);

        setTimeout(() => {
            if (wave.parentNode === card) {
                wave.remove();
            }
        }, 800);
    }

    flipEffect(card) {
        // Alternar entre frente e verso - Agora apenas adiciona/remove classe
        card.classList.toggle('flip-effect');
        
        // Gerenciar o estado de hover quando o card é flipado
        if (card.classList.contains('flip-effect')) {
            // Se estiver virado, mantém o efeito de elevação (se já estava hover)
            if (card.matches(':hover')) {
                card.style.transform = 'translateY(-10px)';
                card.style.boxShadow = '0 20px 40px rgba(108, 99, 255, 0.2)';
            }
        } else {
            // Se estiver na frente, restaura o estado de hover normal
            if (card.matches(':hover')) {
                this.hoverEffect(card);
            } else {
                this.resetHoverEffect(card);
            }
        }
    }

}

class ProjectModal {
    constructor() {
        this.modals = document.querySelectorAll('.project-modal');
        this.init();
    }

    init() {
        this.modals.forEach(modal => {
            const closeBtn = modal.querySelector('.modal-close');
            closeBtn.addEventListener('click', () => this.closeModal(modal));

            modal.addEventListener('click', (e) => {
                if (e.target === modal) { // Clique fora do conteúdo do modal
                    this.closeModal(modal);
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    closeModal(modal) {
        document.body.style.overflow = '';
        modal.classList.remove('active');

        // Resetar cards flip ao fechar o modal
        const cards = document.querySelectorAll('.project-card');
        cards.forEach(card => {
            card.classList.remove('flip-effect');
            // Resetar o hover se não estiver mais em hover
            if (!card.matches(':hover')) {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
            } else {
                 // Se estiver em hover, aplicar hover effect novamente
                 card.style.transform = 'translateY(-10px)';
                 card.style.boxShadow = '0 20px 40px rgba(108, 99, 255, 0.2)';
            }
        });
    }

    closeAllModals() {
        this.modals.forEach(modal => this.closeModal(modal));
    }
}


// Sistema de estatísticas do GitHub
class GitHubStats {
    constructor() {
        this.username = 'faylenk'; // Certifique-se de que este nome de usuário está correto
        this.init();
    }

    async init() {
        await this.fetchBasicStats();
        await this.fetchLanguageStats();
    }

    async fetchBasicStats() {
        try {
            const response = await fetch(`https://api.github.com/users/${this.username}`);
            const data = await response.json();

            // Atualizado: Usando dados reais da API ou placeholders
            this.updateStat('stars', data.public_repos || 0); 
            this.updateStat('commits', '100'); // Placeholder
            this.updateStat('prs', '75'); // Placeholder
            this.updateStat('issues', data.public_repos || 0); // Placeholder

        } catch (error) {
            console.error('Erro ao buscar stats do GitHub:', error);
            this.showPlaceholderStats();
        }
    }

    async fetchLanguageStats() {
        try {
            const response = await fetch(`https://api.github.com/users/${this.username}/repos`);
            const repos = await response.json();

            const languages = {};
            let totalSize = 0;

            // Processar repositórios públicos (não forks)
            for (const repo of repos) {
                if (!repo.fork) {
                    try {
                        const langResponse = await fetch(repo.languages_url);
                        const langData = await langResponse.json();

                        for (const [lang, size] of Object.entries(langData)) {
                            languages[lang] = (languages[lang] || 0) + size;
                            totalSize += size;
                        }
                    } catch (error) {
                        console.warn(`Não foi possível buscar linguagens para ${repo.name}:`, error);
                    }
                }
            }

            this.updateLanguageBars(languages, totalSize);

        } catch (error) {
            console.error('Erro ao buscar linguagens:', error);
        }
    }

    updateStat(type, value) {
        const elements = document.querySelectorAll(`[data-stat="${type}"]`);
        elements.forEach(el => {
            el.textContent = value;
            el.classList.remove('stats-loading'); // Supondo que tenha esta classe
        });
    }

    updateLanguageBars(languages, totalSize) {
        const languageItems = document.querySelectorAll('.language-item');

        languageItems.forEach(item => {
            const langName = item.querySelector('.language-name').textContent;
            const percentage = this.calculatePercentage(languages, totalSize, langName);

            if (percentage > 0) {
                const progressBar = item.querySelector('.language-progress');
                // Animar a barra progressivamente
                setTimeout(() => {
                    progressBar.style.width = percentage + '%';
                }, 200);

                const percentageText = item.querySelector('.language-percentage');
                percentageText.textContent = percentage.toFixed(1) + '%';
            }
        });
    }

    calculatePercentage(languages, totalSize, languageName) {
        const langMap = {
            'JavaScript': 'JavaScript',
            'Java': 'Java',
            'Go': 'Go',
            'TypeScript': 'TypeScript',
            'Lua': 'Lua',
            'Python': 'Python',
            // Adicione mais mapeamentos se necessário
        };

        const actualName = langMap[languageName] || languageName; // Usa o mapeamento ou o nome original
        if (languages[actualName]) {
            return (languages[actualName] / totalSize) * 100;
        }
        return 0;
    }

    showPlaceholderStats() {
        const stats = {
            stars: '12',
            commits: '100',
            prs: '75',
            issues: '11'
        };

        Object.entries(stats).forEach(([type, value]) => {
            this.updateStat(type, value);
        });
    }
}

// Carregar repositórios do GitHub
function loadGitHubRepos() {
    const reposContainer = document.getElementById('repos-container');
    if (!reposContainer) return; // Verifica se o container existe

    repos.forEach(repo => {
        const repoElement = document.createElement('div');
        repoElement.className = 'repo-card';
        repoElement.innerHTML = `
            <h4>${repo.name}</h4>
            <p>${repo.description}</p>
            <div class="repo-stats">
                <span class="repo-language">${repo.language}</span>
                <div class="repo-meta">
                    <span><i class="fas fa-star"></i> ${repo.stars}</span>
                    <span><i class="fas fa-code-branch"></i> ${repo.forks}</span>
                </div>
            </div>
            <a href="${repo.url}" class="repo-link" target="_blank">
                Ver Repositório <i class="fas fa-arrow-right"></i>
            </a>
        `;
        reposContainer.appendChild(repoElement);
    });
}

// Inicializar quando o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    new CardAnimations();
    new ProjectModal();
    new GitHubStats();
    loadGitHubRepos();

    // Adicionar loading para imagens
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });

        // Opcional: Lidar com erros de carregamento
        img.addEventListener('error', () => {
            console.warn(`Falha ao carregar imagem: ${img.src}`);
            // Pode-se adicionar um placeholder aqui
        });
    });
});