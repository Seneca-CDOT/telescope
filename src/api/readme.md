# Telescope API Services

## Setup

_Note: For this directory to have a better understanding of context, copy `env.example` found in the root directory to this folder_

## API Lookup Table

| API                   | Docker Tag                                    | URL                      | Description                                  |
| --------------------- | --------------------------------------------- | ------------------------ | -------------------------------------------- |
| Image Service         | telescope_img_svc                             | image.docker.localhost   | Provides a dynamic image processing service  |
| Kibana Service        | docker.elastic.co/kibana/kibana               | kibana.docker.localhost  | Provides data exploration and visualizations |
| ElasticSearch Service | docker.elastic.co/elasticsearch/elasticsearch | elastic.docker.localhost | Provides data aggregation and search         |

## References

- [Digital Ocean: Using traefik v2 as a reverse proxy for Docker](https://www.digitalocean.com/community/tutorials/how-to-use-traefik-v2-as-a-reverse-proxy-for-docker-containers-on-ubuntu-20-04)
- [Logz: ELK stack on Docker](https://logz.io/blog/elk-stack-on-docker/)
- [Elastic: Running Elastic Search on Docker](https://www.elastic.co/guide/en/elastic-stack-get-started/master/get-started-docker.html)
