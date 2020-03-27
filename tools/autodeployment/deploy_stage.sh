#!/bin/bash

# Shutdown
cd ../telescope

docker-compose -f docker-compose-staging.yml down

docker system prune -af


# Delete and clone
cd ..

rm -rf telescope

git clone https://github.com/Seneca-CDOT/telescope.git --depth=1


# Deploy
cd telescope/

cp env.staging .env

docker-compose -f docker-compose-staging.yml up -d
