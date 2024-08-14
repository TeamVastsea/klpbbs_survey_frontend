FROM node:21-alpine3.18 as builder

WORKDIR /usr/builder

ENV NEXT_PUBLIC_API_SERVER="https://wj.klpbbs.cn"

ADD . .

RUN yarn install && \
    yarn build

FROM nginx

COPY --from=builder /usr/builder/out /usr/share/nginx/html

EXPOSE 80