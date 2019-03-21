const path = require('path');
const fs = require('fs');
const events = require('events');
const EventEmitter = require('events').EventEmitter;
class SaveFile extends EventEmitter{
    constructor(request, fileName, savedDirectory = './uploaded/'){
        super();
        this.savedDirectory = savedDirectory;
        this.fileName = fileName;
        this.request = request;
        this.uploadDir = './uploaded/' + Math.floor(Math.random() * 10000000);
        fs.mkdirSync(`${this.uploadDir}`);
        this.fileWriteStream = fs.createWriteStream(`${this.uploadDir}/` + fileName);
        // this.fileWriteStream.on('close', () => {
     //       console.error("Close on fileWriteStream");
        // })
        // this.fileWriteStream.on('finish', () => { this.fileWriteStream.end(); console.error("it srsly finished") } );
        // this.fileWriteStream.on('end', () => { this.fileWriteStream.end(); console.error("it srsly ended") } );

        //TODO:  with larger requests it fucked up -- maybe not now.
        // NO I DIDNT FUCK UP.  IT SAVES THE FILE JUST FINE
        //I was closing the fileWriteStream as soon as the request was uploaded, but it needed more time.
        // this.request.on('data', this._writeChunk.bind(this));

         this.request.on('end', () =>  { console.error("end request on saveFile.js"); } );
         this.fileWriteStream.on('close', () =>{
             this.emit('FileStreamClosed', {id: "Ended"});
             console.error("file Write Stream close");
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
         // this.fileWriteStream.end();
        //dont end the fileWriteStream until the file write stream is done!
        // this.fileWriteStream.on('finish', () => { this.fileWriteStream.end(); console.error("it srsly ended") } );
         this.fileWriteStream.end();
    }

    // _returnFileHandle() {
    //     return fs.createReadStream(this.savedDirectory + this.fileName)
    // }

    _returnFilePath() {
         return this.uploadDir +'/'+ this.fileName;
    }

}

module.exports = SaveFile;
