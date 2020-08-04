const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var PORT = process.env.PORT || 5000;
const sql = require('mssql');
const conexaoStr = "Server=den1.mssql8.gear.host;Database=madamex;User Id=madamex;Password=Bo22w8Xa-!l8;";

//conexao com BD
sql.connect(conexaoStr)
   .then(conexao => global.conexao = conexao)
   .catch(erro => console.log(erro));

// configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
/////////////////////////////////
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PATCH, DELETE");
  next();
});
/////////////////////////////////

//definindo as rotas
const rota = express.Router();
rota.get('/', (requisicao, resposta) => resposta.json({ mensagem: 'Funcionando!'}));
app.use('/', rota);
	
//inicia servidor
app.listen(PORT);
console.log('API Funcionando!');

function execSQL(sql, resposta) {
	global.conexao.request()
		.query(sql)
		.then(resultado => resposta.json(resultado.recordset))
		.catch(erro => resposta.json(erro));
}


//GETTERS-----------------------------------------------------

rota.get('/Contas', (requisicao, resposta) =>{
execSQL('SELECT * FROM Conta', resposta);
})

rota.get('/Divas', (requisicao, resposta) =>{
execSQL('SELECT * FROM Diva', resposta);
})

rota.get('/Musicas', (requisicao, resposta) =>{
execSQL('SELECT * FROM Musica', resposta);
})

rota.get('/Generos', (requisicao, resposta) =>{
execSQL('SELECT * FROM Genero', resposta);
})

rota.get('/Perguntas', (requisicao, resposta) =>{
execSQL('SELECT * FROM Pergunta', resposta);
})






rota.get('/Contas/:emailConta?', (requisicao, resposta) =>
{
let filtro = '';
if (requisicao.params.emailConta)
filtro = " WHERE email = '" + requisicao.params.emailConta + "'";
execSQL('select * from Conta' + filtro, resposta);
});

//POSTS-------------------------------------------------------

rota.post('/Contas/:dados', (requisicao, resposta) =>
{
    console.log('Entrou moreh');
    var dados = requisicao.params.dados.toString();
    var array = dados.split("-");
    var nome = array[0];
    var email = array[1];
    var senha = array[2];
    var divaFav = array[3];
    console.log(nome + " " + email + " " + senha + " " + divaFav);

    execSQL(`insert into Conta values('${nome}','${email}','${senha}','${divaFav}')`, resposta);
    resposta.end(resposta.json({ mensagem: 'Incluído!'})); 
      
})


//PUTS---------------------------


rota.put('/Contas/:dados', (requisicao, resposta) =>
{
    console.log('Entrou moreh');
    var dados = requisicao.params.dados.toString();
    var array = dados.split("-");
    var nome = array[0];
    var email = array[1];
    var senha = array[2];
    var divaFav = array[3];
    console.log(nome + " " + email + " " + senha + " " + divaFav);

    execSQL(`update Conta set nome='${nome}', senha='${senha}', divaFav='${divaFav}' where email='${email}'`, resposta);
    resposta.end(resposta.json({ mensagem: 'Alterado!'})); 
      
})


