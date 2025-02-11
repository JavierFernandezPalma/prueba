const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importar el módulo CORS para habilitar solicitudes desde otros dominios
const xsdValidator = require('xsd-schema-validator');
const libxmljs = require('libxmljs2'); // Importa la librería libxmljs2 para manipulación y validación de documentos XML.
const fs = require('fs');
const { DOMParser } = require('xmldom');
const path = require('path'); // Para resolver rutas absolutas
const app = express();
const PORT = 3000;

// Lista de dominios permitidos
const allowedOrigins = [
    'https://xml-comparer-tool.vercel.app',
    'https://xml-comparer-tool-prueba.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3002',
    'http://127.0.0.1:3001'
];

// Configuración de CORS
const corsOptions = {
    origin: (origin, callback) => {
        // console.log(`Origen recibido: ${origin}`); // Para depuración
        // Verifica si el origen de la solicitud está en la lista de dominios permitidos
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            // Permite el origen si está en la lista o si no se proporciona un origen (por ejemplo, solicitudes locales)
            callback(null, true);
        } else {
            // Rechaza el origen si no está en la lista
            callback(new Error('No autorizado por CORS'));
        }
    },
    methods: ['GET', 'POST', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type'] // Encabezados permitidos en las solicitudes
};

// Habilitar CORS para permitir solicitudes desde otros dominios
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.json()); // Middleware para JSON
app.use(bodyParser.text({ type: 'application/xml' })); // Middleware para XML
// Manejador de errores global
app.use((err, req, res, next) => {
    console.error('Error en el servidor:', err);
    res.status(500).json({ message: 'Error interno del servidor. Intenta nuevamente más tarde.' });
});

app.post('/validate', (req, res) => {
    const { xml, xsd } = req.body; // Extrae XML y XSD del cuerpo

    // Limpia y prepara el XML y el XSD
    const xmlData = xml.trim().replace(/\s+/g, ' ');
    const xsdContent = xsd.trim().replace(/\s+/g, ' ');

    // Primero, verifica si el XSD es válido
    let xsdDoc;
    try {
        xsdDoc = libxmljs.parseXml(xsdContent);
        // console.log(xsdDoc);
    } catch (err) {
        // XSD inválido
        // console.error('Error al parsear el XSD:', err);
        return res.status(400).json({ isValid: false, message: 'El esquema XSD proporcionado es inválido.', validationErrors: err.message });
    }

    // Validación asincrónica del XML contra el XSD
    try {

        // Parse XML
        const xmlDoc = libxmljs.parseXml(xmlData);
        // Validar XML contra XSD
        const isValid = xmlDoc.validate(xsdDoc);

        // Verificar si la validación fue exitosa
        if (isValid) {
            console.log('Validación Ok.' + isValid.message);
            res.status(200).json({ valid: isValid, message: isValid });
        } else {
            console.error('Error de validación.' + isValid.message);
            return res.status(200).json({
                valid: isValid,
                message: isValid.validationErrors || 'No se proporcionaron detalles del error.',
                details: isValid // Agrega detalles adicionales si es necesario
            });
        }
    } catch (error) {
        console.error('Error al intentar validar.'); 
        res.status(400).json({
            valid: false,
            message: error.message || 'Ocurrió un error desconocido durante la validación.',
        });
    }
});

app.post('/validate1', async (req, res) => {
    const { xml, xsd } = req.body; // Extrae XML y XSD del cuerpo

    // Limpia y prepara el XML y el XSD
    const xmlData = xml.trim().replace(/\s+/g, ' ');
    const xsdContent = xsd.trim().replace(/\s+/g, ' ');

    // Escribir el esquema en un archivo temporal
    const xsdFilePath = path.join(__dirname, 'schema.xsd');
    try {
        fs.writeFileSync(xsdFilePath, xsdContent);
    } catch (fileWriteError) {
        console.error('Error al escribir el archivo XSD:', fileWriteError);
        return res.status(500).json({ valid: false, message: 'Error al escribir el archivo XSD.' });
    }

    // Validación asincrónica del XML contra el XSD
    try {
        // Validación del XML usando la promesa
        const result = await xsdValidator.validateXML(xmlData, xsdFilePath);
        
        if (result.valid) {
            console.log('Validació Ok.');
            res.status(200).json({ valid: true, message: result.result });
        } else {
            console.error('Error de validación.');
            return res.status(400).json({
                valid: false,
                message: result.messages,
                details: result // Agrega detalles adicionales si es necesario
            });
        }
      } catch (error) {
        console.error('Error al intentar validar.');
        res.status(400).json({
            valid: false,
            message: error.message,
        });
      }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});