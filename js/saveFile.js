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
        //TODO:  with larger requests it fucked up -- maybe not now.
        //I was closing the fileWriteStream as soon as the request was uploaded, but it needed more time.
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
        //dont end the fileWriteStream until the file write stream is done!
        this.fileWriteStream.on('end', () => this.fileWriteStream.end());
        // this.fileWriteStream.end();
    }

    // _returnFileHandle() {
    //     return fs.createReadStream(this.savedDirectory + this.fileName)
    // }

    _returnFilePath() {
         return this.uploadDir +'/'+ this.fileName;
    }

}

module.exports = SaveFile;