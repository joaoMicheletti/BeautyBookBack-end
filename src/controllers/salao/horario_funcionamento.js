const connect  = require('../../database/connection')

module.exports = {
    //cadastrar horario de funcionamento;
    async HorarioFuncionamento(request, response){
       const {
            cpf_salao,
            dia,
            inicio_trabalhos,
            fim_trabalhos
       } = request.body;

       const Data = {
        cpf_salao,
        dia,
        inicio_trabalhos,
        fim_trabalhos
        };
        await connect('horarios').insert(Data);

       console.log(Data);
       return response.json(Data);
    },
    //listar horários cadastrado
    async Listar(request, response){
        const Lista = await connect('horarios').select('*');
        return response.json(Lista);
    },
}
