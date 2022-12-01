//Servidor************
import express from "express"
import moment from "moment"
const aplicacion = express();

import { Server } from "socket.io"
import http from "http"
const server = http.createServer(aplicacion)
const io = new Server(server)
import { Contenedor } from "./contenedor/contenedorSQL.js"


import { options } from "./connections/options.js"
import knex from "knex"
const connectionMySql = knex(options.mysql)
const connectionSqlite3 = knex(options.sqlite3)

const port = 8080;
const publicRoot = './public';

//Lineas para usar json
aplicacion.use(express.json());
aplicacion.use(express.urlencoded({ extended: true }));

// const httpServer = new HttpServer(aplicacion);
// const io = new IOServer(httpServer);

//***** Hacemos la carpeta public visible
aplicacion.use(express.static(publicRoot));
//****************

const productos = new Contenedor(connectionMySql.mysql, 'productos');
const mensajes = new Contenedor(connectionSqlite3.sqlite3, 'mensajes');

//Endpoints***

aplicacion.get('/', (peticion, respuesta) => {
  respuesta.send('index.html', { root: publicRoot });
});

//***********


//Servidor************
server.listen(port, () => {
    console.log(`Servidor escuchando http://localhost:${port}`)
})
server.on('error', error => console.log(`Error: ${error}`));
//****************

// MySQL, Sqlite3
import { mysqlFunc, sqlite3Func } from "./connections/connections.js"

mysqlFunc()

sqlite3Func()

//Sockets************
io.on('connection', async (socket) => {
  console.log('Nuevo cliente conectado!');

  const listaProductos = await productos.getAll();
  socket.emit('nueva-conexion', listaProductos);

  socket.on("new-product", (data) => {
    productos.save(data);
    io.sockets.emit('producto', data);
  });

  //Para enviar todos los mensajes en la primera conexion
  const listaMensajes = await mensajes.getAll();
  socket.emit('messages', listaMensajes);

  //Evento para recibir nuevos mensajes
  socket.on('new-message', async data => {
    data.time = moment(new Date()).format('DD/MM/YYYY hh:mm:ss');
    await mensajes.save(data);
    const listaMensajes = await mensajes.getAll();
    io.sockets.emit('messages', listaMensajes);
  });
});
//****************