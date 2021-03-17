#!/bin/bash

set -e
set -u
set -x

# Delete and Clone Latest
cd ..
rm -rf telescope
git clone https://github.com/Seneca-CDOT/telescope.git --depth=1
cd telescope


# Set NGINX FILE + ENV_FILE Params
if [ $1 = 'production' ]
then
  ENV_FILE=config/env.production
elif [ $1 = 'staging' ]
then
  ENV_FILE=config/env.staging
else
  echo $1 is not a valid argument. Please use either production or staging.
  exit 1
fi

if [[ $(docker-compose --env-file $ENV_FILE --project-name=blue ps -q) ]]; then
    ENV="green"
    OLD="blue"
else
    ENV="blue"
    OLD="green"
fi

echo "Building $ENV Container"
docker-compose --env-file $ENV_FILE --project-name=$ENV build

# Delete associated project orphans (services) and volumes
echo "Stopping "$OLD" Environment"
docker-compose --env-file $ENV_FILE --project-name=$OLD down --remove-orphans

echo "Deleting $OLD Volumes"
docker volume prune -f

echo "Starting $ENV Environment"
docker-compose --env-file $ENV_FILE --project-name=$ENV up -d

# Will fail on final container
# this is anticipated and doesn't affect new environment
echo "Deleting $OLD Containers"
docker rmi $(docker images $OLD\_* -aq ) -f  2> /dev/null

# Delete all older containers which were build artifacts.
# On dev environment, this should reduce all usage by min ~20%
docker rmi $(docker images -a | grep "^<none>" | awk '{print $3}') 2> /dev/null
