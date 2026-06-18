-- Usuario admin inicial
-- email: admin@estacionamento.local
-- senha: admin123
INSERT INTO usuarios (nome, email, senha_hash, papel, ativo)
VALUES (
    'Administrador',
    'admin@estacionamento.local',
    '$2b$10$oDlxT3eOmmII7PKdpXj/ve.Il5g3DNRdH2dAgS/VX/D/YtHY2v7Wa',
    'ADMIN',
    TRUE
);
