// --- PASSO 1: Configuração do Firebase ---
// Este objeto contém as chaves e credenciais que conectam seu site ao seu projeto específico no Firebase.
// É gerado automaticamente pelo Firebase quando você cria um aplicativo web.
const firebaseConfig = {
  apiKey: "AIzaSyDVFEAk-GoNpKa2LXQ7g5RavdphQNB08Eo",
  authDomain: "solidare-5cb47.firebaseapp.com",
  projectId: "solidare-5cb47",
  storageBucket: "solidare-5cb47.firebasestorage.app",
  messagingSenderId: "306626965929",
  appId: "1:306626965929:web:8c188d69d144bcb455d4b8"
};

// --- PASSO 2: Inicialização do Firebase ---
// Inicializa a conexão com o Firebase usando as configurações acima.
firebase.initializeApp(firebaseConfig);
// Cria referências para os serviços de Autenticação e do Banco de Dados (Firestore) para facilitar o uso no código.
const auth = firebase.auth();
const db = firebase.firestore();

// Mensagem de confirmação no console do navegador para sabermos que a conexão foi bem-sucedida.
console.log("Firebase conectado e pronto para autenticação!");


// --- PASSO 3: Roteador de Funções ---
// Este evento espera que todo o HTML da página seja carregado antes de executar o JavaScript.
// Isso evita erros de "elemento não encontrado".
document.addEventListener("DOMContentLoaded", () => {
    // Pega o caminho da URL atual (ex: "/index.html", "/cadastro_doador.html").
    const path = window.location.pathname;

    // Estrutura condicional que funciona como um "roteador" simples:
    // Ele verifica qual página está aberta e chama a função JavaScript correspondente.
    if (path.includes("index.html") || path.endsWith('/')) {
        // Se for a página de login, configura os eventos de login.
        setupLoginForm();
    } else if (path.includes("cadastro_doador.html")) {
        // Se for a página de cadastro de doador, configura os eventos de cadastro de doador.
        setupSignupFormDoador();
    } else if (path.includes("cadastro_ong.html")) {
        // Se for a página de cadastro de ONG, configura os eventos de cadastro de ONG.
        setupSignupFormOng();
    }
});


// --- LÓGICA DA TELA DE LOGIN ---
function setupLoginForm() {
    // Pega o elemento do formulário de login pelo seu ID.
    const loginForm = document.getElementById('login-form');
    // Se o formulário não existir na página atual, a função para de executar.
    if (!loginForm) return;

    // Adiciona um "ouvinte" que espera o formulário ser enviado (clique no botão "Entrar").
    loginForm.addEventListener('submit', async (event) => {
        // Impede que a página recarregue ao enviar o formulário, que é o comportamento padrão.
        event.preventDefault();
        // Pega os valores digitados nos campos de e-mail and senha.
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // O bloco try...catch é usado para lidar com operações que podem dar erro (como chamadas de API).
        try {
            // Etapa 1: Tenta fazer o login do usuário
            await auth.signInWithEmailAndPassword(email, password);
            
            // Etapa 2: SUCESSO! Redireciona o usuário para o dashboard.
            // Esta é a linha que foi alterada:
            window.location.href = "dashboard.html"; 
            // (O alert("Login... sucesso") foi removido para uma transição mais rápida)

        } catch (error) {
            // É uma boa prática ver o objeto de erro completo no console para depuração
            console.error("Erro detalhado no login:", error);

            let mensagemAmigavel = ""; // Variável para a mensagem que o usuário verá

            // Usamos o 'error.code' para identificar o problema específico
            switch (error.code) {
                case 'auth/invalid-credential':
                    mensagemAmigavel = "E-mail ou senha inválidos. Tente novamente.";
                    break;
                case 'auth/user-not-found':
                    mensagemAmigavel = "Não há conta registrada com este e-mail.";
                    break;
                case 'auth/wrong-password':
                    mensagemAmigavel = "A senha está incorreta.";
                    break;
                case 'auth/invalid-email':
                    mensagemAmigavel = "O formato do e-mail é inválido.";
                    break;
                case 'auth/network-request-failed':
                    mensagemAmigavel = "Erro de rede. Verifica a tua conexão com a internet.";
                    break;
                default:
                    // Mensagem genérica para qualquer outro erro que não prevemos
                    mensagemAmigavel = "Ocorreu um erro ao tentar fazer login. Conta invalida.";
            }

            // Exibe a nova mensagem amigável para o usuário
            alert(mensagemAmigavel);
        }
    });
}

