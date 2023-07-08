const connect = require('../../database/connection');
module.exports = {
    //função para salvar a img no diretorio publico;
    async AdicionarImagem(request, response){
        const logo_salao = request.file;
        return response.json(logo_salao); // nao esquecer de auterar para retornar para o front o filename do arquivo
    },
    //salvando o nome da img no banco de dados junto ao seu salão 
    async LogoSalao(request, response){
        const {logo_salao, cpf_salao} = request.body;
        const list = await connect('salao').where('cpf_salao', cpf_salao)
        .update('logo_salao', logo_salao);
        return response.json(list);
    },
    // funçao para definir o tempo entre um agendamento e outro ;
    async IntervaloAgendamento(request, response){
        const {cpf_salao, intervalo_entre_agendamentos} = request.body;
        await connect('salao').where('cpf_salao', cpf_salao)
        .update('intervalo_entre_agendamentos', intervalo_entre_agendamentos);
        return response.json('Intervalo definido!');        
    },
    //função que define no banco de dados "no perfil do salão " que o usuário nao pode agendar em cima da hora;
    async EmCimaDaHora(request, response){
        const {cpf_salao, agendamento_apos_hora_atual} = request.body;
        await connect('salao').where('cpf_salao', cpf_salao)
        .update('agendamento_apos_hora_atual', agendamento_apos_hora_atual);
        return response.json('Definido!');
    },
    //função que permite que o usuário marque um agendamento até xxx dias apartir da data atual.
    async AgendamentoAte(request, response){
        const {cpf_salao, permitir_agendamento_ate} = request.body;
        await connect('salao').where('cpf_salao', cpf_salao)
        .update('permitir_agendamento_ate', permitir_agendamento_ate);
        return response.json('Definido!');
    },
    //editar senha salão;
    async SenhaSalao(request, response){
        const {cpf_salao, senha} = request.body;
        const list = await connect('salao').where('cpf_salao', cpf_salao)
        .update('senha', senha);
        return response.json('Atualizado...');
    },
    // editar cadstro salão;
    async EditarSalao(request, response){
        const {
            cpf_salao,
            nome_salao,
            endereco,
            email
        } = request.body;

        await connect('salao').where('cpf_salao', cpf_salao)
        .update('nome_salao', nome_salao)
        .update('endereco', endereco)
        .update('email', email);
        return response.json('Atualizado!.');

    },
    // editar senha funcionário;
    async SenhaFuncionario(request, response){
        const {cpf_salao, cpf_funcionario, senha} = request.body;
        const list = await connect('funcionarios').where('cpf_salao', cpf_salao).where('cpf_funcionario', cpf_funcionario)
        .update('senha', senha);
        return response.json(list);
    },

}