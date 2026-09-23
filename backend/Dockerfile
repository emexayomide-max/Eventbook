# =========================
# Stage 1: Dependencies
# =========================
FROM node:24-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev


# =========================
# Stage 2: Production
# =========================
FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy only production dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application files
COPY package*.json ./
COPY server.js ./
COPY db.js ./
COPY middleware ./middleware
COPY database ./database

# Remove package-management tools from the runtime image
RUN rm -rf \
    /usr/local/lib/node_modules/npm \
    /usr/local/lib/node_modules/corepack \
    /usr/local/bin/npm \
    /usr/local/bin/npx \
    /usr/local/bin/corepack

EXPOSE 3001

# Run as non-root
USER node

CMD ["node", "server.js"]