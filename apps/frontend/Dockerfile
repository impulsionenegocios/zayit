FROM node:18-alpine

# Instala pnpm globalmente
RUN npm install -g pnpm@10.8.0

WORKDIR /app

# Copia tudo do monorepo para o container
COPY . .

# Define o diretório do frontend (assumindo que o monorepo está na raiz)
WORKDIR /app/apps/frontend

# Instala as dependências do projeto frontend
RUN pnpm install

# Expõe a porta que o Vite utiliza (5173, e o docker-compose fará o mapeamento para 3000)
EXPOSE 5173

# Roda o script "dev" do package.json, que chama o Vite
CMD ["pnpm", "run", "dev"]
