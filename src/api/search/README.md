# Search Service

The Search Service provides a direct querying controller which interfaces with our ELK stack.

## Install

```
Run `pnpm install` from the root.
```

## Usage

```
# normal mode
pnpm start
```

By default the server is running on http://localhost:4445/.

### Examples

- `GET /query?text=Telescope&filter=post&page=0` - Returns the search results of posts containing the keyword "Telescope"
- `GET /query?text=SenecaCDOT?filter=author&page=0` - Returns the search results of authors which relate to the keyword "SenecaCDOT"
- `GET /healthcheck` - returns `{ "status": "ok" }` if everything is running properly

## Docker / Docker-Compose

### Docker

- To build and tag: `docker build . -t telescope_search_svc:latest`
- To run locally: `docker run -p 4445:4445 telescope_search_svc:latest`

### Docker-Compose

_Commands to be run from the `~/src/api` directory_

- To build and run: `docker-compose -f docker-compose-api-production.yml up --build search`
