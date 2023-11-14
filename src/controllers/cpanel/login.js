const connect = require('../../database/connection');
const { use } = require('../../routes');
module.exports = {
    async Logar(request, response){
        const {user, pass} = request.body;
        var cUser = await connect('adm').where('user', user).select('user');
        if(cUser.length > 0){
            var cPass = await connect('adm').where('user', user).select('pass');
            if(cPass.length > 0){
                if(cPass[0].pass === pass){
                    return response.json({user, pass});
                } else{
                    return response.json('Erro no login');
                };                
            } else {
                return response.json('Erro no login');
            }
        } else {
            return response.json('Erro no login');
        }
    },
    //cadastro do adm  será via postman ou insomnia;
    async AdmCad(request, response){
        const {user, pass} = request.body;
        var conf = await connect('adm').where('user', user);
        if(conf.length > 0){
            return response.json("usuário ja cadastrado");
        } else if (conf.length === 0){
            var Data = {user, pass};
            var cad = await connect('adm').insert(Data);
            if(cad.length > 0){
                return response.json('sucesso');
            } else{
                return response.json("erro no processo");
            };
        };
    },
}