/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('horarios', function(table){
        table.increments();
        table.integer('cpf_salao').notNullable();
        table.string('dia').notNullable();
        table.float('inicio_trabalhos').notNullable();
        table.float('fim_trabalhos').notNullable();
    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('horarios');
  
};
