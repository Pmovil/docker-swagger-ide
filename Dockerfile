FROM node:alpine

COPY package.json server.js deref.js /app/
COPY config/ /app/config/

WORKDIR /app

RUN npm i

ENV PORT 8080

EXPOSE 8080

VOLUME ["/app/swagger.yaml"]

CMD ["node", "server.js"]

