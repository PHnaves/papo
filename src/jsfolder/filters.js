// Controla a exibição do menu de filtros

window.onload = () => {
    document.getElementById('filter-img').addEventListener('click', function () {
        const filtersContainer = document.getElementById('filtersContainer');
        filtersContainer.style.display = filtersContainer.style.display === 'none' ? 'block' : 'none';
    });
}