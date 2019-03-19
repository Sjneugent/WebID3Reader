const fs = require('fs');
const crypto = require('crypto');
const md5File = require('md5-file');

class ExtractFileInfo {
    /**
     *
     * @param fileHandle = fs.fileReadStream
     */
    constructor(fileHandle) {
        this.fileHandle = fileHandle;
        this.size = fs.statSync(fileHandle.path).size;
        this.statPath = fileHandle.path;
        this.digest = md5File.sync(this.fileHandle.path);
    }
    _closeFileHandle() {
        this.fileHandle.close();
    }

    _returnFileObject() {
        return {
            size: this.size,
            path: this.statPath,
            hash: this.digest,
            name: this.statPath
        };
    }

}
module.exports = ExtractFileInfo;