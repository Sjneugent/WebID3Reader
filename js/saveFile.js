const path = require('path');
const fs = require('fs');
class SaveFile {
    constructor(request, fileName, savedDirectory = './uploaded/'){
        this.savedDirectory = savedDirectory;
        this.fileName = fileName;
        this.request = request;
        this.uploadDir = './uploaded/' + Math.floor(Math.random() * 10000000);
        fs.mkdirSync(`${this.uploadDir}`);

        this.fileWriteStream = fs.createWriteStream(`${this.uploadDir}/` + fileName);
        //TODO:  with larger requess
        // this.request.on('data', this._writeChunk.bind(this));

        // this.request.on('end', () =>  { console.error("end request "); this.fileWriteStream.close(); this.fileWriteStream.end(); } );
    }
    _returnFileStream() {
        return this.fileWriteStream;
    }
    _writeChunk(chunk){
        this.fileWriteStream.write(chunk);
    }

    _uploadFinished(event) {
        console.error("fileWriteStream end " + this.fileWriteStream.bytesWritten);
        this.fileWriteStream.end();
        this.fileWriteStream.close();
    }

    // _returnFileHandle() {
    //     return fs.createReadStream(this.savedDirectory + this.fileName)
    // }

    _returnFilePath() {
         return this.uploadDir +'/'+ this.fileName;
    }

}

module.exports = SaveFile;