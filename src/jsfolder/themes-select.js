const nuvens = document.querySelectorAll('.nuvem');
let selecionadas = 0;

nuvens.forEach(nuvem => {
nuvem.addEventListener('click', () => {
    if (nuvem.classList.contains('selecionada')) {
    nuvem.classList.remove('selecionada');
    selecionadas--;
    } else if (selecionadas < 4) {
    nuvem.classList.add('selecionada');
    selecionadas++;
    } else {
    alert('Você já selecionou 4 temas!');
    }
});
});