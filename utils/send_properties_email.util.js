const config = require('../config/index');
const fs = require('fs');
const path = require('path');
const sendEmail = require('../services/email_service');

const sendPropertiesEmail = async (results) => {
  const templatePath = path.join(__dirname, '../templates/props.html');
  let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

  const resultsHtml = results
    .map(
      (r) =>
        `<li><strong>Precio: ${r.price}</strong> - Expensas: ${r.expenses} - Dirección: ${r.address}<br><a href="${r.link}">Ir al anuncio</a></li>`
    )
    .join('');

  htmlTemplate = htmlTemplate.replace('{{results}}', resultsHtml);

  await sendEmail({
    subject: 'Resultados de búsqueda de alquiler',
    template: htmlTemplate,
    receivers: [config.emailReceiver],
  });
};

module.exports = sendPropertiesEmail;
