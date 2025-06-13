const repository = require('./repository');

class Controller {
    async listarPets(req, res) {
        try {
            const pets = await repository.listarPets();
            res.json(pets);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar pets' });
        }
    }

    async adotarPet(req, res) {
        const { petId, adotante } = req.body;
        
        if (!petId || !adotante || !adotante.nome || !adotante.email) {
            return res.status(400).json({ 
                error: 'Pet ID e dados do adotante (nome e email) são obrigatórios' 
            });
        }

        try {
            await repository.adotarPet(petId, adotante);
            res.json({ message: 'Pet adotado com sucesso!' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao processar adoção' });
        }
    }

    async adicionarPet(req, res) {
        const { nome, idade, genero, descricao, imagem, status } = req.body;
        if (!nome || !idade || !genero || !descricao || !imagem) {
            return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
        }
        try {
            const novoPet = await repository.adicionarPet({ nome, idade, genero, descricao, imagem, status });
            res.status(201).json(novoPet);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar pet.' });
        }
    }

    async atualizarPet(req, res) {
        const id = req.params.id;
        const { nome, idade, genero, descricao, imagem, status } = req.body;
        if (!nome || !idade || !genero || !descricao || !imagem || !status) {
            return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
        }
        try {
            const petAtualizado = await repository.atualizarPet(id, { nome, idade, genero, descricao, imagem, status });
            if (!petAtualizado) {
                return res.status(404).json({ error: 'Pet não encontrado.' });
            }
            res.json(petAtualizado);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Erro ao atualizar pet.' });
        }
    }
}

module.exports = new Controller(); 