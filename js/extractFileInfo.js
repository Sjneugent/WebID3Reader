const fs = require('fs');
const crypto = require('crypto');
const md5File = require('md5-file');

class ExtractFileInfo {
    /**
     *
     * @param fileHandle = fs.fileReadStream
     */
    constructor(filePath) {
        this.filePath = filePath;
        this.size = fs.statSync(filePath).size;
        console.error(this.size);
        this.statPath = filePath;
    }
    _closeFileHandle() {
        // this.fileHandle.close();
    }
    _returnDigest() {
        console.error("path: " + this.filePath+ " == " + md5File.sync(this.filePath));
        return md5File.sync(this.filePath);
    }
    _returnSize() {
        console.error(fs.statSync(this.filePath));
        return fs.statSync(this.filePath).size;
    }

    _returnFileObject() {
        console.error(`File with name ${this.statPath} has hash ${this._returnDigest()}`);
        return {
            size: this._returnSize(),
            path: this.statPath,
            hash: this._returnDigest(),
            name: this.statPath
        };
    }

}
module.exports = ExtractFileInfo;