const API_URL = 'http://localhost:8080';

// Variável global para armazenar os gatos
let gatos = [];

// Elementos do DOM
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const mainContent = document.getElementById('main-content');
const userInfo = document.getElementById('user-info');
const userName = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');

// Estado do usuário
let usuarioLogado = null;
let adocoesUsuario = [];

// Função para verificar se o usuário está logado
function verificarLogin() {
    const usuario = localStorage.getItem('usuario');
    console.log('verificarLogin - usuario no localStorage:', usuario);
    if (usuario) {
        usuarioLogado = JSON.parse(usuario);
        mostrarInfoUsuario();
    } else {
        usuarioLogado = null;
        mostrarInfoUsuario();
    }
}

// Função para mostrar informações do usuário
function mostrarInfoUsuario() {
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    const loginBtn = document.getElementById('login-btn');
    const minhasAdocoes = document.getElementById('minhas-adocoes');
    const profilePic = document.getElementById('profile-pic');

    if (usuarioLogado) {
        userInfo.style.display = 'flex';
        userName.textContent = usuarioLogado.nome;
        loginBtn.style.display = 'none';
        minhasAdocoes.style.display = 'block';
        // Exibir foto de perfil se houver
        if (usuarioLogado.fotoPerfil) {
            profilePic.src = usuarioLogado.fotoPerfil;
            profilePic.style.display = 'block';
        } else {
            profilePic.style.display = 'none';
        }
        // Mostrar botão de adicionar gato se for admin
        const adminAddCat = document.getElementById('admin-add-cat');
        if (usuarioLogado && usuarioLogado.isAdmin) {
            adminAddCat.style.display = 'block';
        } else {
            adminAddCat.style.display = 'none';
            document.getElementById('add-cat-form').style.display = 'none';
        }
    } else {
        userInfo.style.display = 'none';
        loginBtn.style.display = 'block';
        minhasAdocoes.style.display = 'none';
    }
}

// Função para fazer logout
function fazerLogout() {
    console.log('Logout iniciado');
    usuarioLogado = null;
    localStorage.removeItem('usuario');
    console.log('localStorage após logout:', localStorage.getItem('usuario'));
    mostrarInfoUsuario();
    criarCardsGatos();
    window.location.href = '#pets';
    window.location.reload();
}

// Função para carregar adoções do usuário
function carregarAdocoesUsuario() {
    const adocoesGrid = document.getElementById('minhas-adocoes-grid');
    adocoesGrid.innerHTML = '';

    const adocoes = JSON.parse(localStorage.getItem(`adocoes_${usuarioLogado.email}`)) || [];
    
    if (adocoes.length === 0) {
        adocoesGrid.innerHTML = '<p>Você ainda não tem adoções.</p>';
        return;
    }

    adocoes.forEach((adocao, idx) => {
        const gato = gatos.find(g => g.id === adocao.gatoId);
        if (gato) {
            const card = document.createElement('div');
            card.className = 'pet-card';
            card.innerHTML = `
                <img src="${gato.imagem}" alt="${gato.nome}">
                <div class="pet-card-content">
                    <h3>${gato.nome}</h3>
                    <p><strong>Idade:</strong> ${gato.idade}</p>
                    <p><strong>Gênero:</strong> ${gato.genero}</p>
                    <p><strong>Status:</strong> ${adocao.status}</p>
                    <p><strong>Data da Adoção:</strong> ${adocao.data}</p>
                    <button class="cancel-adoption-btn" data-idx="${idx}">Cancelar Adoção</button>
                </div>
            `;
            adocoesGrid.appendChild(card);
        }
    });
    // Adicionar eventos para cancelar adoção
    document.querySelectorAll('.cancel-adoption-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            cancelarAdocao(parseInt(this.dataset.idx));
        });
    });
}

