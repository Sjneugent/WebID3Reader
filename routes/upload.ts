import express from 'express';
import path from 'path';
import HandleUpload from '../src/handleUpload';
import SaveFile from '../src/saveFile';
import DB from '../src/db';
import ExtractFileInfo from '../src/extractFileInfo';
import * as md5File from 'md5-file';
import MetadataHandler from '../src/metadataHandler';

const router = express.Router();

router.get('/', function (req, res, next) {
    res.sendFile(path.resolve('public/html/upload.html'));
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
    req.on('end', (e: any) => {
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
                        if (err) {
                            console.error("Error inserting file info:", err);
                            return;
                        }
                        let mediaParer = new MetadataHandler(extract.path);
                        mediaParer.on('MetadataObjectCreated', (f) => {
                            db.insertFileMetadata(f, extract.hash, (err, metaId) => {
                                if (err) {
                                    console.error("Error inserting file metadata:", err);
                                    return;
                                }
                                console.error("Insert File Metadata id " + metaId);
                                db.joinTableIds(id, metaId);
                            });
                        });
                    });
                } else {
                    console.error("file exists already");
                }
            });
        });
    });

    req.on('error', (e) => {
        console.error(e);
    });
});

/**
 * BROKEN
 * @param extractFileObject
 * @param db
 */
function wrapDbCall(extractFileObject: any, db: any): void {
    db.fileExistsAsync((extractFileObject.dig), function (err: any, data: any) {
        if (err) {
            console.error("Error executing query");
            return;
        }
        if (data.length === 0) {
            //sync fs stuff
            console.log("__LINE__: 91 inserting file with hash: " + md5File.sync(extractFileObject.path) + " into database");
            db.insertFileInfo(extractFileObject);
        } else {
            console.error("file exists already");
        }
        // this one is always right, due to it coming after :(
        console.error("__LINE__: 57 " + md5File.sync(extractFileObject._returnFilePath()));
    });
}

export = router;