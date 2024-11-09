const sendPropertiesEmail = require('./utils/send_properties_email.util');
const scrapeZonaProp = require('./scrapers/zonaprop');

const scrapProperties = async () => {
  const results = await scrapeZonaProp();
  await sendPropertiesEmail(results);
};

scrapProperties();
