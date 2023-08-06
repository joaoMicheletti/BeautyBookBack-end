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
        const {id, preco} = request.body;
        await connect('servicos').where('id', id).update('preco', preco);
        return response.json('Editado;');
    },
    //função responsável por deletar um serviço;
    async Delete(request, response){
        const {id} = request.body;
        console.log(id);
        const Lista = await connect('servicos').where('id', id).delete();
        return response.json(Lista);
    },
};