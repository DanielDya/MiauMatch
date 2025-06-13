# MiauMatch 🐾

MiauMatch é uma plataforma web dedicada à adoção de gatos, conectando abrigos e protetores a pessoas que desejam transformar a vida de um felino. O site facilita a busca, adoção e acompanhamento dos pets, promovendo a adoção responsável e o bem-estar animal.

---

## ✨ Funcionalidades

- **Página inicial:** Apresenta a missão do projeto e incentiva a adoção consciente.
- **Lista de gatos disponíveis:** Exibe fotos, nomes, idades, gêneros e descrições dos gatos prontos para adoção.
- **Cadastro e login:** Permite criar uma conta para solicitar adoções e acompanhar o histórico.
- **Perfil do usuário:** Gerencie suas informações e foto de perfil.
- **Solicitação de adoção:** Formulário simples para adotar um gato, com acompanhamento do status.
- **Minhas Adoções:** Visualize todos os gatos já adotados ou com solicitação em andamento, podendo cancelar se desejar.
- **Painel do administrador:** Usuários administradores podem cadastrar novos gatos e gerenciar o catálogo.

---

## 🐱 Fluxo de Adoção

1. O visitante navega pela lista de gatos disponíveis.
2. Para adotar, é necessário criar uma conta e fazer login.
3. Ao clicar em "Adotar", um formulário é exibido para preenchimento dos dados.
4. Após enviar a solicitação, o status pode ser acompanhado na seção "Minhas Adoções".
5. O administrador pode aprovar, recusar ou remover gatos do sistema.

---

## 🚀 Como utilizar o site

1. **Acesse a página inicial:** Navegue pelo catálogo de gatos disponíveis.
2. **Crie sua conta:** Clique em "Login" e depois em "Cadastre-se".
3. **Faça login:** Entre com seu e-mail e senha cadastrados.
4. **Adote um gato:** Clique em "Adotar", preencha o formulário e envie sua solicitação.
5. **Acompanhe suas adoções:** Veja o status das solicitações em "Minhas Adoções".
6. **Edite seu perfil:** Atualize sua foto de perfil quando desejar.
7. **(Admin) Cadastre novos gatos:** Se for administrador, utilize o painel para adicionar novos gatos.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML, CSS, JavaScript puro
- **Backend:** Node.js, Express,Cors,Pg,bcrypt
- **Banco de Dados:** PostgreSQL

---

## 💻 Como rodar o projeto localmente

### Backend

1. Acesse a pasta `backend`:
   ```sh
   cd backend
   ```
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Configure o banco de dados PostgreSQL e execute o script em [`database/dados.sql`](database/dados.sql).
4. Inicie o servidor:
   ```sh
   npm start
   ```
   O backend estará disponível em `http://localhost:8080`.

### Frontend

1. Abra o arquivo [`frontend/src/index.html`](frontend/src/index.html) no seu navegador.

---

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

Pronto! Agora é só aproveitar e ajudar a transformar a vida de um gatinho! 🐱