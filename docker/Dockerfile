FROM docker-reg.ecovacs.com/library/node:latest-browsers as builder

WORKDIR /usr/src/app/

USER root
RUN npm install tyarn -g

COPY package.json ./
RUN tyarn

COPY ./ ./

RUN npm run build

FROM nginx

WORKDIR /usr/share/nginx/html/

COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/src/app/dist  /usr/share/nginx/html/

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]
