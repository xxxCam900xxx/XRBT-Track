FROM node:16

# Arbeitsverzeichnis im Container erstellen
WORKDIR /usr/src/app

# Kopiere die package.json und package-lock.json
COPY ../app/frontend/package*.json ./

# Installiere die React-Abhängigkeiten
RUN npm install

# Kopiere den gesamten React-Code
COPY ../app/frontend/ ./

# Baue die React-App
RUN npm run build

# Exponiere den Port 3000
EXPOSE 3000

# Starte die React-App
CMD ["npm", "start"]
