const express = require('express'); // Importar el módulo Express
const multer = require('multer'); // Importar el módulo Multer para manejar la carga de archivos
const cors = require('cors'); // Importar el módulo CORS para habilitar solicitudes desde otros dominios
const fs = require('fs'); // Importar el módulo fs para manejar operaciones del sistema de archivos
const path = require('path'); // Importar el módulo Path para trabajar con rutas de archivos y directorios
const libxmljs = require('libxmljs2');

const app = express(); // Crear una aplicación Express
const PORT = process.env.PORT || 3000; // Definir el puerto en el que el servidor escuchará

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`El servidor está corriendo en http://localhost:${PORT}`); // Imprimir un mensaje cuando el servidor esté listo
});
