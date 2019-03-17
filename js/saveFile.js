const path = require('path');
const fs = require('fs');
class SaveFile {
    constructor(request, fileName, savedDirectory = '/uploads'){
        console.error(`SaveFile constructed with request, fileName ${fileName} and directory ${savedDirectory}`);
        this.savedDirectory = savedDirectory;
        this.fileName = fileName;
        this.request = request;
        this.fileWriteStream = fs.createWriteStream('./uploaded/' + fileName);
        console.error(this.fileWriteStream);
        this.request.on('data', this._writeChunk.bind(this))
    }

    _writeChunk(chunk){
        console.error("Received Chunk");
        this.fileWriteStream.write(chunk);
    }

    _uploadFinished(event) {
        console.error(event);
        this.fileWriteStream.end();
    }

}

module.exports = SaveFile;