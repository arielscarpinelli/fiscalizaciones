# Use the official Node image.
# https://hub.docker.com/_/node
FROM node:10-alpine

# Create and change to the app directory.
WORKDIR /app

COPY docker/sshd_config /etc/ssh/
COPY docker/entrypoint.sh /app

RUN apk add openssh \
     && echo "root:Docker!" | chpasswd \
     && ssh-keygen -A \
     && chmod +x entrypoint.sh

# Copying this separately prevents re-running npm install on every code change.
COPY backend/package*.json ./
RUN npm install

# Copy local code to the container image.
COPY backend/. /app
COPY frontend-fiscal/build /app/public
COPY frontend/build /app/admin

# Configure and document the service HTTP port.
ENV PORT 8080

# Open port 2222 for Azure WebSSH access
EXPOSE 8080 2222

ENTRYPOINT ["/app/entrypoint.sh"]

# Run the web service on container startup.
CMD ["npm", "run", "prod:docker"]
