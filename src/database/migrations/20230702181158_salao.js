/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('salao', function(table){

        table.increments();
        table.string('logo_salao'); //ok
        table.string('nome_salao').notNullable(); // ok
        table.int('cpf_salao').notNullable(); // ok
        table.string('endereco').notNullable(); // ok
        table.int('cep').notNullable(); //ok
        table.string('email').notNullable(); //ok
        table.string('senha').notNullable(); //ok
        table.string('plano');
        table.int('assinatura');
        table.date('data_inicio_plano');
        table.date('data_vencimento_plano');
        table.int('quantidade_funcionarios');
        table.string('assinatura_status');
        table.string('data_cadastro').notNullable(); //ok
        table.int('dias_free').notNullable(); //ok
        table.int('codigo_indicacao').notNullable(); //ok
        table.int('intervalo_entre_agendamentos'); //ok
        table.int('agendamento_apos_hora_atual'); //ok
        table.int('permitir_agendamento_ate'); //ok

    });
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('salao');
  
};
