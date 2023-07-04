/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('funcionarios', function(table){
        table.increments();
        table.int('cpf_salao').notNullable();
        table.string('nome_completo').notNullable();
        table.int('cpf_funcionario').notNullable();
        table.string('senha').notNullable();
    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('funcionarios');
  
};
