FROM node:20-alpine as builder

ENV APP_DIR=/app

WORKDIR $APP_DIR

COPY ./package.json .

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]