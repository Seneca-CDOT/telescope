# Search Service

The Search Service provides a direct querying controller which interfaces with our ELK stack.

## Install

```
Run `pnpm install` from the root.
```

## Usage

```
# docker mode
pnpm start
```

By default the server is running on http://localhost:4445/.

```
# dev mode
pnpm services:start
```

By default the server is running on http://localhost/v1/search.

### Examples

- `GET /?post=Telescope&page=0` - Returns the search results of posts containing the keyword "Telescope"
- `GET /?title=Release&page=0` - Returns the search results of titles containing the keyword "Release"
- `GET /?author=SenecaCDOT&page=0` - Returns the search results of authors which relate to the keyword "SenecaCDOT"
- `GET /authors/autocomplete/?author=te` - Returns the search results of authors with names that start with "te"
- `GET /authors/autocomplete/?author=t s` - Returns the search results of authors with names that start with "t" and "s"
- `GET /healthcheck` - returns `{ "status": "ok" }` if everything is running properly

## Docker / Docker-Compose

### Docker

- To build and tag: `docker build . -t telescope_search_svc:latest`
- To run locally: `docker run -p 4445:4445 telescope_search_svc:latest`

### Docker-Compose

_Commands to be run from the `root` directory_

- To build and run: `docker-compose -f docker/development.yml up --build search`
