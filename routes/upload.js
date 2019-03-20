const express = require('express');
const router = express.Router();
const path = require('path');
let HandleUpload = require("../js/handleUpload");
let SaveFile = require("../js/saveFile");
let DB = require('../js/db');
let ExtractFileInfo = require('../js/extractFileInfo');
const md5File = require('md5-file');

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
    req.pipe(saveFile._returnFileStream());
    //TODO: Have some async callback/promise so we don't have to have this in the post method
    //initial request ended
    req.on('end', (e) => {
        //_uploadFinished calls end on the fileWriteStream
        saveFile._uploadFinished(e);
        //fixed!  Modularize and break out.  This is callback hell
        //TODO: Instead of _returnFileStream().on('close') have a custom event that fires when _returnFileStream recognizes that fileWriteStream has ended
        saveFile._returnFileStream().on('close', () => {
            //fileHandle can be anywhere
            let fileHandle = saveFile._returnFilePath();
            let extract = new ExtractFileInfo(fileHandle);
            //the query is sometimes incorrect.
            //the file has not been completely flushed
            let syncStuff = md5File.sync(extract._returnFilePath());
            console.error("Querying with " + syncStuff);
            db._fileAsync((syncStuff), function(err, data){
                if(err){
                    console.error("Error executing query");
                    return;
                }
                if(data.length === 0){
                    //sync fs stuff
                    let extractedInfo = extract._returnFileObject();
                    console.log("__LINE__: 91 inserting file with hash: " + md5File.sync(extract._returnFilePath()) + " into database");
                    db._insertFileInfo(extractedInfo);
                }else {
                    console.error("file exists already");
                }
            });
        });
        });
        //post is done.
        res.send('File uploaded with name ' + fileName);
        // we dont know the request is done uploading -- but it is fully written to disk?
        // I think this solution is momentarily correct.

});

/**
 * BROKEN
 * @param extractFileObject
 * @param db
 */
function wrapDbCall(extractFileObject, db) {
    db._fileAsync((extractFileObject.dig), function(err, data){
        if(err){
            console.error("Error executing query");
            return;
        }
        if(data.length === 0){
            //sync fs stuff
            let extractedInfo = extract._returnFileObject();
            console.log("__LINE__: 91 inserting file with hash: " + md5File.sync(extract._returnFilePath()) + " into database");
            db._insertFileInfo(extractedInfo);
        }else {
            console.error("file exists already");
        }
        // this one is always right, due to it coming after :(
        console.error("__LINE__: 57 " + md5File.sync(extract._returnFilePath()));

    });


}

function fileHandleClosed() {

}

module.exports = router;