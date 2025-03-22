const express = require('express');
const { sequelize, Saludo } = require('./models');
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');

// Ruta para consultar la base de datos y mostrar la descripción
app.get('/', async (req, res) => {
  try {
    const saludo = await Saludo.findOne();  // Obtiene el primer saludo
    if (saludo) {
      res.render('index', { descripcion: saludo.descripcion });
    } else {
      res.send('No se encontró ningún saludo en la base de datos.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al consultar la base de datos.');
  }
});

// Conectar a la base de datos y luego iniciar el servidor
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('No se pudo conectar a la base de datos:', error);
  });
