ipv4=$(curl http://169.254.169.254/latest/meta-data/public-ipv4)

echo "
COMPOSE_PROJECT_NAME=telescope_api

# Compose files to use together during development. NOTE: we specify separator below
# so it will work on Windows and Unix, see
# https://docs.docker.com/compose/reference/envvars/#compose_file
COMPOSE_PATH_SEPARATOR=;
COMPOSE_FILE=docker/docker-compose.yml;docker/development.yml


# The host where the Telescope 1.0 front-end and back-end are run.
TELESCOPE_HOST=http://$ipv4:3000

# The host where all the microservices run (e.g., http://localhost)
# NOTE: if you change this, change all other occurrences below too.
API_HOST=http://$ipv4

# Front-end web URL (entry point to the next.js app). Make sure that the
# ALLOWED_APP_ORIGINS variable below includes this URL, so that the Auth
# service will allow redirects back to this origin.
WEB_URL=http://$ipv4:8000

# The API Version, used as a prefix on all routes: /v1
API_VERSION=v1


################################################################################
# Auth Service
################################################################################

# Auth Service Port (default is 7777)
AUTH_PORT=7777

# Auth Service URL
AUTH_URL=http://$ipv4/v1/auth

# The Single Sign On (SSO) login service URL
SSO_LOGIN_URL=http://$ipv4:8081/simplesaml/saml2/idp/SSOService.php

# The callback URL endpoint to be used by the SSO login service (see the /auth route)
SSO_LOGIN_CALLBACK_URL=http://$ipv4/v1/auth/login/callback

# The Single Logout (SLO) service URL
SLO_LOGOUT_URL=http://$ipv4:8081/simplesaml/saml2/idp/SingleLogoutService.php

# The callback URL endpoint to be used by the SLO logout service (see the /auth route)
SLO_LOGOUT_CALLBACK_URL=http://$ipv4/v1/auth/logout/callback

# The SSO Identity Provider's public key certificate. NOTE: this is the public
# key cert of the test login IdP docker container.  Update for staging and prod.
SSO_IDP_PUBLIC_KEY_CERT=MIIDXTCCAkWgAwIBAgIJALmVVuDWu4NYMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQwHhcNMTYxMjMxMTQzNDQ3WhcNNDgwNjI1MTQzNDQ3WjBFMQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzUCFozgNb1h1M0jzNRSCjhOBnR+uVbVpaWfXYIR+AhWDdEe5ryY+CgavOg8bfLybyzFdehlYdDRgkedEB/GjG8aJw06l0qF4jDOAw0kEygWCu2mcH7XOxRt+YAH3TVHa/Hu1W3WjzkobqqqLQ8gkKWWM27fOgAZ6GieaJBN6VBSMMcPey3HWLBmc+TYJmv1dbaO2jHhKh8pfKw0W12VM8P1PIO8gv4Phu/uuJYieBWKixBEyy0lHjyixYFCR12xdh4CA47q958ZRGnnDUGFVE1QhgRacJCOZ9bd5t9mr8KLaVBYTCJo5ERE8jymab5dPqe5qKfJsCZiqWglbjUo9twIDAQABo1AwTjAdBgNVHQ4EFgQUxpuwcs/CYQOyui+r1G+3KxBNhxkwHwYDVR0jBBgwFoAUxpuwcs/CYQOyui+r1G+3KxBNhxkwDAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEAAiWUKs/2x/viNCKi3Y6blEuCtAGhzOOZ9EjrvJ8+COH3Rag3tVBWrcBZ3/uhhPq5gy9lqw4OkvEws99/5jFsX1FJ6MKBgqfuy7yh5s1YfM0ANHYczMmYpZeAcQf2CGAaVfwTTfSlzNLsF2lW/ly7yapFzlYSJLGoVE+OHEu8g5SlNACUEfkXw+5Eghh+KzlIN7R6Q7r2ixWNFBC/jWf7NKUfJyX8qIG5md1YUeT6GBW9Bm2/1/RiO24JTaYlfLdKK9TYb8sG5B+OLab2DImG99CJ25RkAcSobWNF5zD0O6lgOo3cEdB/ksCq3hmtlC/DlLZ/D8CJ+7VuZnS1rR2naQ==

# Our apps's Entity ID, which is also the URL to our metadata.
SAML_ENTITY_ID=http://$ipv4/v1/auth/sp

# SECRET = cookie session SECRET. If left empty, one will be set automatically
SECRET=secret-sauce

# ADMINISTRATORS is a list (space delimited) of users who have administrator
# rights. Use the user's nameID (user2@example.com) or hashed version of
# nameID (2b3b2b9ce8).  Either will work.
ADMINISTRATORS=user1@example.com

# Origins of web apps that we'll allow for redirects. See src/api/auth/test
ALLOWED_APP_ORIGINS=http://$ipv4:8000 http://$ipv4:8888

# The URI of the auth server
JWT_ISSUER=http://$ipv4/v1/auth

# The microservices origin
JWT_AUDIENCE=http://$ipv4

# How long should a JWT work before it expires
JWT_EXPIRES_IN=1h


################################################################################
# Image Service
################################################################################

# Image Service Port (default is 4444)
IMAGE_PORT=4444

# Image Service URL
IMAGE_URL=http://$ipv4/v1/image

################################################################################
# Search Service
################################################################################

# Search Service Port (default is 4445)
SEARCH_PORT=4445

# Search Service URL
SEARCH_URL=http://$ipv4/v1/search

################################################################################
# Users Service
################################################################################

# Users Service Port (default is 7000)
USERS_PORT=7000

# Users Service URL
USERS_URL=http://$ipv4/v1/users
FIRESTORE_EMULATOR_HOST=firebase:8088


################################################################################
# Posts Service
################################################################################

# Posts Service Port (default is 5555)
POSTS_PORT=5555

# Posts Service URL
POSTS_URL=http://$ipv4/v1/posts

# Redis Mock info
MOCK_REDIS=


################################################################################
# Feed Discovery Service
################################################################################

# Feed Discovery Service Port (default is 9999)
FEED_DISCOVERY_PORT=9999

# Feed Discovery Service URL
FEED_DISCOVERY_URL=http://$ipv4/v1/feed-discovery


################################################################################
# Parser Service
################################################################################

# Parser Service Port (default is 10000)
PARSER_PORT=10000

# Parser Service URL
PARSER_URL=http://$ipv4/v1/parser

################################################################################
# Telescope 1.0 Legacy Environment
################################################################################

# NODE_ENV should be one of 'development' or 'production'
NODE_ENV=development

# PORT is the port used by the web server
PORT=3000

API_URL=http://$ipv4:3000

# LOG_LEVEL is used to set the level of debugging for the logs.
# info, error and debug are commonly used levels. See http://getpino.io/#/docs/api?id=level for more info on levels.
# to completely disable all logs, use silent.
LOG_LEVEL=debug

# LOG_FILE is used to set a destination path to write logs. Works in production mode only.
#LOG_FILE=

# FEED_URL url used to access feed list
FEED_URL=https://wiki.cdot.senecacollege.ca/wiki/Planet_CDOT_Feed_List
# Milliseconds to wait after attempting to fetch the feed list when the server is not available
FEED_URL_INTERVAL_MS=30000

# Max number of results per query
ELASTIC_MAX_RESULTS_PER_PAGE=5
# Delay to check connectivity with Elasticsearch in ms
ELASTIC_DELAY_MS=10000

# Period of time (seconds) that an unprocessed feed must wait before its
# next processing attempt (due to previous attempt responding with HTTP 429)
FEED_PROCESSING_DELAY_SEC=3600

# Feed job queue attempts
FEED_QUEUE_ATTEMPTS=12

# Feed job queue delay (ms) = 10 minutes
FEED_QUEUE_DELAY_MS=600000

# Number of concurrent worker processors to run. Use * if you want to run
# one per CPU. Use a number if you want to set it manually, up to a max
# of the CPU count.  If not set, we'll assume 1.
FEED_QUEUE_PARALLEL_WORKERS=1

# Max number of posts per page
MAX_POSTS_PER_PAGE=5
" >> ../telescope/config/env.remote
