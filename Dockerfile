FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN apt-get update && apt-get install -y cron
# CMD apt-get update && apt-get install -y certbot ; certbot certonly --webroot --agree-tos --email virakngauv@gmail.com -d codenames-hitman.com -w build --keep-until-expiring --no-eff-email --test-cert
CMD node test-application-local-simple.js
# CMD apt-get update && apt-get install -y certbot ; certbot certonly --webroot --agree-tos --email virakngauv@gmail.com -d codenames-hitman.com -w build --keep-until-expiring --no-eff-email --test-cert
# the above line might need to be after node launches so that there's a web server to serve the http challenge 
