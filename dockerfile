FROM node:21-alpine3.18 as builder

WORKDIR /usr/builder

ADD . .

RUN yarn install && \
    yarn build

FROM nginx

COPY --from=builder /usr/builder/out /usr/share/nginx/html

EXPOSE 80