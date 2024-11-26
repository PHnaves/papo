function toggleSenha(inputId, toggleId) {
    const senhaInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById(toggleId);
    
    if (senhaInput.type === "password") {
        senhaInput.type = "text";
        toggleIcon.classList.remove("olho-fechado");
        toggleIcon.classList.add("olho-aberto");
    } else {
        senhaInput.type = "password";
        toggleIcon.classList.remove("olho-aberto");
        toggleIcon.classList.add("olho-fechado");
    }
}