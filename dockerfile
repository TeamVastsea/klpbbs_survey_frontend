FROM node:21-alpine3.18 as builder

WORKDIR /usr/builder

ADD . .

RUN yarn install && \
    yarn build && \
    yarn start

EXPOSE 3000
