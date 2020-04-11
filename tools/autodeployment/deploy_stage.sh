#!/bin/bash

# Shutdown
cd ../telescope

docker-compose -f docker-compose-production.yml down

docker system prune -af --volumes


# Delete and clone
cd ..

rm -rf telescope

git clone https://github.com/Seneca-CDOT/telescope.git --depth=1


# Deploy
cd telescope/

cp env.staging .env

docker-compose -f docker-compose-production.yml up -d
