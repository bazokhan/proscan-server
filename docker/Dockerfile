FROM node:10
RUN npm install -g yarn
RUN npm install -g prisma
RUN mkdir /server
WORKDIR /server
COPY . /server
CMD ls -ltr && yarn && ifconfig && ./docker/wait-for-it.sh localhost:4466 --timeout=20 -- echo "prisma is up" && cd prisma && prisma deploy && yarn start
