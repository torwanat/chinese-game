FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY ./frontend/package*.json ./
RUN npm ci

COPY ./frontend/ .
RUN npm run build -- --configuration=production

FROM nginx:stable-alpine

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/chinese-app/browser/ /usr/share/nginx/html/

EXPOSE 80
