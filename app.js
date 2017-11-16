const express = require('express');
const server = express();
const path = require('path');

server.use('/public', express.static('public'));
server.use('/HTML', express.static('HTML'));

server.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/html/listskeleton.html'));
});

server.listen(8000, function () {
    console.log('Example app listening on port 8000!');
});

//$('#btnCallDibs').bootstrapBtn('loading'); checkReservation();
