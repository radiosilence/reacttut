var fs = require('fs');

var express = require('express');
var app = express();

var comments = [
  {author: 'Steve Jobs', text: 'I am a ***HUGE CUNT***'},
  {author: 'Fucky Fuckface', text: 'Fuck you!'}
];

app.use('/', express.static(__dirname));
app.use(express.bodyParser());

app.get('/comments.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(comments));
});

app.post('/comments.json', function(req, res) {
  comments.push(req.body);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(comments));
});

app.listen(3000);
