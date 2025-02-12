# Use Node.js as the base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application files
COPY . .

# Expose backend port
EXPOSE 5000

# Start the Express server
CMD ["node", "server.js"]
