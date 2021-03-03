FROM node:alpine

RUN mkdir -p /usr/src/benchdb && chown -R node:node /usr/src/benchdb

WORKDIR /usr/src/benchdb

COPY package.json package-lock.json ./

RUN chown node:node ./package-lock.json && chown node:node ./package.json

USER node

RUN npm i

COPY --chown=node:node . .

EXPOSE 3000