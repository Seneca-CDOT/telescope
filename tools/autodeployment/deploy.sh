#!/bin/bash

set -e
set -u
set -x

DOCKER_FILE=docker-compose-production.yml

if [[ $(docker ps -f name=blue -q) ]]; then
    ENV="green"
    OLD="blue"
else
    ENV="blue"
    OLD="green"
fi

# Delete and Clone Latest
cd ..
rm -rf telescope
git clone https://github.com/Seneca-CDOT/telescope.git --depth=1
cd telescope


# Set NGINX FILE + ENV_FILE Params
if [ $1 = 'production' ]
then
  ENV_FILE=env.production
elif [ $1 = 'staging' ]
then
  sed -i 's/telescope\./dev\.telescope\./g' nginx.conf
  ENV_FILE=env.staging
else
  echo $1 is not a valid argument. Please use either production or staging.
  exit 1
fi

# Takes the second argument the name of the env file to be used
cp $ENV_FILE .env

# We need a way to get the unsplash client id into Telescope's ENV without storing in git,
# so we pass it through the autodeployment ENV, which is set up manually. We need a betters solution later.
echo UNSPLASH_CLIENT_ID=$2  >> .env
echo "" >> .env

echo "Building $ENV Container"
docker-compose -f $DOCKER_FILE --project-name=$ENV build telescope

# Delete associated project orphans (services) and volumes
echo "Stopping "$OLD" Environment"
docker-compose -f $DOCKER_FILE --project-name=$OLD down --remove-orphans

echo "Deleting $OLD Volumes"
docker volume prune -f

echo "Starting $ENV Environment"
docker-compose -f $DOCKER_FILE --project-name=$ENV up -d

# Will fail on final container
# this is anticipated and doesn't affect new environment
echo "Deleting $OLD Containers"
docker rmi $(docker images $OLD\_* -aq ) -f  2> /dev/null

# Delete all older containers which were build artifacts. 
# On dev environment, this should reduce all usage by min ~20%
docker rmi $(docker images -a | grep "^<none>" | awk '{print $3}') 2> /dev/null
