const fs = require('fs');
const { Router } = require('@senecacdot/satellite');
const { celebrate, Joi, errors, Segments } = require('celebrate');
const createError = require('http-errors');

const { optimize } = require('../lib/image');
const { getRandomPhotoFilename, getPhotoFilename } = require('../lib/photos');

const router = Router();

/**
 * Support the following optional query params:
 *
 *  - w: the width to resize the image to. Must be 200-2000. Defaults to 800.
 *  - h: the height to resize the image to. Must be 200-3000. Defaults to height of image at width=800
 *  - t: the image type to render, one of: jpeg, jpg, png, webp. Defaults to jpeg.
 *
 * We also support passing an image name as a param in the URL:
 *
 * - image: should look like look '_ok8uVzL2gI.jpg'. Don't allow filenames like '../../dangerous/path/traversal'.
 */
router.use(
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      t: Joi.string().valid('jpeg', 'jpg', 'webp', 'png'),
      w: Joi.number().integer().min(200).max(2000),
      h: Joi.number().integer().min(200).max(3000),
    }),
  })
);

// If the request accepts WebP, prefer that
const prefersWebP = (req) => (req.accepts('image/webp') ? 'webp' : 'jpeg');

const optimizeImage = (stream, req, res) => {
  const { t, w, h } = req.query;
  const options = {
    imgStream: stream,
    // We may have a width and height, or one or the other, or neither.
    width: w ? parseInt(w, 10) : null,
    height: h ? parseInt(h, 10) : null,
    // If we don't have a specific type, and the caller supports WebP, use that.
    imageType: t || prefersWebP(req),
    res,
  };

  // Use width=800 by default if no sizing info is specified
  if (!(options.width || options.height)) {
    options.width = 800;
  }

  // Optimize this image and stream back to the client
  optimize(options)
    .on('error', (err) => {
      req.log.error(err);
      res.status(500).end();
    })
    .pipe(res);
};

/**
 * Stream an optimized version of the chosen image back to the client,
 * using the options passed on the query string.
 */
router.use(
  '/:image?',
  /**
   * Either the client requests an image by name, or we pick one at random.
   * In both cases, we supply one on `req.imageFilename`.  If the requested
   * image doesn't exist, we'll 404 here.
   */
  function pickImage(req, res, next) {
    const { image } = req.params;

    // Generate a random filename and pass that on
    if (!image) {
      req.imageFilename = getRandomPhotoFilename();
      next();
      return;
    }

    // Don't allow path manipulation, only simple filenames matching our images
    if (!/^[-_a-zA-Z0-9]+\.jpg$/.test(image)) {
      next(createError(400, `Invalid image name: '${image}'`));
      return;
    }

    // Make sure this file exists before we pass it on
    const filename = getPhotoFilename(image);
    fs.access(filename, fs.FS_OK, (err) => {
      if (err) {
        next(createError(404, `Image '${image}' not found`));
      } else {
        req.imageFilename = filename;
        next();
      }
    });
  },
  function (req, res) {
    const stream = fs.createReadStream(req.imageFilename);

    // Deal with file stream not exiting
    stream.on('error', (err) => {
      console.error(err);
      res.status(500).end();
    });

    optimizeImage(stream, req, res);
  }
);

router.use(errors());

module.exports = router;
