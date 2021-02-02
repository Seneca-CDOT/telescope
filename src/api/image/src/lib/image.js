const sharp = require('sharp');

// https://sharp.pixelplumbing.com/api-resize
const resize = (width, height) => sharp({ failOnError: false }).resize({ width, height });

/**
 * Optimizes (and maybe resizes) the image stream. If a type is given,
 * use that, or default to JPEG.  If a width or height are given, use those,
 * otherwise fit the image to the width x height using CSS cover sizing.
 */
function optimize({ imgStream, width, height, imageType, res }) {
  // Picks the appropriate image type and set the content type.
  let transformer;
  switch (imageType) {
    case 'webp':
      res.type('image/webp');
      // https://sharp.pixelplumbing.com/api-output#webp
      transformer = () => resize(width, height).webp();
      break;
    case 'png':
      res.type('image/png');
      // https://sharp.pixelplumbing.com/api-output#avif
      transformer = () => resize(width, height).png();
      break;
    case 'jpeg':
    case 'jpg':
    default:
      res.type('image/jpeg');
      // https://sharp.pixelplumbing.com/api-output#jpeg
      transformer = () => resize(width, height).jpeg();
      break;
  }

  return imgStream.pipe(transformer());
}

module.exports.optimize = optimize;
