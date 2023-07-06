/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('salao', function(table){

        table.increments();
        table.string('logo_salao'); 
        table.string('nome_salao'); // ok
        table.int('cpf_salao').notNullable(); // ok
        table.string('endereco').notNullable(); // ok
        table.int('cep').notNullable(); //ok
        table.string('email').notNullable(); //ok
        table.string('senha').notNullable(); //ok
        table.string('plano');
        table.int('quantidade_funcionarios');
        table.date('data_vencimento_plano');
        table.string('data_cadastro').notNullable(); //ok
        table.int('dias_free').default = 7;
        table.int('codigo_indicacao').notNullable(); //ok
        table.int('intervalo_entre_agendamentos');
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
