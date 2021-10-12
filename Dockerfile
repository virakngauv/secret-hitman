FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN apt-get update && apt-get install -y cron certbot
CMD certbot certonly --webroot --agree-tos --email virakngauv@gmail.com -d secrethitman.com -w build --keep-until-expiring --no-eff-email --pre-hook "node server/index.js" --post-hook "node server/index.js" && node server/index.js
