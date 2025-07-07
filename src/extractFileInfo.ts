import fs from 'fs';
import * as md5File from 'md5-file';

interface FileObject {
    size: number;
    path: string;
    hash: string;
    name: string;
}

class ExtractFileInfo {
    private filePath: string;
    private statPath: string;

    /**
     *
     * @param filePath = file path to extract info from
     */
    constructor(filePath: string) {
        this.filePath = filePath;
        //TODO: Make this asyncronous
        this.statPath = filePath;
    }

    /**
     * HOLY SHIT
     *  THE FILE WRITES COMPLETELY CORRECTLY. 100% after checking hashes.
     *  BUT, BUT, MY GOD.  This fucker starts reading it while its still writing!!!!!
     *  TODO:  INVESTIGATE OTHER MD5 libraries or roll own.
     * @returns {*}
     * @private
     */
    private _returnDigest(): string {
        return md5File.sync(this.filePath);
    }

    private _returnSize(): number {
        return fs.statSync(this.filePath).size;
    }

    _returnFileObject(): FileObject {
        return {
            size: this._returnSize(),
            path: this._returnFilePath(),
            hash: this._returnDigest(),
            name: this._returnFileName()
        };
    }

    private _returnFilePath(): string {
        return this.statPath;
    }

    private _returnFileName(): string {
        return this.statPath.substr(this.statPath.lastIndexOf("/") + 1, this.statPath.length);
    }
}

export = ExtractFileInfo;