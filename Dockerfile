FROM node:10
RUN npm install -g yarn
RUN npm install -g prisma
RUN mkdir /server
WORKDIR /server
COPY . /server
CMD ls -ltr && yarn && pwd && cd prisma && prisma deploy && yarn start
