var express = require('express');
var path = require('path');
var app = express();

var port = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, '../client')));







app.listen(port);

console.log('Listening on port:', port);