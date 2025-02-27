# Use the base node image (Debian-based)
FROM node:20-bullseye

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
  libc6-dev \
  python3 \
  make \
  g++ \
  gcc \
  build-essential \
  libcairo2-dev \
  libjpeg-dev \
  libpango1.0-dev \
  libgif-dev \
  libpixman-1-dev \
  libpangomm-1.4-dev \
  libfreetype6-dev \
  libcairo2 \
  libstdc++6 \
  && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json first (for caching dependencies)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Set environment for development
ENV NODE_ENV=development
EXPOSE 3000

# Start Next.js in dev mode
CMD ["npm", "run", "dev"]
