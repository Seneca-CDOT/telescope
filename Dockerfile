FROM node:10

# Change working directory
WORKDIR "/telescope"

# Update packages and install dependency packages for services
RUN apt-get update \
 && apt-get dist-upgrade -y \
 && apt-get clean \
 && echo 'Finished installing dependencies'

# Copy package.json
COPY package.json ./

# Install npm production packages
RUN npm install --production

COPY . .

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000

USER node

CMD ["npm", "start"]
