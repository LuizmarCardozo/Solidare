/*
  DOCUMENTAÇÃO DO JAVASCRIPT (campanhas.js)

  Este ficheiro vai controlar o comportamento da tua tela de Campanhas.
*/

// Este evento espera que o HTML esteja completamente carregado
document.addEventListener('DOMContentLoaded', () => {

    console.log("Página de Campanhas carregada e pronta!");

    // Pega os botões pelo ID
    const searchButton = document.getElementById('search-button');
    const filterButton = document.getElementById('filter-button');

    // Adiciona "ouvinte" de clique na pesquisa
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            alert("A barra de PESQUISA foi clicada!");
            // No futuro, podes abrir uma tela de pesquisa aqui.
        });
    }

    // Adiciona "ouvinte" de clique no filtro
    if (filterButton) {
        filterButton.addEventListener('click', () => {
            alert("O botão de FILTRO de campanhas foi clicado!");
            // No futuro, podes abrir um menu de filtros aqui.
        });
    }
});