FROM node:18.19.0

RUN mkdir -p /var/app

WORKDIR /var/app

COPY . .

RUN yarn install
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start:dev"]
