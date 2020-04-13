#!/bin/bash
set -e
set -u
set -x

# Set DOCKER_FILE + ENV_FILE
if [ $1 = 'production']
then
  DOCKER_FILE=docker-compose-production.yml
  ENV_FILE=env.production
elif [ $1 = 'staging']
then
  DOCKER_FILE=docker-compose-staging.yml
  ENV_FILE=env.staging
else
  echo $1 is not a valid argument. Please use either production or staging.
  exit 1
fi

# Shutdown
cd ../telescope

docker-compose -f $DOCKER_FILE down

docker system prune -af --volumes


# Delete and clone
cd ..

rm -rf telescope

git clone https://github.com/Seneca-CDOT/telescope.git --depth=1


# Deploy
cd telescope/

# Takes the second argument the name of the env file to be used
cp $ENV_FILE .env

docker-compose -f $DOCKER_FILE up -d
