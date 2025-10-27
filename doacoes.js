/*
  DOCUMENTAÇÃO DO JAVASCRIPT (doacoes.js)

  Este ficheiro vai controlar o comportamento da tua tela de Doações.
*/

// Este evento espera que o HTML esteja completamente carregado
document.addEventListener('DOMContentLoaded', () => {

    console.log("Página de Doações carregada e pronta!");

    // Pega o botão de filtro pelo ID
    const filterButton = document.getElementById('filter-button');

    // Adiciona um "ouvinte" de clique
    if (filterButton) {
        filterButton.addEventListener('click', () => {
            alert("O botão de FILTRO de doações foi clicado!");
            // No futuro, podes abrir um menu de filtros aqui.
        });
    }

    // Podes adicionar mais lógica aqui, como cliques nos botões de comprovante
});