const fs = require('fs');
const md5File = require('md5-file');

class ExtractFileInfo {
    /**
     *
     * @param fileHandle = fs.fileReadStream
     */
    constructor(filePath) {
        this.filePath = filePath;
        //TODO: Make this asyncronous
        this.statPath = filePath;
    }
    /**
     * HOLY SHIT
     *  THE FILE WRITES COMPLETELY CORRECTLY. 100% after checking hashes.
     *  BUT, BUT, MY GOD.  This fucker starts reading it while its still writing!!!!!
     *  TODO:  INVESTIGATE OTHER MD5 libraries or oll own.
     * @returns {*}
     * @private
     */
    _returnDigest() {
        return md5File.sync(this.filePath);
    }
    _returnSize() {
        return fs.statSync(this.filePath).size;
    }

    _returnFileObject() {
        return {
            size: this._returnSize(),
            path: this._returnFilePath(),
            hash: this._returnDigest(),
            name: this._returnFileName()
        };
    }
    _returnFilePath() {
        return this.statPath;
    }

    _returnFileName() {
        return this.statPath.substr(this.statPath.lastIndexOf("/") + 1, this.statPath.length);
    }



}
module.exports = ExtractFileInfo;