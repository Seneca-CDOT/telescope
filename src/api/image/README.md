# Image Service

The Image Service provides optimized images for backgrounds.

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

By default the server is running on http://localhost:4444/.

You can use any/all the following optional query params:

1. `t` - the desired image type. Must be one of `jpeg`, `jpg`, `webp`, `png`. Defaults to `jpeg`.
1. `w` - the desired width. Must be between `200` and `2000`. Defaults to `800` if missing.
1. `h` - the desired height. Must be between `200` and `3000`.

NOTE: if both `w` and `h` are used, the image will be resized/cropped to cover those dimensions

### Examples

- `GET /image` - returns the default background JPEG with width = 800px
- `GET /image?w=1024`- returns the default background JPEG with width = 1024px
- `GET /image?h=1024`- returns the default background JPEG with height = 1024px
- `GET /image?w=1024&h=1024`- returns the default background JPEG with width = 1024px and height = 1024px
- `GET /image?t=png`- returns the default background JPEG with width = 800px as a PNG

- `GET /gallery` - an HTML gallery page will be returned of all backgrounds
- `GET /image/default.jpg` - returns a specific image (e.g., `default.jpg` or any other) from the available backgrounds

- `GET /healthcheck` - returns `{ "status": "ok" }` if everything is running properly

## Docker

- To build and tag: `docker build . -t telescope_img_svc:latest`
- To run locally: `docker run -p 4444:4444 telescope_img_svc:latest`
