# Use Node.js base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy root package.json for building frontend
COPY package*.json ./
RUN npm install

# Copy backend package.json and install dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy the rest of the application
COPY . .

# Build the React frontend
RUN npm run build && ls -la dist

# Expose the port (Hugging Face default is 7860)
EXPOSE 7860

# Start the Node.js server
CMD ["node", "backend/server.js"]
