FROM node:18-alpine

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY ./ ./

RUN npm ci
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]