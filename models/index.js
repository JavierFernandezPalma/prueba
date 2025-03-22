const { Sequelize, DataTypes } = require('sequelize');

// Conexión a la base de datos MySQL en Docker
const sequelize = new Sequelize('saludo_db', 'root', 'rootpassword', {
  host: 'localhost',  // Asegúrate de que esto esté apuntando a tu contenedor MySQL
  dialect: 'mysql',
  port: 3306
});

// Definir el modelo 'Saludo'
const Saludo = sequelize.define('Saludo', {
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'saludo',
  timestamps: false  // Si la tabla no tiene createdAt/updatedAt
});

module.exports = { sequelize, Saludo };
