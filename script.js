// --- PASSO 1: Configuração do Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyDVFEAk-GoNpKa2LXQ7g5RavdphQNB08Eo",
  authDomain: "solidare-5cb47.firebaseapp.com",
  projectId: "solidare-5cb47",
  storageBucket: "solidare-5cb47.firebasestorage.app",
  messagingSenderId: "306626965929",
  appId: "1:306626965929:web:8c188d69d144bcb455d4b8"
};

// --- PASSO 2: Inicialização do Firebase ---
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

console.log("Firebase conectado e pronto para autenticação!");


// --- PASSO 3: Roteador de Funções ---
document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;

    if (path.includes("index.html") || path.endsWith('/')) {
        setupLoginForm();
    } else if (path.includes("cadastro_doador.html")) {
        setupSignupFormDoador();
    } else if (path.includes("cadastro_ong.html")) {
        setupSignupFormOng();
    }
});


// --- LÓGICA DA TELA DE LOGIN ---
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await auth.signInWithEmailAndPassword(email, password);
            alert("Login realizado com sucesso!");
            // Futuramente, redirecione para a tela principal do app
            // window.location.href = "dashboard.html"; 
        } catch (error) {
            console.error("Erro no login:", error);
            alert(`Erro ao fazer login: ${error.message}`);
        }
    });
}

// --- LÓGICA DO CADASTRO DE DOADOR ---
function setupSignupFormDoador() {
    const signupForm = document.getElementById('signup-form-doador');
    if (!signupForm) return;

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const phone = document.getElementById('phone').value;

        if (password !== confirmPassword) {
            alert("As senhas não coincidem!");
            return;
        }

        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            await db.collection("users").doc(user.uid).set({
                nome: fullname,
                telefone: phone,
                tipo: "doador",
                email: email
            });

            // Esta linha só será executada se a linha de cima (db.collection...) funcionar
            alert("Cadastro de doador realizado com sucesso!");
            window.location.href = "index.html";

        } catch (error) {
            console.error("Erro ao criar conta:", error);
            alert(`Erro ao cadastrar: ${error.message}`);
        }
    });
}

// --- LÓGICA DO CADASTRO DE ONG ---
function setupSignupFormOng() {
    const signupForm = document.getElementById('signup-form-ong');
    if (!signupForm) return;

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const ongName = document.getElementById('ong-name').value;
        const cnpj = document.getElementById('cnpj').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const phone = document.getElementById('phone').value;
        const email = `${cnpj.replace(/\D/g, '')}@ong.solidare.com`;

        if (password !== confirmPassword) {
            alert("As senhas não coincidem!");
            return;
        }

        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            await db.collection("users").doc(user.uid).set({
                nome: ongName,
                cnpj: cnpj,
                telefone: phone,
                tipo: "ong",
                email: email
            });

            // Esta linha só será executada se a linha de cima (db.collection...) funcionar
            alert("Cadastro de ONG realizado com sucesso!");
            window.location.href = "index.html";

        } catch (error) {
            console.error("Erro ao criar conta:", error);
            alert(`Erro ao cadastrar: ${error.message}`);
        }
    });
}

