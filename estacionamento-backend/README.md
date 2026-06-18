# Estacionamento Backend

API REST em Spring Boot 3.2 (Java 17) para gestão de estacionamento, com:

- Autenticação JWT (papéis ADMIN e OPERADOR)
- Cadastro de veículos e mensalistas
- Controle de entrada e saída com cálculo automático de tarifa
- Upload de foto do veículo
- OCR de placa via Tesseract (com ressalvas — ver abaixo)
- Migrations versionadas com Flyway

## Pré-requisitos

- Java 17+
- Maven 3.8+
- Docker (para o Postgres)
- Tesseract OCR instalado no host

### Instalar Tesseract

**Ubuntu/Debian:**
```bash
sudo apt-get install -y tesseract-ocr libtesseract-dev
```

**macOS:**
```bash
brew install tesseract
```

O caminho do `tessdata` em `application.yml` é o padrão do Ubuntu. Ajuste se necessário (`tesseract --print-parameters` ou veja `/usr/share/tesseract-ocr/`).

## Como rodar

```bash
# 1. Subir o Postgres
docker compose up -d

# 2. Rodar a aplicação
./mvnw spring-boot:run
# ou
mvn spring-boot:run
```

A API sobe em `http://localhost:8080`.

Swagger UI em `http://localhost:8080/swagger-ui.html`.

## Credenciais iniciais

A migration `V2__seed_admin.sql` cria um usuário ADMIN:

- **email:** `admin@estacionamento.local`
- **senha:** `admin123`

Para criar um operador, faça login como admin e chame `POST /api/usuarios` com `papel: OPERADOR`.

## Principais endpoints

- `POST /api/auth/login` — autenticação
- `GET/POST/PUT/DELETE /api/veiculos`
- `GET/POST/PUT/DELETE /api/mensalistas` (gravação só para ADMIN)
- `POST /api/usuarios` — criar operador (só ADMIN)
- `GET /api/acessos?abertos=true` — registros abertos
- `POST /api/acessos/entrada` — multipart com `foto` e `placa` opcional
- `POST /api/acessos/{id}/saida` — multipart com `foto`
- `POST /api/ocr/reconhecer` — preview de leitura de placa

## Sobre o OCR

O `TesseractOcrService` usa Tesseract puro com pré-processamento mínimo. **A precisão em fotos reais de celular será baixa** porque Tesseract não foi feito para detectar placas em cenas abertas — ele espera texto já recortado.

Para um sistema real, recomendo trocar a implementação de `OcrService` por uma das opções abaixo:

- **OpenALPR** — open source, específico para placas
- **Google Cloud Vision API** — texto em imagem, paga sob demanda
- **AWS Rekognition** (DetectText) — semelhante, na AWS
- **Plate Recognizer** — SaaS de ALPR pronto, suporta padrão brasileiro

A interface `OcrService` foi pensada justamente para essa substituição ser trivial.

## Estrutura

```
src/main/java/com/estacionamento/
├── config/          # Security, CORS, OpenAPI, recursos estáticos
├── controller/      # REST controllers
├── dto/             # DTOs de request/response
├── exception/       # Exceções e handler global
├── model/           # Entidades JPA
├── repository/      # Spring Data
├── security/        # JWT
└── service/         # Lógica de negócio (incluindo OCR)
```
