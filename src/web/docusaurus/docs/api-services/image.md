---
sidebar_position: 4
---

# Image Service

## Overview

The image service provides the images used in the hero banner found in the Telescope web page.

## API endpoints

### Get a random image or get a specific image by its name

```
GET /
```

#### Parameters

| Name  | Type             | In    | Description                                                                                                                           |
| ----- | ---------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------- |
| image | string OR number | path  | _Optional_. The exact name of the image if the value is a string, otherwise an index of the image (value is a number).                |
| w     | number           | query | _Optional_. The width of the image. It can be between 40 and 2000, inclusive. Defaults to 800.                                        |
| h     | number           | query | _Optional_. The height of the image. It can be between 40 and 3000, inclusive. Defaults to the height of the image when width is 800. |
| t     | string           | query | _Optional_. The type of image to render. It may be one of the following: `jpeg`, `jpg`, `png`, `webp`. Defaults to `jpeg`.            |

#### Code Samples

##### Shell

The following example gets an available random image:

```bash
curl http://localhost/v1/image
```

The following example gets a specific image by its index (the name is not needed):

```bash
curl http://localhost/v1/image/0
```

The following example gets a specific by its name (has to be exact):

```bash
curl http://localhost/v1/image/default.jpg
```

##### JavaScript

- With `fetch`

The following example gets an available random image:

```js
fetch('http://localhost/v1/image/');
```

The following example gets a specific image by its index (the name is not needed):

```js
fetch('http://localhost/v1/image/0');
```

The following example gets a specific by its name (has to be exact):

```js
fetch('http://localhost/v1/image/default.jpg');
```

#### Responses

##### Successful response

```
Status: 200 OK
```

The body is an image file, with a specific image format ([`WebP`](https://en.wikipedia.org/wiki/WebP)).

##### Bad Request

```
Status: 400 Bad Request
```

This could be due to the `image` argument trying to access other parts of the filesystem by going to other directories (e.g. `../access/somewhere/dangerous.jpg`).

##### Not Found

```
Status: 404 Not Found
```

This occurs when a given `image` parameter is for an image that does not actually exist.

##### Internal Server Error

```
Status: 500 Internal Server Error
```

This error is an unexpected one, and a specific reason for the error to occur cannot be given.

### Get a gallery of images

```
GET /gallery
```

#### Code Samples

##### Shell

```bash
curl http://localhost/v1/image/gallery
```

##### JavaScript

- With `fetch`

```js
fetch('http://localhost/v1/image/gallery');
```

#### Responses

##### Successful response

```
Status: 200 OK
```

The body is an HTML page with all of the images available enlisted.
