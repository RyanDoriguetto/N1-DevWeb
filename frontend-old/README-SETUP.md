# Frontend (Angular) — Setup

1) Gere o projeto base com Angular CLI:
```bash
npm i -g @angular/cli
ng new coffee-frontend --routing --style=scss
cd coffee-frontend
```

2) Adicione arquivos de **exemplo** abaixo nas pastas correspondentes:
- `src/app/auth/*` (guards, interceptor, auth.service)
- `src/app/admin/*`, `src/app/caixa/*`, `src/app/atendente/*`
- `src/app/shared/*`

3) Instale o Socket.IO client para tempo real (opcional):
```bash
npm i socket.io-client
```

4) Ajuste `environment.ts` com a URL da API e do Notifier.

> Este diretório contém exemplos prontos para copiar/colar.
