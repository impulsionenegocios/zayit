# Etapa de build
FROM node:18-alpine AS build

WORKDIR /app
COPY . .
RUN corepack enable && pnpm install && pnpm run build

# Etapa de produção
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
