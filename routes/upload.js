const express = require('express');
const router = express.Router();
const path = require('path');
let HandleUpload = require("../js/handleUpload");
let SaveFile = require("../js/saveFile");
let DB = require('../js/db');
let ExtractFileInfo = require('../js/extractFileInfo');
const md5File = require('md5-file');
const events = require('events');
const em = new events.EventEmitter();


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
        //callback
        saveFile.on('FileStreamClosed', () => {
            //fileHandle can be anywhere
            let fileHandle = saveFile._returnFilePath();
            let extractFileInfo = new ExtractFileInfo(fileHandle);
            let extract = extractFileInfo._returnFileObject();
            //callback :(
            db.fileExistsAsync((extract.hash), function(err, data){
                if(err){
                    console.error("Error executing query");
                    return;
                }
                if(data.length === 0){
                    //sync fs stuff
                    console.log("__LINE__: 91 inserting file with hash: " + extract.hash + " into database");
                    //callback kinda
                    db.insertFileInfo(extract);
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
    db.fileExistsAsync((extractFileObject.dig), function(err, data){
        if(err){
            console.error("Error executing query");
            return;
        }
        if(data.length === 0){
            //sync fs stuff
            console.log("__LINE__: 91 inserting file with hash: " + md5File.sync(extract.path) + " into database");
            db.insertFileInfo(extract);
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