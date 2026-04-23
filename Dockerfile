FROM node:20-alpine

WORKDIR /app

# Dependencies layer — cached while package files don't change
COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Application source
COPY --chown=node:node . .

ENV NODE_ENV=production
ENV PORT=3800

EXPOSE 3800

USER node

CMD ["node", "server.js"]
