FROM node:21-alpine3.18

WORKDIR /app

ADD . .

RUN yarn install && \
    yarn build

CMD [ "yarn", "start" ]