// --- LÓGICA DO CADASTRO DE DOADOR ---
function setupSignupFormDoador() {
    // Pega o elemento do formulário de cadastro de doador pelo seu ID.
    const signupForm = document.getElementById('signup-form-doador');
    // Se o formulário não existir na página atual, a função para.
    if (!signupForm) return;

    // Adiciona um "ouvinte" para o envio do formulário.
    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        // Pega todos os valores dos campos do formulário.
        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const phone = document.getElementById('phone').value;

        // Validação simples para verificar se as senhas digitadas são iguais.
        if (password !== confirmPassword) {
            alert("As senhas não coincidem!");
            return; // Interrompe a execução da função.
        }

        try {
            // Etapa 1: Cria o usuário no sistema de autenticação do Firebase.
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Etapa 2: Salva informações adicionais do usuário no banco de dados Firestore.
            // O Authentication só guarda e-mail e senha, então usamos o Firestore para outros dados.
            await db.collection("users").doc(user.uid).set({
                nome: fullname,
                telefone: phone,
                tipo: "doador", // Define o tipo de conta
                email: email
            });

            // Se as duas etapas acima funcionarem, exibe a mensagem de sucesso.
             alert("Cadastro de doador realizado com sucesso!");
            // Redireciona o usuário para a página de login para que ele possa entrar.
            window.location.href = "index.html";

        } catch (error) {
            // Se qualquer uma das etapas falhar, captura o erro.
            console.error("Erro ao criar conta:", error);
            // (Recomendação: Adicionar tratamento de erro 'switch' aqui também)
            alert(`Erro ao cadastrar: ${error.message}`);
        }
    });
}

// --- LÓGICA DO CADASTRO DE ONG ---
function setupSignupFormOng() {
    // Pega o elemento do formulário de cadastro de ONG pelo seu ID.
    const signupForm = document.getElementById('signup-form-ong');
    if (!signupForm) return;

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        // Pega todos os valores dos campos do formulário.
        const ongName = document.getElementById('ong-name').value;
        const cnpj = document.getElementById('cnpj').value;
        const password = document.getElementById('password').value;
       const confirmPassword = document.getElementById('confirm-password').value;
        const phone = document.getElementById('phone').value;
        
        // Cria um e-mail "falso" e único para a ONG usando o CNPJ.
        // O Firebase Auth exige um e-mail para cada conta. Esta é uma forma de criar um sem pedir ao usuário.
        const email = `${cnpj.replace(/\D/g, '')}@ong.solidare.com`;

        // Validação de senha.
        if (password !== confirmPassword) {
            alert("As senhas não coincidem!");
            return;
        }

        try {
            // Etapa 1: Cria a conta da ONG no Firebase Auth.
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Etapa 2: Salva os dados detalhados da ONG no Firestore.
            await db.collection("users").doc(user.uid).set({
                nome: ongName,
                cnpj: cnpj,
                telefone: phone,
                tipo: "ong", // Define o tipo de conta
                email: email
            });

            // Se tudo deu certo, mostra a mensagem de sucesso e redireciona.
            alert("Cadastro de ONG realizado com sucesso!");
            window.location.href = "index.html";

        } catch (error) {
            // Captura e exibe qualquer erro que ocorra durante o processo.
            console.error("Erro ao criar conta:", error);
            // (Recomendação: Adicionar tratamento de erro 'switch' aqui também)
            alert(`Erro ao cadastrar: ${error.message}`);
        }
    });
}