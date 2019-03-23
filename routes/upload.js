const express = require('express');
const router = express.Router();
const path = require('path');
let HandleUpload = require("../js/handleUpload");
let SaveFile = require("../js/saveFile");
let DB = require('../js/db');
let ExtractFileInfo = require('../js/extractFileInfo');
const md5File = require('md5-file');
const MetadataHandler = require('../js/metadataHandler');

router.get('/', function (req, res, next) {
    res.sendFile(path.resolve('public/html/upload.html'), {title: "upload"});
});
/**
 *
 *  POST => localhost:3000/upload/
 *  Receive XMLHTTPRequest with file info.  on.('data') chunks are sent and written with fs.write
 */
router.post('/', function (req, res, next) {
    const db = new DB();
    db._connect();

    const handleUpload = new HandleUpload(req);
    const saveFile = new SaveFile(req, handleUpload.getFileName());
    req.pipe(saveFile._returnFileStream());
    //TODO: Abstract it out to get rid of shitty code.
    //initial request ended
    req.on('end', (e) => {
        saveFile._uploadFinished(e);
        //fixed!  Modularize and break out.  This is callback hell
        //callback
        saveFile.on('FileStreamClosed', () => {
            let fileHandle = saveFile._returnFilePath();
            let extractFileInfo = new ExtractFileInfo(fileHandle);
            let extract = extractFileInfo._returnFileObject();
            //callback :(
            db.fileExistsAsync((extract.hash), function (err, data) {
                if (err) {
                    console.error("Error executing query");
                    return;
                }
                if (data.length === 0) {
                    console.log("__LINE__: 91 inserting file with hash: " + extract.hash + " into database");
                    db.insertFileInfo(extract, (err, id) => {
                        let mediaParer = new MetadataHandler(extract.path);
                        mediaParer.on('MetadataObjectCreated', (f) => {
                            db.insertFileMetadata(f, extract.hash, (err, metaId) => {
                                console.error("Insert File Metadata id " + metaId);
                                db.joinTableIds(id, metaId);
                            });
                        });
                    });
                } else {
                    console.error("ERROR: File is already in database");
                }
            });
        });
    });
    //post is done.
    res.send('File uploaded with name ' + handleUpload.getFileName());
    // we dont know the request is done uploading -- but it is fully written to disk?
    // I think this solution is momentarily correct.

});

/**
 * BROKEN
 * @param extractFileObject
 * @param db
 */
function wrapDbCall(extractFileObject, db) {
    db.fileExistsAsync((extractFileObject.dig), function (err, data) {
        if (err) {
            console.error("Error executing query");
            return;
        }
        if (data.length === 0) {
            //sync fs stuff
            console.log("__LINE__: 91 inserting file with hash: " + md5File.sync(extract.path) + " into database");
            db.insertFileInfo(extract);
        } else {
            console.error("file exists already");
        }
        // this one is always right, due to it coming after :(
        console.error("__LINE__: 57 " + md5File.sync(extract._returnFilePath()));

    });

}
module.exports = router;