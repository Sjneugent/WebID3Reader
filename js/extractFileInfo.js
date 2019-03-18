const fs = require('fs');
const crypto = require('crypto');

class ExtractFileInfo {
    constructor(fileHandle){
        this.fileHandle = fileHandle;
        let stats = fs.stat(fileHandle.path, (err, stats) => {
            this.size = stats.size;
        });
        this.digest = 0;
        this.statPath = fileHandle.path;
        this._generateHashForHandle(this._displayDigest());
    }
    _displayDigest(e) {
        console.error("displayDigest");
        console.error(e);
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
    _generateHashForHandle(callback) {
        let algo = 'md5';
        let hashTable = new Array();
        let hash  = crypto.createHash(algo);
        this.fileHandle.on('data', function(data){
            hash.update(data);
        });
        let digest = this.fileHandle.on('end', function () {
            // return hash.digest('hex')

          return hash.digest('hex');
        });
        console.error(digest);

    }

}
module.exports = ExtractFileInfo;