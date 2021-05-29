# Use the official Node image.
# https://hub.docker.com/_/node
FROM node:10-alpine

# Create and change to the app directory.
WORKDIR /app

# Copying this separately prevents re-running npm install on every code change.
COPY backend/package*.json ./
RUN npm install

# Copy local code to the container image.
COPY backend/. /app
COPY frontend/build /app/public

# Configure and document the service HTTP port.
ENV PORT 8080
EXPOSE 8080

# Run the web service on container startup.
CMD ["npm", "run", "prod:docker"]
