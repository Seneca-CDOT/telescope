const { PrismaClient } = require('@prisma/client');
const feeds = require('./feeds.json');
const quotes = require('./quotes.json');

(async function seedFeeds() {
  const prisma = new PrismaClient();

  await Promise.all(
    feeds.map((feed) => {
      return prisma.feeds.createMany({ data: feed });
    })
  ).catch((error) => {
    console.error('Erorr seeding feeds');
    console.error(error);
  });

  await Promise.all(
    quotes.map((quote) => {
      return prisma.quotes.createMany({ data: quote });
    })
  ).catch((error) => {
    console.error('Erorr seeding quotes');
    console.error(error);
  });
})();
