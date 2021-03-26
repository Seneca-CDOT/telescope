# Image Service

The Parser service parses posts from user's feeds.

## Install

```
npm install
```

## Usage

```
# normal mode
npm start

# dev mode with automatic restarts
npm run dev
```

By default the server is running on <http://localhost:8888/>.

### Examples

- `GET /queues` - Displays Bull-Board

## Docker

- To build and tag: `docker build . -t telescope_parser_svc:latest`
- To run locally: `docker run -p 8888:8888 telescope_parser_svc:latest`
