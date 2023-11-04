const connect = require('../../database/connection');
module.exports = {
    //função para cadastra funcionarios//
    /* antes de cadastrar um funcionario é verificado se o plano do salão permite cadastrar fuincionario
    caso permita garantir que não ultrapasse o limite permitido pelo plano contratado */
    async RegistrarFuncionario(request, response){
        const {cpf_salao, nome_completo, cpf_funcionario, senha} = request.body;
        const Data = {
            cpf_salao,
            cpf_funcionario,
            nome_completo,
            senha
        };
        const info = await connect('salao').where('cpf_salao', cpf_salao).select('*');
        console.log(info);
        /*O salão que estiver com a coluna "assinatura: null", 
        representa que ele é novo na plataforma e não tem um plano assinado,
        estando nesta condição ele não pode cadastrar funcionários. 
        */
        //if(info[0].assinatura === null){
          //  return response.json('Contrate um plano para registrar funcionários.');
        // o plano Individual não permite cadastrar funcionários.
        //} else 
        if(info[0].plano === 'plano individual'){
            return response.json('Desculpe, Seu plano não permite cadastrar funcionários.');
        } else if (info[0].plano === "personalizado" ){ // o plano plano personalizado o cliente que define a quantidade de funcionários.
            var lista = await connect('salao').where('cpf_salao', cpf_salao).select('quantidade_funcionarios');
            
            if(lista[0].quantidade_funcionarios < info[0].limite_funcionarios){
                await connect('funcionarios').insert(Data);
                var quant_funcio =  lista[0].quantidade_funcionarios;
                await connect('salao').where('cpf_salao', cpf_salao).update('quantidade_funcionarios', quant_funcio + 1 );
            } else {
                return response.json('Desculpe, você já excedeu o limite de funcionários cadastrados...');                
            } 
        };
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
        //atualizando na tabela salaõa a quantidade de funcionarios apos deletar um;
        if(lista > 0){ // se for mair deletou o fucionário;
            const quantidade_funcionarios = await connect('salao').where('cpf_salao', cpf_salao).select('quantidade_funcionarios');
            await connect('salao').where('cpf_salao', cpf_salao).update('quantidade_funcionarios', quantidade_funcionarios[0].quantidade_funcionarios - 1);
        };
        //apagar os vestigios do funcionário da tabela agenda;
        var deletarDadosFuncionarioTableAgenda = await connect('agenda')
        .where('cpf_funcionario', cpf_funcionario).delete('*');
        return response.json(lista);
    },
}