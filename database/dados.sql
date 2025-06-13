-- Tabela de gatos disponíveis para adoção
CREATE TABLE pets (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  idade VARCHAR(50) NOT NULL,
  genero VARCHAR(20) NOT NULL,
  descricao TEXT NOT NULL,
  imagem TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'disponivel'
);

-- Tabela de adoções realizadas
CREATE TABLE adocoes (
  id SERIAL PRIMARY KEY,
  pet_id INTEGER REFERENCES pets(id),
  adotante_nome VARCHAR(100) NOT NULL,
  adotante_email VARCHAR(100) NOT NULL,
  adotante_telefone VARCHAR(30) NOT NULL
);
