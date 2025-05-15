FROM node:18-slim

COPY package*.json /

RUN npm ci

COPY . /

EXPOSE 5173
CMD [ "npm", "run", "dev"]