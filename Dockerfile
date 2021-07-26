FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN docker image prune -af
EXPOSE 80
CMD node test-application-local.js