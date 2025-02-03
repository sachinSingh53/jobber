FROM node:18

WORKDIR /app
COPY package*.json ./
COPY .npmrc ./
COPY src ./src
RUN npm install && npm install -g nodemon

EXPOSE 4001

CMD [ "npm","run","dev" ];