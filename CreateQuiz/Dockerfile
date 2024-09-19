
FROM node:18-alpine

WORKDIR /app/CreateQuiz

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8002

CMD ["npm", "start"]
