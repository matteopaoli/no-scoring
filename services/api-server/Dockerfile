# Use latest LTS version of Node.js
FROM node:20 AS development

# Set working directory inside container
WORKDIR /app

# Copy package files separately for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the entire application source code
COPY . .

# Build the application
RUN npm run build

################
## PRODUCTION ##
################
FROM node:20 AS production

# Set environment variables
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set working directory
WORKDIR /app

# Copy only necessary files from development stage
COPY --from=development /app/package*.json ./
COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/dist ./dist

# Set a non-root user for security
RUN useradd -m appuser
USER appuser

# Expose application port
EXPOSE 8080

# Run the application
CMD ["node", "dist/main"]
