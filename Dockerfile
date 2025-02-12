# Usamos la imagen oficial de MySQL
FROM mysql:8.0

# Establecemos las variables de entorno necesarias para MySQL
ENV MYSQL_ROOT_PASSWORD=rootpassword
ENV MYSQL_DATABASE=my_database
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=userpassword

# Exponemos el puerto 3306 para la conexión a MySQL
EXPOSE 3306