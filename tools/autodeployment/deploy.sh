#!/bin/bash

set -e
set -u

# Delete and Clone Latest
cd ..
rm -rf telescope
git clone https://github.com/Seneca-CDOT/telescope.git --depth=1
cd telescope


# Set NGINX FILE + ENV_FILE Params
if [ $1 = 'production' ]
then
  ENV_FILE=config/env.production
  # The env.secrets file doesn't live in git
  SECRETS_ENV_FILE=../config/env.production.secrets
elif [ $1 = 'staging' ]
then
  ENV_FILE=config/env.staging
  # The env.secrets file doesn't live in git
  SECRETS_ENV_FILE=../config/env.staging.secrets
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


# Include the current commit sha that we're building
echo "GIT_COMMIT=$2" >> $ENV_FILE

# Include the GitHub Token we get from the script invocation in the env file
echo "GITHUB_TOKEN=$3" >> $ENV_FILE

# Include the local secrets in the env file
cat $SECRETS_ENV_FILE >> $ENV_FILE


echo "Pulling $ENV Containers"
docker-compose --env-file $ENV_FILE --project-name=$ENV pull

# Delete associated project orphans (services) and volumes
echo "Stopping "$OLD" Environment"
docker-compose --env-file $ENV_FILE --project-name=$OLD down --remove-orphans

echo "Deleting $OLD Volumes"
docker volume prune -f

echo "Starting $ENV Environment"
docker-compose --env-file $ENV_FILE --project-name=$ENV up -d

echo "Removing dangling images"
docker rmi $(docker images -f "dangling=true" -q)

echo "Removing $OLD Environment"
docker rmi $(docker images $OLD\_* -aq ) -f 2> /dev/null
