/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('agenda', function(table){
        //caso sejá referente à agenda do salão o cpf_salao estara preenchido, vice e verça.
        table.increments();
        table.int('cpf_salao');
        table.int('cpf_funcionario');
        table.string('nome_completo');
        table.int('dia').notNullable();
        table.int('mes').notNullable();
        table.int('ano').notNullable();
        table.float('hora').notNullable();
        table.string('servico').notNullable();
        table.float('preco').notNullable();
        table.float('hora_termino');
        table.string('nome_cliente').notNullable();
        table.int('contato_cliente').notNullable();
        table.string('obs').notNullable();
        table.string('percente50');
        table.string('status_servico').notNullable();

    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('agenda');
  
};
