FROM circleci/node:latest-browsers as builder

WORKDIR /usr/src/app/

COPY ./ ./

COPY package.json ./
RUN tyarn

RUN npm run build

FROM nginx

WORKDIR /usr/share/nginx/html/

COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/src/app/dist  /usr/share/nginx/html/

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]
