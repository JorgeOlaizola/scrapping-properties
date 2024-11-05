const sendEmail = require('./email_service');
const scrapeZonaProp = require('./scrapers/zonaprop');

const scrapProperties = async () => {
  const results = await scrapeZonaProp();
  await sendEmail(results);
};

scrapProperties();
