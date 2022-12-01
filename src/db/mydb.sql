SHOW DATABASES;
CREATE DATABASE ecommerce;
CREATE TABLE mensajes (id int PRIMARY KEY auto_increment, nombre varchar(255) NOT NULL, email varchar(255) NOT NULL, message varchar(255) NOT NULL, date varchar(255));
SHOW TABLES;
INSERT INTO mensajes (id, nombre, email, message, date) values(1, 'Victoria', 'victoria@gmail.com', 'Hola!', '30/11/2022, 08:31:21');
SELECT * FROM mensajes;