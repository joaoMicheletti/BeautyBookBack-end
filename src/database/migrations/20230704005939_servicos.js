/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('servicos', function(table){
        table.increments();
        table.int('cpf_salao').notNullable();
        table.string('servico').notNullable();
        table.int('tempo');
        table.float('preco').notNullable();
    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('servicos');
  
};
