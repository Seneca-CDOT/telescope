# NOTE: we assume that the environment variable DATABASE_URL will
# be defined when a new container is run.  It should take the form:
# DATABASE_URL=postgresql://postgres:postgress_password@localhost/postgres
FROM node:16-alpine3.15

WORKDIR /db-migrations
COPY . .
RUN npm install
CMD ["npm", "run", "migrate"]
