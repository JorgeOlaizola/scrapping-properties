const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuración de AWS SES
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES();

const enviarCorreo = async (results) => {
  // Leer la plantilla HTML
  const templatePath = path.join(__dirname, '/templates/props.html');
  let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

  // Generar el contenido dinámico de los resultados
  const resultsHtml = results
    .map(
      (r) =>
        `<li><strong>Precio: ${r.price}</strong> - Expensas: ${r.expenses} - Dirección: ${r.address}<br><a href="${r.link}">Ir al anuncio</a></li>`
    )
    .join('');

  // Reemplazar el placeholder {{results}} en la plantilla HTML
  htmlTemplate = htmlTemplate.replace('{{results}}', resultsHtml);

  // Configurar los parámetros para el envío del correo
  const params = {
    Source: process.env.EMAIL_USER, // Dirección de correo verificada en SES
    Destination: {
      ToAddresses: [process.env.EMAIL_RECEIVER],
    },
    Message: {
      Subject: {
        Data: 'Resultados de Búsqueda de Alquiler',
      },
      Body: {
        Html: {
          Data: htmlTemplate,
        },
      },
    },
  };

  try {
    const resultado = await ses.sendEmail(params).promise();
    console.log('Correo enviado:', resultado);
    return resultado;
  } catch (error) {
    console.error('Error enviando correo:', error);
    throw error;
  }
};

module.exports = enviarCorreo;
