const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
let HandleUpload = require("../js/handleUpload");
let SaveFile = require("../js/saveFile");

router.get('/', function(req, res, next) {
    res.sendFile(path.resolve('public/html/upload.html'), {title: "upload"});
});

router.post('/', function(req, res, next){
    const handleUpload = new HandleUpload(req);
    let fileName = handleUpload.getFileName();
    // fileName = 'uploaded/' + fileName;
    const saveFile = new SaveFile(req, fileName);
    //Working - Start
    //req.on('data', (e) => file.write(e));
    //req.on('end', () => {
        //file.end();
      //  res.send('We done');
    // })
    //Working -- End
    //TODO: Have some async callback/promise so we don't have to have this in the post method
    req.on('end', (e) => {
        res.send('File uploaded with name ' + fileName);
        saveFile._uploadFinished(e);
     });

});
module.exports = router;