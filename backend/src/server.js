const express = require('express');
const cors = require('cors');
const controller = require('./controller');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

// Endpoints
app.get('/listar', controller.listarPets);
app.post('/adotar', controller.adotarPet);
app.post('/pets', controller.adicionarPet);
app.put('/pets/:id', controller.atualizarPet);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});