const connect = require('../../database/connection');
 module.exports = {
    //função para cadastra funcionarios//
    /* antes de cadastrar um funcionario é verificado se o plano do salão permite cadastrar fuincionario
    caso permita garantir que não ultrapasse o limite concedido pelo plano contratado */
    async RegistrarFuncionario(request, response){

        const {cpf_salao, nome_completo, cpf_funcionario, senha} = request.body;
        const Data = {
            cpf_salao,
            cpf_funcionario,
            nome_completo,
            senha
        };
        const info = await connect('salao').where('cpf_salao', cpf_salao).select('*');
          

        if(info[0].plano === 'Individual'){
            return response.json('Desculpe, Seu plano não permite cadastrar funcionários.');

        } else if(info[0].plano === '1X'){
            
            if(info[0].quantidade_funcionarios < info[0].limite_funcionarios){
                console.log(info[0].quantidade_funcionarios);
               const carlinhos = await connect('funcionarios').insert(Data);
               await connect('salao').where('cpf_salao', cpf_salao).update('quantidade_funcionarios', 1);
               return response.json(carlinhos);
                                
            } else {
                return response.json('Desculpe, você já excedeu o limite de funcionários cadastrados...');
            };
        } else if (info[0].plano === "4X" ){
            var lista = await connect('salao').where('cpf_salao', cpf_salao).select('quantidade_funcionarios');
            
            if(lista[0].quantidade_funcionarios < info[0].limite_funcionarios){
                await connect('funcionarios').insert(Data);
                var quant_funcio =  lista[0].quantidade_funcionarios;
                await connect('salao').where('cpf_salao', cpf_salao).update('quantidade_funcionarios', quant_funcio + 1 );

            } else {
                return response.json('Desculpe, você já excedeu o limite de funcionários cadastrados...');                
            } 
        };
        //const Data = {cpf_salao, nome_completo, cpf_funcionario, senha};
        //const lista = await connect('funcionarios').insert(Data);
        return response.json(info);
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