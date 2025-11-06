
# Colinha para Rodar o Server em Outra Máquina (N1-DevWeb)

### 0) Pré-requisitos
- **Git**, **Docker** (com `docker compose`), **Java 17**, **Maven** (ou `mvnw` se existir no projeto), **Node.js LTS** + **Angular CLI** (`npm i -g @angular/cli`).

### 1) Clonar o projeto
```bash
git clone https://github.com/RyanDoriguetto/N1-DevWeb.git
cd N1-DevWeb
```

### 2) Subir o banco (Postgres via Docker)
```bash
docker compose up -d
```
> Abre a porta **5432** localmente.

### 3) Rodar o backend (Spring Boot)
Windows:
```powershell
cd backend
mvn spring-boot:run
```
Linux/Mac:
```bash
cd backend
mvn spring-boot:run
```
> Sobe em **http://localhost:8080** (mantenha essa janela aberta).

### 4) Rodar o front (Angular)
```bash
cd ../frontend-angular/coffee-shop
npm install
ng serve
```
> Acessar **http://localhost:4200**.

### 5) Login de teste
Email: admin@coffee.local
Senha: 123456

Email: caixa@coffee.local  
Senha: 123456

Email: aten@coffee.local
Senha: 123456

### 6) Rede / firewall (se for apresentar)
- Para outra máquina na **mesma rede** acessar:
  - Front: `http://IP_DA_MAQUINA:4200`
  - API: `http://IP_DA_MAQUINA:8080`
- Libere as portas **4200** e **8080** no firewall.

### 7) Problemas comuns (rápido)
- `mvn não reconhecido`: instale Maven ou use `mvnw(.cmd)` se existir.
- `ng não reconhecido`: `npm i -g @angular/cli` (ou `npx ng serve` no diretório do front).
- `401/403` no front: faça login; confirme que o token está em `localStorage` como `access_token`.
- DB erro de conexão: confira `application.properties` do backend e se o container `db` está “Up”.

Pronto.
