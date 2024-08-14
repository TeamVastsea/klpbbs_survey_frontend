FROM node:21-alpine3.18 as builder

WORKDIR /usr/builder

ADD . .

RUN yarn install && \
    yarn build
    
    FROM node:21-alpine3.18
    
WORKDIR /app
    
COPY --from=builder /usr/builder/node_modules ./node_modules
COPY --from=builder /usr/builder/public ./public
COPY --from=builder /usr/builder/.next ./.next
COPY --from=builder /usr/builder/package.json .
    
CMD [ "yarn", "start" ]