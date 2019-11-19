require('../../config');
const app = require('./app.js');

const HTTP_PORT = process.env.PORT || 3000;

const server = app.listen(HTTP_PORT, () => {
  console.log(`Telescope listening on port ${HTTP_PORT}`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION:  Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
