
FROM node:18-alpine

WORKDIR /app/Authentication

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8001

CMD ["npm", "start"]
