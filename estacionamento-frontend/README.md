# Estacionamento Frontend

Aplicação Angular 18 (standalone components, signals) para o sistema de gestão de estacionamento. Voltada para uso em celular pelo operador na portaria, com câmera traseira para registrar entrada/saída.

## Pré-requisitos

- Node.js 18+ e npm
- Angular CLI: `npm install -g @angular/cli`
- O backend rodando em `http://localhost:8080` (ver `estacionamento-backend/README.md`)

## Como rodar

```bash
npm install
ng serve
```

Acesse `http://localhost:4200`.

## Credenciais iniciais

- **email:** `admin@estacionamento.local`
- **senha:** `admin123`

## Observação importante sobre a câmera

A API `getUserMedia` do navegador só funciona em **contextos seguros**: HTTPS ou `localhost`. Em produção, é obrigatório servir o frontend via HTTPS — caso contrário, o botão "Ativar câmera" vai falhar silenciosamente. Para testar pelo celular durante o desenvolvimento, use uma das opções abaixo:

- Rodar tudo na mesma máquina e acessar `http://localhost:4200` (não funciona se acessar pelo IP da rede)
- Túnel via `ngrok http 4200` (gera HTTPS automaticamente)
- Configurar `ng serve --ssl` com certificado autoassinado

## Estrutura

```
src/app/
├── core/               # Models, services, interceptors, guards
├── features/
│   ├── auth/login/     # Tela de login
│   ├── portaria/       # Tela principal (entrada/saída com câmera)
│   ├── veiculos/       # CRUD de veículos
│   └── mensalistas/    # CRUD de mensalistas (só ADMIN)
├── layout/shell/       # Layout com sidebar + outlet
└── shared/components/
    └── camera-capture/ # Componente reutilizável de câmera
```

## Fluxo principal (portaria)

1. Operador toca em "Registrar entrada"
2. Ativa a câmera traseira do celular
3. Captura foto da placa
4. Backend faz OCR e devolve a placa sugerida
5. Operador confere/ajusta a placa e confirma
6. Registro é criado com status `ABERTO`

Na saída, seleciona o registro aberto, captura nova foto e o valor é calculado automaticamente (ou zerado se for mensalista).

## Build de produção

```bash
ng build
# saída em dist/estacionamento-frontend/
```

Para apontar para um backend diferente, ajuste `src/environments/environment.prod.ts`.
