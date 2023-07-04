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
    //editaar Horario de funcionamento;
    async EditarHorario(request, response){
        const {cpf_salao, dia, inicio_trabalhos, fim_trabalhos} = request.body;
        
        const ddd = await connect('horarios')
        .where('cpf_salao', cpf_salao).where('dia', dia)
        .update('inicio_trabalhos', inicio_trabalhos)
        .update('fim_trabalhos', fim_trabalhos);
        return response.json(ddd);
    },
    //listar horários cadastrado
    async Listar(request, response){
        const Lista = await connect('horarios').select('*');
        return response.json(Lista);
    },
}
