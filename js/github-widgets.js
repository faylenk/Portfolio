// js/github-widgets.js

// Carregar repositórios do GitHub
async function loadGitHubRepos() {
    const reposContainer = document.getElementById('repos-container');
    if (!reposContainer) return; // Verifica se o container existe no HTML

    // Limpar conteúdo anterior (caso exista)
    reposContainer.innerHTML = '';

    // Exibir mensagem de carregamento (opcional)
    reposContainer.innerHTML = '<p>Carregando repositórios...</p>';

    try {
        const username = 'faylenk'; // Substitua pelo seu nome de usuário do GitHub
        // Faz a requisição para a API do GitHub
        const response = await fetch(`https://api.github.com/users/${username}/repos`);

        if (!response.ok) {
            throw new Error(`Erro ao buscar repositórios: ${response.status}`);
        }

        const repos = await response.json();

        // Filtrar apenas repositórios públicos e não-forks (opcional, mas comum)
        const publicRepos = repos.filter(repo => !repo.fork && repo.private === false);

        // Limpar mensagem de carregamento
        reposContainer.innerHTML = '';

        if (publicRepos.length === 0) {
            reposContainer.innerHTML = '<p>Nenhum repositório público encontrado.</p>';
            return;
        }

        // Pegar os 4 mais recentes (ou quantos quiser)
        const reposToShow = publicRepos.slice(0, 4); // Mostra os 4 primeiros (mais recentes)

        // Gerar HTML para os repositórios
        reposToShow.forEach(repo => {
            const repoElement = document.createElement('div');
            repoElement.className = 'repo-card';
            // Usando os dados reais da API
            repoElement.innerHTML = `
                <h4>${repo.name}</h4>
                <p>${repo.description || 'Sem descrição'}</p> <!-- Usa 'Sem descrição' se não houver -->
                <div class="repo-stats">
                    <span class="repo-language">${repo.language || 'N/A'}</span> <!-- Usa 'N/A' se não houver linguagem -->
                    <div class="repo-meta">
                        <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                        <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                    </div>
                </div>
                <a href="${repo.html_url}" class="repo-link" target="_blank">Ver Repositório <i class="fas fa-arrow-right"></i></a>
            `;
            reposContainer.appendChild(repoElement);
        });

    } catch (error) {
        console.error('Erro ao carregar repositórios do GitHub:', error);
        // Limpar mensagem de carregamento e mostrar erro
        reposContainer.innerHTML = `<p>Erro ao carregar repositórios: ${error.message}</p>`;
    }
}

// Chamar a função quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    loadGitHubRepos(); // <-- Chama a função para carregar os repositórios
});
