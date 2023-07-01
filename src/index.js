const express = require('express');
const routes = require('./routes');
const cors = require('cors');

const app = express();

app.use(cors()); // configurar as entidades que podem fazer requiest;
app.use(express.json());
app.use(routes); // nossas rottas do arquivo routes.js;

app.listen(1998);
console.log('BeautyBook : Developed By <Vm Software/>');