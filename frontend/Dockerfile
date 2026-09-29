
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build


FROM nginx:alpine AS production

RUN apk upgrade --no-cache

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN chown -R nginx:nginx \
    /usr/share/nginx/html \
    /var/cache/nginx \
    /var/log/nginx \
    /etc/nginx/conf.d

RUN sed -i 's|^pid.*;|pid /tmp/nginx.pid;|' /etc/nginx/nginx.conf

EXPOSE 8080

USER nginx

CMD ["nginx", "-g", "daemon off;"]

