const express = require('express');
const router = express.Router();
const path = require('path');
let HandleUpload = require("../js/handleUpload");
let SaveFile = require("../js/saveFile");
let DB = require('../js/db');
let ExtractFileInfo = require('../js/extractFileInfo');
router.get('/', function(req, res, next) {
    res.sendFile(path.resolve('public/html/upload.html'), {title: "upload"});
});

/**
 *
 *  POST => localhost:3000/upload/
 *  Receive XMLHTTPRequest with file info.  on.('data') chunks are sent and written with fs.write
 */
router.post('/', function(req, res, next){
    const db = new DB();
    db._connect();

    const handleUpload = new HandleUpload(req);
    const fileName = handleUpload.getFileName();
    const saveFile = new SaveFile(req, fileName);

    //TODO: Have some async callback/promise so we don't have to have this in the post method
    req.on('end', (e) => {
        res.send('File uploaded with name ' + fileName);
        saveFile._uploadFinished(e);
        let fileHandle = saveFile._returnFileHandle();

        let extract = new ExtractFileInfo(fileHandle);
        let extractedInfo = extract._returnFileObject();
        db._insertFileInfo(extractedInfo);
        extract._closeFileHandle();
        // extract._closeFileHandle();
    });

    //Working - Start
    //req.on('data', (e) => file.write(e));
    //req.on('end', () => {
        //file.end();
      //  res.send('We done');
    // })
    //Working -- End


});
module.exports = router;