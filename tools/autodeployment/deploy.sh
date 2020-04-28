#!/bin/bash
set -e
set -u
set -x

# Set DOCKER_FILE + ENV_FILE
if [ $1 = 'production' ]
then
  DOCKER_FILE=docker-compose-production.yml
  ENV_FILE=env.production
elif [ $1 = 'staging' ]
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

# We need a way to get the unsplash client id into Telescope's ENV without storing in git,
# so we pass it through the autodeployment ENV, which is set up manually. We need a betters solution later.
echo UNSPLASH_CLIENT_ID=$2  >> .env
echo "" >> .env

docker-compose -f $DOCKER_FILE up -d
