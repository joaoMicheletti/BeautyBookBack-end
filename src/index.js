const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors()); // configurar as entidades que podem fazer requiest;
app.use(express.json());
app.use(routes); // nossas rottas do arquivo routes.js;
//cirando uma rota para permitir que busque as imagens no diretório.
app.use('/image', express.static(path.resolve(__dirname, 'public')))

app.listen(1998);
console.log('BeautyBook : Developed By <Vm Software/>');