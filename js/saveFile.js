const path = require('path');
const fs = require('fs');
class SaveFile {
    constructor(request, fileName, savedDirectory = './uploaded/'){
        this.savedDirectory = savedDirectory;
        this.fileName = fileName;
        this.request = request;
        this.fileWriteStream = fs.createWriteStream('./uploaded/' + fileName);
        this.request.on('data', this._writeChunk.bind(this))
    }

    _writeChunk(chunk){
        this.fileWriteStream.write(chunk);
    }

    _uploadFinished(event) {
        this.fileWriteStream.end();
    }

    _returnFileHandle() {
        return fs.createReadStream(this.savedDirectory + this.fileName)
    }

    _returnFilePath() {
         return this.savedDirectory + this.fileName;
    }

}

module.exports = SaveFile;