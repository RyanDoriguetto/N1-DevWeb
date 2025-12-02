# Imagem base com Node
FROM node:20

# Pasta de trabalho dentro do container
WORKDIR /app

# Copia só os arquivos de dependências primeiro
COPY package*.json ./

# Instala o Angular CLI globalmente (pra garantir que o "ng" exista)
RUN npm install -g @angular/cli@20.3.6

# Instala as dependências do projeto
RUN npm install

# Agora copia o resto do código
COPY . .

# Porta usada pelo ng serve
EXPOSE 4200

# Comando para subir o servidor Angular
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "4200"]
