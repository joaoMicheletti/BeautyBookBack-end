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

       return response.json(Data);
    },
    //editaar Horario de funcionamento;
    async EditarHorario(request, response){
        const {cpf_salao, dia, inicio_trabalhos, fim_trabalhos} = request.body;
        const ddd = await connect('horarios')
        .where('cpf_salao', cpf_salao).where('dia', dia)
        .update('inicio_trabalhos', inicio_trabalhos)
        .update('fim_trabalhos', fim_trabalhos);
        return response.json(ddd);
    },
    //DEletar horário de funcionamento;
    async DeletarHorario(request, response){
        const {id} = request.body;
        var resp = await connect('horarios').where('id', id).delete();
        return response.json(resp);
    },
    //listar horários cadastrado
    async Listar(request, response){
        const {cpf_salao} = request.body;
        const Lista = await connect('horarios').where('cpf_salao', cpf_salao).select('*');
        return response.json(Lista);    
    },
}
