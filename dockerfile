FROM node:21-alpine3.18 as builder

WORKDIR /app

ADD . .

RUN yarn install && \
    yarn build
    
    FROM node:21-alpine3.18
    
WORKDIR /app
    
COPY --from=builder /home/node/app/node_modules ./node_modules
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/public ./public
COPY --from=builder /home/node/app/package.json .
    
CMD [ "yarn", "start" ]