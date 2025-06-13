const db = require('./database');
const bcrypt = require('bcrypt');

class Repository {
    async listarPets() {
        const query = 'SELECT * FROM pets WHERE status = $1';
        const result = await db.query(query, ['disponivel']);
        return result.rows;
    }

    async adotarPet(petId, adotante) {
        const client = await db.connect();
        try {
            await client.query('BEGIN');
            
            // Atualiza o status do pet
            const updatePetQuery = 'UPDATE pets SET status = $1 WHERE id = $2';
            await client.query(updatePetQuery, ['adotado', petId]);
            
            // Registra a adoção
            const insertAdocaoQuery = `
                INSERT INTO adocoes (pet_id, adotante_nome, adotante_email, adotante_telefone) 
                VALUES ($1, $2, $3, $4)
            `;
            await client.query(insertAdocaoQuery, [
                petId,
                adotante.nome,
                adotante.email,
                adotante.telefone
            ]);
            
            await client.query('COMMIT');
            return true;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async adicionarPet(pet) {
        const query = `INSERT INTO pets (nome, idade, genero, descricao, imagem, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
        const values = [pet.nome, pet.idade, pet.genero, pet.descricao, pet.imagem, pet.status || 'disponivel'];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    async atualizarPet(id, pet) {
        const query = `UPDATE pets SET nome = $1, idade = $2, genero = $3, descricao = $4, imagem = $5, status = $6 WHERE id = $7 RETURNING *`;
        const values = [pet.nome, pet.idade, pet.genero, pet.descricao, pet.imagem, pet.status, id];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    async criarUsuario(usuario) {
        const senhaHash = await bcrypt.hash(usuario.senha, 10);
        const query = `
            INSERT INTO usuarios (nome, email, senha, is_admin) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, nome, email, is_admin
        `;
        const values = [usuario.nome, usuario.email, senhaHash, usuario.is_admin || false];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    async buscarUsuarioPorEmail(email) {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const result = await db.query(query, [email]);
        return result.rows[0];
    }

    async tornarAdmin(email) {
        const query = 'UPDATE usuarios SET is_admin = true WHERE email = $1 RETURNING *';
        const result = await db.query(query, [email]);
        return result.rows[0];
    }

    async verificarAdmin(email) {
        const query = 'SELECT is_admin FROM usuarios WHERE email = $1';
        const result = await db.query(query, [email]);
        return result.rows[0]?.is_admin || false;
    }
}

module.exports = new Repository(); 