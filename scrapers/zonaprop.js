const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function scrapeZonaProp() {
  const url =
    'https://www.zonaprop.com.ar/departamentos-alquiler-desde-2-hasta-3-ambientes-700000-2000000-pesos-q-caballito.html';

  // Configuración de opciones para ejecutar en modo headless
  let options = new chrome.Options();
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('window-size=1920,1080');

  const properties = [];

  let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

  try {
    await driver.get(url);
    await driver.wait(until.elementsLocated(By.css('[data-qa="posting PROPERTY"]')), 20000);

    let id = 1;

    const propertiesElements = await driver.findElements(By.css('[data-qa="posting PROPERTY"]'));

    for (let property of propertiesElements.slice(0, 10)) {
      const new_property = {};

      try {
        const link = await property.getAttribute('data-to-posting');
        new_property.link = 'https://www.zonaprop.com.ar' + link;
      } catch (e) {
        console.log(e);
      }

      try {
        const priceElement = await property.findElement(By.css('[data-qa="POSTING_CARD_PRICE"]'));
        const price = await priceElement.getText();
        new_property.price = price;
      } catch (e) {
        console.log('Precio no encontrado para esta propiedad');
      }

      try {
        const expensesElement = await property.findElement(By.css('[data-qa="expensas"]'));
        const expenses = await expensesElement.getText();
        new_property.expenses = expenses;
      } catch (e) {
        console.log('Expensas no encontradas para esta propiedad');
      }

      try {
        const locationElement = await property.findElement(By.css('.postingAddress'));
        const neighborhoodElement = await property.findElement(
          By.css('[data-qa="POSTING_CARD_LOCATION"')
        );
        const address = await locationElement.getText();
        const neighborhood = await neighborhoodElement.getText();
        new_property.address = address;
        new_property.neighborhood = neighborhood;
      } catch (e) {
        console.log('Dirección no encontrada para esta propiedad');
      }

      try {
        const featuresElement = await property.findElement(
          By.css('[data-qa="POSTING_CARD_FEATURES"]')
        );
        const features = await featuresElement.getText();
        new_property.features = features;
      } catch (e) {
        console.log('Features no encontradas para esta propiedad');
      }

      try {
        const descriptionElement = await property.findElement(
          By.css('[data-qa="POSTING_CARD_FEATURES"]')
        );
        const description = await descriptionElement.getText();
        if (description !== new_property.features) {
          new_property.description = description;
        }
      } catch (e) {
        console.log('Descripción no encontrada para esta propiedad');
      }

      id++;
      properties.push(new_property);
      // Separador entre propiedades
      console.log('---------------------------');
    }
  } finally {
    await driver.quit();
  }

  return properties;
}

module.exports = scrapeZonaProp;
