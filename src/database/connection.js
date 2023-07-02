const knex = require('knex'); // importando o knex 
const config = require('../../knexfile'); //  importando o arquivo de configuração do knex (knexfile.js);

const connect = knex(config.development); //definindo a conecção;

module.exports = connect;