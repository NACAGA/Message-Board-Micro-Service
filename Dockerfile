
# Use a base image
FROM node:20-alpine

# set node environment
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# set working directory
WORKDIR /workspace

# Copy package.json and package-lock.json
COPY index.js .
COPY package*.json .
COPY src src
#COPY test test

# Install dependencies
RUN npm ci
RUN npm install

# override localhost with the host IP if given as an argument
ARG DB_HOST=localhost
ENV DB_HOST=${DB_HOST}

# Start the application 
CMD ["npm", "run", "start"]
