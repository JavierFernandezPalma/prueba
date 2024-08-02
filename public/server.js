const express = require('express'); // Importar el módulo Express
const multer = require('multer'); // Importar el módulo Multer para manejar la carga de archivos
const cors = require('cors'); // Importar el módulo CORS para habilitar solicitudes desde otros dominios
const fs = require('fs'); // Importar el módulo fs para manejar operaciones del sistema de archivos
const path = require('path'); // Importar el módulo Path para trabajar con rutas de archivos y directorios
const libxmljs = require('libxmljs2');

const app = express(); // Crear una aplicación Express
const PORT = 3000; // Definir el puerto en el que el servidor escuchará

// Configurar multer para almacenar archivos en la carpeta "upload"
const storage = multer.diskStorage({
    destination: function (req, file, cb) { // Función para definir la carpeta de destino
        cb(null, 'upload/'); // Guardar archivos en la carpeta "upload"
    },
    filename: function (req, file, cb) { // Función para definir el nombre del archivo
        cb(null, file.originalname); // Usar el nombre original del archivo
    }
});

const upload = multer({ storage: storage }); // Crear una instancia de multer con la configuración de almacenamiento

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.use(cors()); // Habilitar CORS para permitir solicitudes desde otros dominios
// Middleware para servir archivos estáticos
app.use(express.json()); // Middleware para parsear JSON
app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos desde la carpeta "public"

// Ruta para la carga de archivos
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) { // Comprobar si no se ha subido ningún archivo
        return res.status(400).send('No se ha subido ningún archivo.'); // Enviar una respuesta de error si no hay archivo
    }

    const fileName = req.file.originalname; // Obtener el nombre original del archivo subido
    const filePath = path.join(__dirname, 'data', 'files.json'); // Definir la ruta del archivo JSON donde se guardarán los nombres de los archivos subidos

    // Leer el archivo JSON existente
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) { // Manejar errores de lectura del archivo
            console.error('Error leyendo el archivo:', err);
            return res.status(500).send('Error interno del servidor'); // Enviar una respuesta de error si hay un problema con la lectura del archivo
        }

        let files = { xmlFiles: [] }; // Inicializar un objeto para almacenar los nombres de los archivos
        if (data) { // Si el archivo tiene contenido, parsear el JSON
            try {
                files = JSON.parse(data); // Parsear el contenido JSON del archivo

            } catch (jsonErr) { // Manejar errores de parseo del JSON
                console.error('Error parseando JSON:', jsonErr);
                return res.status(500).send('Error interno del servidor'); // Enviar una respuesta de error si hay un problema con el parseo del JSON
            }
        }

        // Verificar si el archivo ya existe en el array
        const fileIndex = files.xmlFiles.indexOf(fileName);
        if (fileIndex === -1) { // Si el archivo no existe, agregarlo
            // Añadir el nuevo nombre de archivo al array xmlFiles
            files.xmlFiles.push(fileName);
        } else { // Si el archivo existe, actualizar su entrada (opcional, dependiendo de los requisitos)
            files.xmlFiles[fileIndex] = fileName; // No es realmente necesario en este caso, ya que estamos sobrescribiendo con el mismo nombre
        }

        // Escribir el array actualizado de vuelta al archivo JSON
        fs.writeFile(filePath, JSON.stringify(files, null, 2), (writeErr) => {
            if (writeErr) { // Manejar errores de escritura del archivo
                console.error('Error escribiendo el archivo:', writeErr);
                return res.status(500).send('Error interno del servidor'); // Enviar una respuesta de error si hay un problema con la escritura del archivo
            }
            console.log('Archivo subido y registrado exitosamente'); // Imprimir un mensaje de éxito en la consola
            res.status(200).send('Archivo subido y registrado exitosamente.'); // Enviar una respuesta de éxito si el archivo se ha subido y registrado correctamente
        });
    });

});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
