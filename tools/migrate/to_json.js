const fs = require('fs');

const FILE = 'legacy_users.json';

const { parsePlanetFeedList } = require('./feed');

(async () => {
  const planetUsers = await parsePlanetFeedList();

  try {
    fs.writeFileSync(`${FILE}`, JSON.stringify(planetUsers));
    console.log(
      `Processed ${planetUsers.length} records. Legacy users were successfully written to file: ${FILE}.`
    );
  } catch (err) {
    console.error(err);
  }
})();
