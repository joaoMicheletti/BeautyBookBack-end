const connect = require('../../database/connection');
 module.exports = {
    //função para cadastra funcionarios//
    async RegistrarFuncionario(request, response){
        const {cpf_salao, nome_completo, cpf_funcionario, senha} = request.body;
        const Data = {cpf_salao, nome_completo, cpf_funcionario, senha};
        const lista = await connect('funcionarios').insert(Data);
        return response.json(lista);
    },
    //função para listar os funcionarios de um salão;
    async ListarFuncionarios(request, response){
        const {cpf_salao} = request.body;
        Lista = await connect('funcionarios').where('cpf_salao', cpf_salao).select('*');
        return response.json(Lista);
    },
    //função para deletar um funcionario;
    async DeletarFuncionario(request, response){
        const {cpf_salao, cpf_funcionario} = request.body;
        const lista = await connect('funcionarios').where('cpf_salao', cpf_salao)
        .where('cpf_funcionario', cpf_funcionario).delete();
        return response.json(lista);
    },
 }