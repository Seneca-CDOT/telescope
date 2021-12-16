# Posts Service

The Post Service parses posts from user's feeds to display them on Telescope.

## Install

```
pnpm install
```

## Usage

```
# normal mode
pnpm start

# dev mode with automatic restarts
pnpm dev
```

By default the server is running on <http://localhost:5555/>.

### Examples

- `GET /posts` - Returns the 10 latests posts parsed

- `GET /posts/:id` - Returns information about a specific post

- `GET /healthcheck` - returns `{ "status": "ok" }` if everything is running properly

## Docker

- To build and tag: `docker build . -t telescope_posts_svc:latest`
- To run locally: `docker run -p 5555:5555 telescope_posts_svc:latest`
