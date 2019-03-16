const express = require('express');
const router = express.Router();
const path = require('path')
const fs = require('fs');
const parseHeader = require('../js/parseHeader');

router.get('/', function(req, res, next) {
    res.sendFile(path.resolve('public/html/upload.html'), {title: "upload"});
});

router.post('/', function(req, res, next){
    let attachedHeader = req.headers['content-disposition'];
    let fileName = parseHeader(attachedHeader);
    const file = fs.createWriteStream(fileName);
    req.on('data', (chunk) => file.write(chunk) );
    req.on('end', () => {
        // res.send('OK');
        res.send('File uploaded with name ' + fileName);

        file.end();
    });

});
module.exports = router;