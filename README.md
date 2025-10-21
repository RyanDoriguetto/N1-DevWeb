
# N1-DevWeb

## Descrição

Este projeto é uma aplicação web utilizando Angular para o frontend e Spring Boot para o backend. Ele foi desenvolvido para simular o gerenciamento de um café, com funcionalidades como a exibição de produtos, gerenciamento de mesas, e pedidos.

## Tecnologias Utilizadas

- **Frontend**: Angular
- **Backend**: Spring Boot
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT
- **Ferramentas**:
  - Maven para o backend
  - Node.js e npm para o frontend (Angular)
  - Docker para o gerenciamento do banco de dados e do ambiente

## Pré-requisitos

Antes de rodar o projeto, você precisa ter os seguintes programas instalados:

- **Node.js** (v14 ou superior) — Para rodar o frontend com Angular
- **npm** (ou **yarn**) — Para gerenciar dependências do frontend
- **Java JDK 17 ou superior** — Para rodar o backend com Spring Boot
- **Maven** — Para compilar o backend

## Rodando o Backend

1. **Instale o Java JDK e Maven**
   - Baixe e instale o Java JDK 17 (ou superior).
   - Instale o Maven (caso não tenha).

2. **Suba o servidor do backend**:
   No diretório do backend, execute o seguinte comando:

   ```bash
   mvn spring-boot:run
   ```

3. **Banco de Dados**:
   O banco de dados está configurado para rodar em um contêiner Docker. Para rodar o banco, use:

   ```bash
   docker-compose up
   ```

## Rodando o Frontend (Angular)

1. **Instalar Dependências**:
   
   Navegue até o diretório do frontend (Angular) e instale as dependências:

   ```bash
   npm install
   ```

2. **Rodar o Servidor de Desenvolvimento**:

   Após a instalação das dependências, rode o servidor de desenvolvimento:

   ```bash
   ng serve
   ```

   O frontend estará disponível em `http://localhost:4200`.

## Funcionalidades

### Backend

- **Gestão de Produtos**: Cadastro, edição, e remoção de produtos disponíveis no menu.
- **Gestão de Pedidos**: Criação e gerenciamento de pedidos por mesa.
- **Gestão de Mesas**: Definição do estado das mesas (livre, ocupada).
  
### Frontend

- **Tela de Login**: Realização de login para acessar o sistema.
- **Produtos**: Exibição de produtos com a possibilidade de adicionar ao pedido.
- **Mesas**: Gerenciamento de mesas e visualização de pedidos em andamento.
- **Pedidos**: Realização de pedidos com a opção de visualizar e confirmar itens.

## Como Contribuir

1. Faça um fork do projeto.
2. Crie uma branch (`git checkout -b feature/alguma-feature`).
3. Comite suas alterações (`git commit -am 'Add new feature'`).
4. Envie para o repositório remoto (`git push origin feature/alguma-feature`).
5. Abra um pull request.

