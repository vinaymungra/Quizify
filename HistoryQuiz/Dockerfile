
FROM node:18-alpine

WORKDIR /app/HistoryQuiz

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8003

CMD ["npm", "start"]
