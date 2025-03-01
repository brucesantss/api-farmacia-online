# API de Farmácia Online

Uma API RESTful para gerenciamento de medicamentos em uma farmácia online, construída com Node.js, TypeScript, Express, Prisma e Zod. Permite adicionar, listar, atualizar, deletar e reservar medicamentos com validação robusta e persistência em banco de dados.

## Tecnologias Utilizadas
- **Node.js**: Ambiente de execução.
- **TypeScript**: Tipagem estática para maior segurança.
- **Express**: Framework para construção da API.
- **Prisma**: ORM para interação com o banco de dados.
- **Zod**: Biblioteca de validação de esquemas.

## Pré-requisitos
- Node.js (v16 ou superior)
- npm
- Um banco de dados (ex.: SQLite, PostgreSQL) configurado com Prisma

## Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/api-farmacia-online.git
   cd api-farmacia-online

## Instale as dependências

- npm install

## Configure o arquivo .env com a URL do banco de dados
- **DATABASE_URL**="[SEU-DB]://[USER]:[PASSWORD]@localhost:3306/farmacia" 

## Inicialize o banco de dados com Prisma
- npm prisma migrate dev
- Dê um nome para a migração

## Inicie o servidor
- npm run dev

## Scripts Disponíveis
npm start: Inicia o servidor em produção (compile primeiro com npm build)
npm run dev: Inicia com ts-node-dev para desenvolvimento

## Endpoints 
 - POST /medicamentos
   **Adiciona um novo medicamento.**
{
  "name": "Paracetamol",
  "price": 12.50,
  "category": "Analgésico",
  "stock": 100
}

 - GET /medicamentos
   **Lista todos os medicamentos.**
{
  "message": "Todos os medicamentos da farmácia!",
  "data": [{ "id": 1, "name": "Paracetamol", "price": 12.5, "category": "Analgésico", "stock": 100, "reservedBy": null }]
}

 - PUT /medicamentos/:id
   **Atualiza um medicamento existente (campos opcionais).**
{
  "price": 15.00,
  "stock": 95
}

 - DELETE /medicamentos/:id
   **Remove um medicamento do sistema.**
   
   - **Resposta: 204 No Content (sem corpo).**

 - POST /medicamentos/:id/reserve
   **Reserva uma quantidade de um medicamento.**
{
  "client": "João Silva",
  "quantity": 5
}

## Estrutura do projeto
📦 api-farmacia-online
 ┣ 📂 src
 ┃ ┣ 📜 index.ts         # Código principal da API
 ┃ ┣ 📜 routes.ts        # Definição das rotas
 ┣ 📂 prisma
 ┃ ┣ 📜 schema.prisma    # Modelo de dados do Prisma
 ┣ 📜 .env               # Configurações de ambiente (ex.: DATABASE_URL)
 ┣ 📜 package.json       # Dependências e scripts
 ┣ 📜 tsconfig.json      # Configuração do TypeScript
 ┗ 📜 README.md          # Documentação do projeto


## Configuração do Prisma

model Medicamento {
  id         Int      @id @default(autoincrement())
  name       String   @unique
  price      Float
  category   String
  stock      Int
  reservedBy String?
}

model ReservedBy {
  client   String @unique
  quantity Int
}

enum Category {
  Antibiótico
  Diurético
  Analgésico
}

## Contribuições
**Contribuições são bem-vindas! Para sugerir melhorias:**

- Fork o repositório.
- Crie uma branch (git checkout -b feature/nova-funcionalidade).
- Faça commit das mudanças (git commit -m "Adiciona nova funcionalidade").
- Envie um pull request.