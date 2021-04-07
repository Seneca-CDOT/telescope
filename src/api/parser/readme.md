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

By default the server is running on <http://localhost:10000/>.

### Examples

- `GET /` - Displays Bull-Board

## Docker

- To build and tag: `docker build . -t telescope_parser_svc:latest`
- To run locally: `docker run -p 10000:10000 telescope_parser_svc:latest`
