const express = require('express');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

client.connect();

const server = express();
server.use(express.urlencoded({ extended: true }));

server.use(express.static('public'));

// const Pool = require('pg').Pool;
// const db = new Pool({
//   user: 'qedjzivuftafds',
//   password: 'f88d796c766fbc4cb96ecdb50817881f8b43115d123b2794c09f42bfad6b2ac1',
//   host:
//     'postgres://qedjzivuftafds:f88d796c766fbc4cb96ecdb50817881f8b43115d123b2794c09f42bfad6b2ac1@ec2-3-234-109-123.compute-1.amazonaws.com:5432/ddk4cv39m71m4q',
//   port: 5432,
//   database: 'ddk4cv39m71m4q',
//   ssl: { rejectUnauthorized: false }
// });

// db.connect();

nunjucks.configure('./', {
  express: server,
  noCache: true
});

server.get('/', (req, res) => {
  client.query(`SELECT * FROM donors`, (err, donorsFound) => {
    if (err) return res.send('Erro no banco de dados.');

    const donors = donorsFound.rows;
    res.render('index.html', { donors });
  });
});

server.post('/', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const blood = req.body.blood;

  if (name == '' || email == '' || blood == '') {
    return res.send('Todos os campos são obrigatórios.');
  }

  const query = `
  INSERT INTO donors ("name", "email", "blood")
  VALUES ($1, $2, $3)`;

  const values = [name, email, blood];

  client.query(query, values, err => {
    if (err) return res.send('Erro no banco de dados.');

    return res.redirect('/');
  });
});

server.listen('3000', () => {
  console.log('Servidor iniciado e rodando na porta 3000.');
});
