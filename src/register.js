// Pedro Naves
function toggleSenha(inputId, toggleId) {
    const senhaInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById(toggleId);
    
    if (senhaInput.type === "password") {
        senhaInput.type = "text"; // Mostra a senha
        toggleIcon.classList.remove("bi-eye-slash"); // Altera o ícone
        toggleIcon.classList.add("bi-eye");
    } else {
        senhaInput.type = "password"; // Oculta a senha
        toggleIcon.classList.remove("bi-eye"); // Altera o ícone
        toggleIcon.classList.add("bi-eye-slash");
    }
}


// Davi

const REQUERY = "\\d{14}"; // Regex query

window.onload = () => {
    const submitbtn = document.getElementById("submitbtn");
    // Click event
    submitbtn.addEventListener("click", () => {
        const senha1 = document.getElementById("senha1").value;
        const senha2 = document.getElementById("senha2").value;
        
        if (senha1 !== senha2) {
            alert("As senhas devem ser iguais");
            return;
        }
        
        const RA = document.getElementById("RA").value;

        // Check for valid RA
        
        const re = RegExp(REQUERY);

        if(!re.test(RA))
        {
            alert("RA inválido");
            return;
        }

        const UF = document.getElementById("UF").value;
        const ws = new WebSocket("ws://" + window.location.hostname + ":8080");
        const fullname = document.getElementById("FullName").value;
        const telephone = document.getElementById("Telephone").value;
    
        const data = {
            RA: RA,
            UF: UF,
            fullname: fullname,
            password: senha1,
            birthdate: "2024-01-01", // TODO: Implementar data no formulário
            telephone: telephone
        }

        ws.onopen = () => {
            ws.send("reg" + JSON.stringify(data));
        }
        ws.onmessage = (event) => {
            alert(event.data);
        }
    })
}
    