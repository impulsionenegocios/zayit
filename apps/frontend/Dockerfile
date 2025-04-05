FROM node:18-alpine

WORKDIR /app

COPY . .

RUN corepack enable && pnpm install

EXPOSE 3000
CMD ["pnpm", "run", "dev"]
