# ☕ Coffee Shop — CRUD + Mesas + Cardápio

### Arquitetura

* **Backend:** Java 17 + Spring Boot 3 + JPA + Spring Security (JWT) + PostgreSQL
* **Notifier (opcional):** Node.js + Express + Socket.IO (para eventos em tempo real)
* **Frontend:** HTML + CSS + JavaScript puro (sem Angular)

---

## 🧩 Estrutura de Pastas

```
coffee-starter/
├── backend/                  # API Spring Boot
│   └── src/main/java/com/example/coffee/
│       ├── config/           # CorsConfig.java, SecurityConfig.java
│       ├── web/              # Controllers (ProductController etc)
│       ├── security/         # Filtro JWT
│       └── model/            # Entities
│   └── resources/application.properties
│
├── notifier/                 # Servidor Node opcional para WebSocket
│   ├── package.json
│   └── server.js
│
└── frontend/                 # Páginas HTML + JS
    ├── login.html
    ├── produtos.html
    ├── mesas.html
    └── cardapio.html
```

---

## ⚙️ Passo a Passo — Execução Completa

### 1️⃣ Banco de Dados (PostgreSQL via Docker)

Abra o **PowerShell** e execute:

```bash
docker run -d --name coffee-db -p 5433:5432 \
  -e POSTGRES_USER=coffee \
  -e POSTGRES_PASSWORD=coffee \
  -e POSTGRES_DB=coffee \
  postgres:15
```

* Porta: `5433`
* Usuário: `coffee`
* Senha: `coffee`
* Banco: `coffee`

> Se já existir o container, use `docker start coffee-db`.

---

### 2️⃣ Backend (API em Spring Boot)

#### 🔹 Arquivo `backend/src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:postgresql://localhost:5433/coffee
spring.datasource.username=coffee
spring.datasource.password=coffee
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

security.jwt.secret=troque-esta-chave-em-producao
security.jwt.expiration=86400000
```

#### 🔹 Arquivo `CorsConfig.java`

Local: `backend/src/main/java/com/example/coffee/config/CorsConfig.java`

```java
package com.example.coffee.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.*;
import java.util.List;

@Configuration
public class CorsConfig {
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration cfg = new CorsConfiguration();
    cfg.setAllowedOrigins(List.of("http://localhost:5500"));
    cfg.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
    cfg.setAllowedHeaders(List.of("*"));
    cfg.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
    src.registerCorsConfiguration("/**", cfg);
    return src;
  }
}
```

#### 🔹 Arquivo `SecurityConfig.java`

Local: `backend/src/main/java/com/example/coffee/config/SecurityConfig.java`

```java
package com.example.coffee.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import com.example.coffee.security.JwtAuthFilter;

@Configuration
public class SecurityConfig {

  private final JwtAuthFilter jwtAuthFilter;
  public SecurityConfig(JwtAuthFilter jwtAuthFilter){ this.jwtAuthFilter = jwtAuthFilter; }

  @Bean
  SecurityFilterChain filterChain(HttpSecurity http, CorsConfigurationSource corsConfigurationSource) throws Exception {
    http
      .csrf(csrf -> csrf.disable())
      .cors(cors -> cors.configurationSource(corsConfigurationSource))
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/auth/**").permitAll()
        .requestMatchers(HttpMethod.GET, "/api/produtos/**").hasAnyRole("ADMIN","CAIXA","ATENDENTE")
        .requestMatchers(HttpMethod.POST, "/api/produtos/**").hasRole("ADMIN")
        .requestMatchers(HttpMethod.PUT, "/api/produtos/**").hasRole("ADMIN")
        .requestMatchers(HttpMethod.DELETE, "/api/produtos/**").hasRole("ADMIN")
        .anyRequest().authenticated()
      )
      .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  @Bean PasswordEncoder passwordEncoder(){ return new BCryptPasswordEncoder(); }
  @Bean AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
    return cfg.getAuthenticationManager();
  }
}
```

---

### 3️⃣ Notifier (opcional)

```bash
cd notifier
npm install
node server.js
# → "Notifier on :4000"
```

---

### 4️⃣ Frontend (HTML + JS)

Copie os 4 arquivos para:

```
C:\Projetos\coffee-starter\frontend\
```

#### 🔹 login.html

Autentica e salva o token (`coffee_token` e `coffee_role`).

#### 🔹 produtos.html

CRUD completo (somente Admin).

#### 🔹 mesas.html

Lista 50 mesas (CAIXA/ATENDENTE/ADMIN).

#### 🔹 cardapio.html

Lista produtos, permite adicionar à mesa e simular fechamento/pagamento.

---

### 5️⃣ Servir o Frontend

Execute no terminal:

```bash
cd frontend
npx http-server -p 5500 .
```

Abra no navegador:

* Login → `http://localhost:5500/login.html`
* CRUD Produtos → `http://localhost:5500/produtos.html`
* Mesas → `http://localhost:5500/mesas.html`
* Cardápio → aberto automaticamente ao clicar numa mesa

---

## 👥 Usuários Seed

| E-mail                                          | Senha | Função    |
| ----------------------------------------------- | ----- | --------- |
| [admin@coffee.local](mailto:admin@coffee.local) | admin | ADMIN     |
| [caixa@coffee.local](mailto:caixa@coffee.local) | admin | CAIXA     |
| [aten@coffee.local](mailto:aten@coffee.local)   | admin | ATENDENTE |

---

## 🔌 Endpoints principais

| Endpoint                      | Método          | Acesso                | Descrição                  |
| ----------------------------- | --------------- | --------------------- | -------------------------- |
| `/api/auth/login`             | POST            | Público               | Autenticação (retorna JWT) |
| `/api/produtos`               | GET             | Todos                 | Lista produtos             |
| `/api/produtos`               | POST/PUT/DELETE | ADMIN                 | CRUD                       |
| `/api/pedidos`                | GET/POST        | ADMIN/CAIXA/ATENDENTE | Gerenciamento de pedidos   |
| `/api/pedidos/{id}/status`    | PUT             | ADMIN/CAIXA           | Atualiza status            |
| `/api/pedidos/{id}/pagamento` | PUT             | ADMIN/CAIXA           | Finaliza pagamento         |

---

## ⚠️ Observações

* JWT HS256 configurado em `security.jwt.secret`.
* `CommandLineRunner` popula **usuários e produtos iniciais**.
* Cada mesa salva seus pedidos no `localStorage` do navegador.
* O Notifier pode ser integrado depois para refletir status em tempo real.

---

## 🧞🏼‍💻 Mini-guia rápido

| Etapa            | Comando                     | Porta |
| ---------------- | --------------------------- | ----- |
| Banco (Postgres) | `docker run …`              | 5433  |
| Notifier         | `node server.js`            | 4000  |
| Backend          | `mvn spring-boot:run`       | 8080  |
| Frontend         | `npx http-server -p 5500 .` | 5500  |
