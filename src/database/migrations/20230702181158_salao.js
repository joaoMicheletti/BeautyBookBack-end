/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('salao', function(table){

        table.increments();
        table.string('logo_salao');
        table.string('nome_salao');
        table.int('cpf').notNullable();
        table.int('cep').notNullable();
        table.string('email').notNullable();
        table.string('senha').notNullable();
        table.string('plano');
        table.int('quantidade_funcionarios');
        table.date('data_vencimento');
        table.int('dias_free').default = 7;
        table.int('codigo_indicacao').notNullable();
        table.int('intervalo_entre_agendamaentos');
        table.int('agendamento_apos_hora_atual');
        table.int('permitir_agendamento_ate');








    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('salao');
  
};
