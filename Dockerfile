# Client App
FROM node:8.9-alpine
LABEL authors="Asad Sahi"
WORKDIR /usr/src/app
COPY ["package.json", "./"]
RUN npm install
COPY . .
RUN npm run db
RUN npm run build:prod

EXPOSE 3000
CMD ["npm", "run", "serve:prod"]
