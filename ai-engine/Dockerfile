FROM node:20-alpine

WORKDIR /app

COPY package.json tsconfig.json ./
RUN npm install --no-fund --no-audit

COPY src/ ./src/

EXPOSE 3002

CMD ["npx", "tsx", "src/index.ts"]
