const path = require('path');
const fs = require('fs');
const events = require('events');
const EventEmitter = require('events').EventEmitter;
class SaveFile extends EventEmitter{
    constructor(request, fileName){
        super();
        this.fileName = fileName;
        this.uploadDir = './uploaded/' + Math.floor(Math.random() * 10000000);
        fs.mkdirSync(`${this.uploadDir}`);
        this.fileWriteStream = fs.createWriteStream(`${this.uploadDir}/` + fileName);
        this.fileWriteStream.on('close', () =>{
             this.emit('FileStreamClosed', {id: "Ended"});
         } );
    }
    _returnFileStream() {
        return this.fileWriteStream;
    }
    _writeChunk(chunk){
        this.fileWriteStream.write(chunk);
    }

    //need some way to propogate this up
    _uploadFinished(event) {
         this.fileWriteStream.end();
    }

    _returnFilePath() {
         return this.uploadDir +'/'+ this.fileName;
    }

}

module.exports = SaveFile;
