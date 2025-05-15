FROM node:18-slim

COPY package*.json /

RUN npm ci

COPY . /

EXPOSE 80
CMD [ "npm", "run", "dev"]