# PRODUCTION READY
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 5005
USER node
CMD ["npm", "start"]
