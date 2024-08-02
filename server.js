const express = require('express');
const cors = require('cors');
const multer = require('multer');
const libxmljs = require('libxmljs2');
const path = require('path');
require('dotenv').config(); // Cargar variables de entorno desde .env

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.'))); // Servir archivos estáticos desde la carpeta public

app.post('/validate', (req, res) => {
  const { xml, xsd } = req.body;
  
  try {
    let xsdDoc;
    try {
      xsdDoc = libxmljs.parseXml(xsd);
    } catch (err) {
      return res.status(400).json({ error: 'El esquema XSD proporcionado es inválido.', details: err.message });
    }

    const xmlDoc = libxmljs.parseXml(xml);
    const isValid = xmlDoc.validate(xsdDoc);

    if (isValid) {
      res.status(200).json({ isValid, message: 'XML válido respecto al XSD.' });
    } else {
      const validationErrors = xmlDoc.validationErrors.map(err => ({
        message: err.message,
        line: err.line,
        column: err.column
      }));
      res.status(400).json({
        isValid: false,
        message: 'El XML no es válido respecto al XSD.',
        validationErrors: validationErrors
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Error interno al validar XML contra XSD.',
      details: error.message,
      stack: error.stack
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
