// Efeito de atração do buraco negro nas partículas
document.addEventListener('DOMContentLoaded', function() {
    const blackHole = document.getElementById('black-hole');
    
    // Atualizar a posição do buraco negro com base no scroll
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Calcular a posição vertical baseada no scroll
        const scrollPercent = scrollY / (documentHeight - windowHeight);
        const newTop = 50 + (scrollPercent * 30); // Move o buraco negro para baixo conforme scroll
        
        blackHole.style.top = `calc(${newTop}% + ${scrollY * 0.3}px)`;
    });
});