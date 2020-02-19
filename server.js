const express = require('express');
const nunjucks = require('nunjucks');

const server = express();

server.use(express.static('public'));

nunjucks.configure('./', {
  express: server
});

const donors = [
  {
    name: 'João Machado',
    blood: 'B-'
  },
  {
    name: 'Alexandre Martins',
    blood: 'A+'
  },
  {
    name: 'Luiz Paes',
    blood: 'AB-'
  },
  {
    name: 'Andy Oximenes',
    blood: 'A+'
  }
]


server.get('/', (req, res) => {
  res.render('index.html');
});

server.listen('3000', () => {
  console.log('Servidor iniciado e rodando na porta 3000.');
});