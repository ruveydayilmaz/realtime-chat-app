FROM node:14-slim
WORKDIR /temp
COPY package.json .
COPY . .
RUN npm install
CMD [ "npm", "start" ]