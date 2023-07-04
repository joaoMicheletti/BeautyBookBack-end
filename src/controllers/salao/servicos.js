const connect = require('../../database/connection');

module.exports = {
    // função responsável por cadastrar um serviço 
    async Registrar(request, response){
        const {cpf_salao, servico, preco} = request.body;
        const Data = {cpf_salao, servico, preco};

        const res = await connect('servicos').insert(Data);

        return response.json(res);
    },
    //função responsável por listar os serviços;
    async Listar(request, response){
        const {cpf_salao} = request.body;
        const Lista = await connect('servicos').where('cpf_salao', cpf_salao).select('*');
        return response.json(Lista);
    },
    // função responsável por editar um seviços;
    async EditarServicos(request, response){
        const {cpf_salao, servico, preco} = request.body;
        await connect('servicos').where('cpf_salao', cpf_salao).where('servico', servico).update('preco', preco);
        return response.json('Editado;')
    },
    //função responsável por deletar um serviço;
    async Delete(request, response){
        const {cpf_salao, servico, preco} = request.body;
        const Lista = await connect('servicos').where('cpf_salao', cpf_salao).where('servico', servico)
        .where('preco', preco).delete();
        return response.json(Lista);
    },
};