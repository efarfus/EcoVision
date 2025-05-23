# 📚 Documentação da API

Este projeto utiliza **Swagger (OpenAPI)** para documentar suas rotas e facilitar a integração e compreensão da API por outros desenvolvedores.

## 🔗 Acesso à Documentação

A documentação da API está disponível em:

```
http://localhost:3000/api-docs
```

> **Nota:** Substitua `localhost:3000` pelo endereço e porta onde seu backend estiver rodando.

---

## 🚀 Como Executar o Projeto

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor:

```bash
npm start
```

3. Acesse a documentação:

Abra seu navegador e vá para:

```
http://localhost:3000/api-docs
```

---

## 📦 Tecnologias Utilizadas

- Node.js
- TypeScript
- Express.js
- Swagger JSDoc
- Swagger UI Express

---

## 🛠️ Como a Documentação Funciona

- A documentação é gerada a partir de comentários com a anotação `@openapi` nas rotas.
- Os schemas e exemplos podem ser definidos diretamente no comentário ou referenciados por `components/schemas`.
- O Swagger é configurado e servido via um arquivo de configuração separado, geralmente chamado `swagger.ts`.

---

## 📁 Exemplo da Configuração Swagger

```ts
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Nome do Projeto",
      version: "1.0.0",
    },
  },
  apis: ["./src/routes/**/*.ts"], // Caminho para os comentários com @openapi
});

// Em seu arquivo principal (ex: app.ts)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

---

## 🧩 Boas Práticas

- Documente todas as rotas com blocos `@openapi`.
- Utilize `components/schemas` para manter os tipos organizados.
- Declare corretamente os `parameters`, `requestBody` e `responses`.
- Use o botão "Authorize" na UI do Swagger para testar rotas autenticadas.

---

## 📁 Estrutura Recomendada

```
src/
├── controllers/
├── routes/
│   └── user.routes.ts        # Comentários Swagger com @openapi
├── docs/
│   └── swagger.ts            # Configuração Swagger
├── schemas/
│   └── user.schema.ts        # (Opcional) Definições de schemas reutilizáveis
```

---

## 🤝 Contribuição

Caso vá contribuir com o projeto:

- Documente todas as novas rotas.
- Reutilize componentes existentes quando possível.
- Mantenha o padrão e a clareza da documentação.

---

## 📚 Recursos Úteis

- [Documentação oficial do Swagger](https://swagger.io/docs/)
- [Editor visual de OpenAPI](https://editor.swagger.io/)
