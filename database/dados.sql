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

INSERT INTO pets (nome, idade, genero, descricao, imagem, status) VALUES
('Luna', '2 anos', 'Fêmea', 'Gata dócil e carinhosa, adora brincar com bolinhas', 'https://i.pinimg.com/736x/91/57/d8/9157d8c73ecc5561598536047bb41ed9.jpg', 'disponivel'),
('Thor', '1 ano', 'Macho', 'Gato brincalhão e energético, perfeito para famílias ativas', 'https://i.pinimg.com/736x/86/80/f3/8680f3c873a4e2487ae5db40f38762bf.jpg', 'disponivel'),
('Mia', '3 anos', 'Fêmea', 'Gata tranquila e independente, ideal para apartamentos', 'https://i.pinimg.com/736x/b4/17/6c/b4176cf53928d8d883270b9c5bfa0005.jpg', 'disponivel'),
('Simba', '6 meses', 'Macho', 'Filhote muito brincalhão e carinhoso', 'https://i.pinimg.com/736x/80/80/b7/8080b78d7fc2d24c274f91bd436e8f1a.jpg', 'disponivel');
