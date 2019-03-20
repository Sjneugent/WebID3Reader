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
    //initial request ended
    req.on('data', (e) => {
        saveFile._writeChunk(e);
    }).on('end', (e) => {
        //post is done.
        res.send('File uploaded with name ' + fileName);
        // we dont know the request is done uploading -- but it is fully written to disk?
        // I think this solution is momentarily correct.
        saveFile._uploadFinished(e);
        let fileHandle = saveFile._returnFilePath();
        let extract = new ExtractFileInfo(fileHandle);
        let extractedInfo = extract._returnFileObject();

        db._fileAsync(extractedInfo.hash, function(err, data){
            if(err){
                console.error("Error executing query");
                return;
            }
            if(data.length === 0){
                console.log("inserting file with hash: " + extractedInfo.hash + " into database");
                db._insertFileInfo(extractedInfo);
            }else {
                console.error("file exists already");
            }
        });
    });
});
module.exports = router;