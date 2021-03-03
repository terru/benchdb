FROM node:alpine

RUN mkdir -p /usr/src/bechdb && chown -R node:node /usr/src/bechdb

WORKDIR /usr/src/bechdb

COPY package.json package-lock.json ./

RUN chown node:node ./package-lock.json && chown node:node ./package.json

USER node

RUN npm i

COPY --chown=node:node . .

EXPOSE 3000