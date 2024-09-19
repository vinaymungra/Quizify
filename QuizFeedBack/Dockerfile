
FROM node:18-alpine

WORKDIR /app/QuizFeedBack

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8004

CMD ["npm", "start"]