async function cancelarAdocao(idx) {
    const adocoes = JSON.parse(localStorage.getItem(`adocoes_${usuarioLogado.email}`)) || [];
    if (adocoes[idx]) {
        if (confirm('Tem certeza que deseja cancelar esta adoção?')) {
            // Atualizar status do gato para 'disponivel' no backend
            const gatoId = adocoes[idx].gatoId;
            const gato = gatos.find(g => g.id === gatoId);
            if (gato) {
                try {
                    await fetch(`${API_URL}/pets/${gatoId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            nome: gato.nome,
                            idade: gato.idade,
                            genero: gato.genero,
                            descricao: gato.descricao,
                            imagem: gato.imagem,
                            status: 'disponivel'
                        })
                    });
                } catch (error) {
                    alert('Erro ao atualizar status do gato no servidor.');
                }
            }
            adocoes.splice(idx, 1);
            localStorage.setItem(`adocoes_${usuarioLogado.email}`, JSON.stringify(adocoes));
            carregarAdocoesUsuario();
            await criarCardsGatos(); // Recarrega a lista de gatos
        }
    }
}

// Função para criar os cards dos gatos buscando do backend
async function criarCardsGatos() {
    const petsGrid = document.querySelector('.pets-grid');
    petsGrid.innerHTML = '';

    try {
        const response = await fetch(`${API_URL}/listar`);
        gatos = await response.json(); // Atualiza a variável global

        // Exibir todos os gatos retornados pelo backend
        gatos.forEach(gato => {
            const card = document.createElement('div');
            card.className = 'pet-card';
            card.innerHTML = `
                <img src="${gato.imagem}" alt="${gato.nome}">
                <div class="pet-card-content">
                    <h3>${gato.nome}</h3>
                    <p><strong>Idade:</strong> ${gato.idade}</p>
                    <p><strong>Gênero:</strong> ${gato.genero}</p>
                    <p>${gato.descricao}</p>
                    <button class="adopt-button" data-id="${gato.id}">Adotar</button>
                </div>
            `;
            petsGrid.appendChild(card);
        });

        // Adicionar event listeners aos botões de adoção
        document.querySelectorAll('.adopt-button').forEach(button => {
            button.addEventListener('click', abrirModalAdocao);
        });
    } catch (error) {
        console.error('Erro ao carregar gatos:', error);
        petsGrid.innerHTML = '<p>Erro ao carregar gatos do servidor. Por favor, tente novamente mais tarde.</p>';
    }
}

// Função para abrir o modal de adoção
function abrirModalAdocao(event) {
    if (!usuarioLogado) {
        alert('Por favor, faça login para adotar um gato.');
        abrirModalLogin();
        return;
    }

    const modal = document.getElementById('adoptionModal');
    const gatoId = event.target.dataset.id;
    modal.style.display = 'block';
    modal.dataset.selectedCatId = gatoId;
}

// Função para fechar o modal
function fecharModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Função para abrir o modal de login
function abrirModalLogin() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'block';
}

// Função para abrir o modal de registro
function abrirModalRegistro() {
    const modal = document.getElementById('registerModal');
    modal.style.display = 'block';
}

// Função para lidar com o login
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-password').value;

    // Em produção, isso seria uma chamada ao backend
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);

    if (usuario) {
        usuarioLogado = usuario;
        localStorage.setItem('usuario', JSON.stringify(usuario));
        mostrarInfoUsuario();
        fecharModal();
        criarCardsGatos().then(() => {
            carregarAdocoesUsuario();
        });
    } else {
        alert('E-mail ou senha incorretos.');
    }
}

// Função para lidar com o registro
function handleRegistro(event) {
    event.preventDefault();
    const nome = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const senha = document.getElementById('register-password').value;
    const telefone = document.getElementById('register-phone').value;
    const fotoInput = document.getElementById('register-photo');

    // Em produção, isso seria uma chamada ao backend
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    if (usuarios.some(u => u.email === email)) {
        alert('Este e-mail já está cadastrado.');
        return;
    }

    // Ler foto de perfil se houver
    if (fotoInput.files && fotoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            salvarNovoUsuario(nome, email, senha, telefone, e.target.result);
        };
        reader.readAsDataURL(fotoInput.files[0]);
    } else {
        salvarNovoUsuario(nome, email, senha, telefone, null);
    }
}

function salvarNovoUsuario(nome, email, senha, telefone, fotoPerfil) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const novoUsuario = { nome, email, senha, telefone, fotoPerfil };
    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    usuarioLogado = novoUsuario;
    localStorage.setItem('usuario', JSON.stringify(novoUsuario));
    mostrarInfoUsuario();
    fecharModal();
}

// Função para editar foto de perfil
function handleProfileEdit(event) {
    event.preventDefault();
    const fotoInput = document.getElementById('profile-photo');
    if (fotoInput.files && fotoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            usuarioLogado.fotoPerfil = e.target.result;
            atualizarUsuarioLocalStorage();
            mostrarInfoUsuario();
            fecharModal();
        };
        reader.readAsDataURL(fotoInput.files[0]);
    } else {
        fecharModal();
    }
}

function atualizarUsuarioLocalStorage() {
    // Atualiza o usuário logado e na lista de usuários
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const idx = usuarios.findIndex(u => u.email === usuarioLogado.email);
    if (idx !== -1) {
        usuarios[idx] = usuarioLogado;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        localStorage.setItem('usuario', JSON.stringify(usuarioLogado));
    }
}

// Função para lidar com o envio do formulário de adoção
function handleAdocaoSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const dadosAdocao = {
        nome: formData.get('name'),
        email: formData.get('email'),
        telefone: formData.get('phone'),
        endereco: formData.get('address'),
        gatoId: parseInt(document.getElementById('adoptionModal').dataset.selectedCatId),
        data: new Date().toLocaleDateString(),
        status: 'Em análise'
    };

    // Em produção, isso seria uma chamada ao backend
    const adocoes = JSON.parse(localStorage.getItem(`adocoes_${usuarioLogado.email}`)) || [];
    adocoes.push(dadosAdocao);
    localStorage.setItem(`adocoes_${usuarioLogado.email}`, JSON.stringify(adocoes));

    alert('Solicitação de adoção enviada com sucesso! Entraremos em contato em breve.');
    fecharModal();
    event.target.reset();
    carregarAdocoesUsuario();
}

// Lógica do formulário de adicionar gato
function setupAddCatForm() {
    const showBtn = document.getElementById('show-add-cat-form');
    const form = document.getElementById('add-cat-form');
    const cancelBtn = document.getElementById('cancel-add-cat');

    showBtn.addEventListener('click', () => {
        form.style.display = 'block';
    });
    cancelBtn.addEventListener('click', () => {
        form.style.display = 'none';
        form.reset();
    });
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = document.getElementById('cat-name').value;
        const idade = document.getElementById('cat-age').value;
        const genero = document.getElementById('cat-gender').value;
        const descricao = document.getElementById('cat-description').value;
        const imagem = document.getElementById('cat-image').value;
        try {
            const res = await fetch(`${API_URL}/pets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, idade, genero, descricao, imagem, status: 'disponivel' })
            });
            if (res.ok) {
                alert('Gato adicionado com sucesso!');
                form.style.display = 'none';
                form.reset();
                await criarCardsGatos();
            } else {
                alert('Erro ao adicionar gato.');
            }
        } catch (err) {
            alert('Erro ao adicionar gato.');
        }
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    verificarLogin();
    await criarCardsGatos();
    if (usuarioLogado) {
        carregarAdocoesUsuario();
    }
    setupAddCatForm();

    // Event listeners para os modais
    document.querySelectorAll('.modal .close').forEach(closeBtn => {
        closeBtn.addEventListener('click', fecharModal);
    });

    window.addEventListener('click', (event) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                fecharModal();
            }
        });
    });

    // Event listeners para login/registro/perfil
    document.getElementById('login-btn').addEventListener('click', abrirModalLogin);
    document.getElementById('logout-btn').addEventListener('click', fazerLogout);
    document.getElementById('show-register').addEventListener('click', (e) => {
        e.preventDefault();
        fecharModal();
        abrirModalRegistro();
    });
    document.getElementById('show-login').addEventListener('click', (e) => {
        e.preventDefault();
        fecharModal();
        abrirModalLogin();
    });
    document.getElementById('edit-profile-btn').addEventListener('click', () => {
        fecharModal();
        document.getElementById('profileModal').style.display = 'block';
    });

    // Event listeners para os formulários
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegistro);
    document.getElementById('adoptionForm').addEventListener('submit', handleAdocaoSubmit);
    document.getElementById('profileForm').addEventListener('submit', handleProfileEdit);

    // Smooth scroll para links de navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});  