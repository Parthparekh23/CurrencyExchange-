# Use a Node.js image as the base
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

RUN npm install

# Copy the rest of your project files into the container
COPY . .

# Build the project (TypeScript compilation)
RUN npm run build --verbose


# Expose the port your app runs on (if it runs a server, like Express)
EXPOSE 3000

# Define the command to start the app
CMD ["npm", "start"]
