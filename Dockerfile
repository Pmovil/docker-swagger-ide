FROM node:alpine

WORKDIR /app

COPY package.json /app/

RUN npm i

ENV PORT 8080

EXPOSE 8080

VOLUME ["/app/specs"]

COPY app.js deref.js swagger.yaml.min /app/
COPY specs/ /app/specs/
COPY config/ /app/config/


CMD ["npm", "start"]

