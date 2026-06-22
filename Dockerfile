# React build
FROM node:22-alpine AS frontend-build

WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm ci

# Spring build
COPY frontend/ ./
RUN npm run build

FROM gradle:8.7-jdk21 AS backend-build

WORKDIR /app

COPY event-planner-api/ ./
RUN gradle bootJar

# Runtime
FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY --from=backend-build /app/build/libs/*.jar app.jar

COPY --from=frontend-build /frontend/dist /srv/react

RUN apt-get update && apt-get install -y caddy

COPY infra/caddy/Caddyfile /etc/caddy/Caddyfile

EXPOSE 80

CMD sh -c "java -jar app.jar & caddy run --config /etc/caddy/Caddyfile --adapter caddyfile"