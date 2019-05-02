# Using Dockerfile (in parent directory)
```
docker-compose build
docker-compose up
```

# Manual setup
```
npm install -g prisma
npm install -g yarn
cd prisma
docker-compose up -d
prisma deploy
yarn
yarn start
```
