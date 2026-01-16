# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
# COPY package.json package-lock.json ./
COPY package.json ./

# Install dependencies
# RUN npm ci
RUN npm i

# Copy source code
COPY . .

# Build argument for API URL
ARG API_URL=http://localhost:8080/api/v1
ENV API_URL=$API_URL

# Build the application
RUN npm run build

# Stage 2: Production with nginx
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/public /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
