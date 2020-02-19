const express = require('express');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');

const server = express();
server.use(express.urlencoded({ extended: true }));

server.use(express.static('public'));

const Pool = require('pg').Pool
const db = new Pool({
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'doe'
});


nunjucks.configure('./', {
  express: server,
  noCache: true
});



server.get('/', (req, res) => {
  
  db.query(`SELECT * FROM donors`, (err, donorsFound)=> {
    if (err) return res.send('Erro no banco de dados.');

    const donors = donorsFound.rows;
    res.render('index.html', { donors });
  });
});

server.post('/', (req, res) => {
  const name = req.body.name
  const email = req.body.email
  const blood = req.body.blood

  if (name == '' || email == '' || blood == '') {
    return res.send('Todos os campos são obrigatórios.');
  }

  const query = `
  INSERT INTO donors ("name", "email", "blood")
  VALUES ($1, $2, $3)`

  const values = [name, email, blood]

  db.query(query, values, (err) =>{
    if (err) return res.send('Erro no banco de dados.');

    return res.redirect('/');
  });
});

server.listen('3000', () => {
  console.log('Servidor iniciado e rodando na porta 3000.');
});
