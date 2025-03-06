# Usar imagem oficial do Node.js
FROM node:22

# Definir diretório de trabalho
WORKDIR /app

# Atualizar o npm para a versão mais recente
RUN npm install -g npm@latest

# Definir ambiente de desenvolvimento
ENV NODE_ENV=development

# Copiar arquivos de dependências e instalar (incluindo dependências de desenvolvimento)
COPY package.json package-lock.json ./
RUN npm install
RUN npm ci

# Copiar todo o código do NestJS
COPY . .

# Expor porta padrão do NestJS e debugging (Opcional)
EXPOSE 3003 9229

# Comando para iniciar o servidor no modo de desenvolvimento
CMD ["npm", "run", "start:dev"]
