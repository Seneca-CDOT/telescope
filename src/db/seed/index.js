const { PrismaClient } = require('@prisma/client');
const feeds = require('./feeds.json');
const quotes = require('./quotes.json');

(function seedFeeds() {
  const prisma = new PrismaClient();

  Promise.all(
    feeds.map((feed) => {
      return prisma.feeds.upsert({
        where: {
          id: feed.id,
        },
        update: {},
        create: feed,
      });
    })
  )
    .then((records) => {
      console.log(`Seeded ${records.length} feeds`);
      return records.length;
    })
    .catch((error) => {
      console.error(error);
      console.error('Erorr seeding feeds\n\n');
    });

  Promise.all(
    quotes.map((quote) => {
      return prisma.quotes.upsert({
        where: { quote_id: quote.quote_id },
        update: {},
        create: quote,
      });
    })
  )
    .then((records) => {
      console.log(`Seeded ${records.length} quotes`);
      return records;
    })
    .catch((error) => {
      console.error(error);
      console.error('Erorr seeding quotes');
    });
})();
