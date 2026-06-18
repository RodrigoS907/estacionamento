CREATE TABLE usuarios (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    papel VARCHAR(20) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE mensalistas (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf_cnpj VARCHAR(20) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    email VARCHAR(255),
    data_inicio DATE,
    data_vencimento DATE,
    valor_mensalidade NUMERIC(10,2),
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE veiculos (
    id BIGSERIAL PRIMARY KEY,
    placa VARCHAR(10) NOT NULL UNIQUE,
    marca VARCHAR(100),
    modelo VARCHAR(100),
    cor VARCHAR(50),
    tipo VARCHAR(20) NOT NULL,
    foto_url VARCHAR(500),
    mensalista_id BIGINT REFERENCES mensalistas(id) ON DELETE SET NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE registros_acesso (
    id BIGSERIAL PRIMARY KEY,
    placa_detectada VARCHAR(10) NOT NULL,
    veiculo_id BIGINT REFERENCES veiculos(id) ON DELETE SET NULL,
    data_hora_entrada TIMESTAMP NOT NULL,
    data_hora_saida TIMESTAMP,
    foto_entrada_url VARCHAR(500),
    foto_saida_url VARCHAR(500),
    valor_cobrado NUMERIC(10,2),
    status VARCHAR(20) NOT NULL,
    usuario_entrada_id BIGINT REFERENCES usuarios(id) ON DELETE SET NULL,
    usuario_saida_id BIGINT REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE INDEX idx_registros_status ON registros_acesso(status);
CREATE INDEX idx_veiculos_placa ON veiculos(placa);
