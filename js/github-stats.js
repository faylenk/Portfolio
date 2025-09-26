class GitHubStats {
    constructor() {
        this.username = 'faylenk'; 
        this.init();
    }

    async init() {
        try {
            // Buscar dados básicos do perfil
            const profileResponse = await fetch(`https://api.github.com/users/${this.username.trim()}`);
            if (!profileResponse.ok) throw new Error('Erro ao buscar perfil');
            const profileData = await profileResponse.json();

            // Buscar repositórios para calcular stars totais
            const reposResponse = await fetch(`https://api.github.com/users/${this.username.trim()}/repos`);
            if (!reposResponse.ok) throw new Error('Erro ao buscar repositórios');
            const reposData = await reposResponse.json();

            // Calcular total de stars
            const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);

            // Preencher os elementos com data-stat
            this.updateStat('stars', totalStars);
            this.updateStat('commits', '100'); // Placeholder - difícil de obter dinamicamente
            this.updateStat('prs', '75');      // Placeholder - difícil de obter dinamicamente
            this.updateStat('issues', profileData.public_repos); // Usando repositórios como proxy para issues

            // Atualizar outras estatísticas (se houver)
            document.querySelector('.streak-widget .streak-number').textContent = '216';

        } catch (error) {
            console.error('Erro ao buscar stats do GitHub:', error);
            // Fallback para valores padrão
            this.updateStat('stars', '12');
            this.updateStat('commits', '100');
            this.updateStat('prs', '75');
            this.updateStat('issues', '11');
        }
    }

    updateStat(type, value) {
        const elements = document.querySelectorAll(`[data-stat="${type}"]`);
        elements.forEach(el => {
            el.textContent = value;
            // Remover classe de carregamento se existir
            el.classList.remove('stats-loading');
        });
    }
}

// Inicializar quando o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    new GitHubStats();
});