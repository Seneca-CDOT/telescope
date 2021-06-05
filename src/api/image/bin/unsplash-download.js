#!/usr/bin/env node

const { logger, fetch } = require('@senecacdot/satellite');
const stream = require('stream');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const unsplashPhotoUrls = require('../unsplash-photos.json');
const { photosDir } = require('../src/lib/photos');

const pipeline = promisify(stream.pipeline);

/**
 * Download the image at `url` and write to `filename`
 * @param {string} url - the URL to the image
 * @param {string} filename - the local filename to use when writing
 */
async function downloadPhoto(url, filename) {
  const response = await fetch(url);
  return pipeline(response.body, fs.createWriteStream(filename)).then(() =>
    logger.debug(`Wrote ${url} to ${filename}`)
  );
}

/**
 * Check if the given filename is already available locally
 * @param {string} filename - filename for image
 * @returns {boolean}
 */
async function shouldDownload(filename) {
  try {
    await fs.promises.access(filename, fs.FS_OK);
    // File already exists, skip
    return false;
  } catch (err) {
    // No such file, we need it
    return true;
  }
}

/**
 * Download all Unsplash.com images to photos/
 * @returns {Promise}
 */
function downloadUnsplashPhotos() {
  // The width we request from Unsplash. This will be our max width
  const defaultPhotoWidth = 2000;

  // Process this list, since we only need to download photos we don't already have locally
  const downloads = unsplashPhotoUrls
    .map((url) => {
      const unsplashId = url.trim().replace('https://unsplash.com/photos/', '');
      return {
        filename: path.join(photosDir, `${unsplashId}.jpg`),
        url: `https://unsplash.com/photos/${unsplashId}/download?force=true&w=${defaultPhotoWidth}`,
      };
    })
    .filter((photo) => shouldDownload(photo.filename));

  return Promise.all(downloads.map(({ url, filename }) => downloadPhoto(url, filename)));
}

downloadUnsplashPhotos()
  .then(() => {
    logger.info(`Finished downloading Unsplash photos to ${photosDir}`);
    return process.exit();
  })
  .catch((err) => {
    logger.warn(`Couldn't download Unsplash photos`, err.message);
    return process.exit(1);
  });
