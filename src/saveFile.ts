import fs from 'fs';
import { EventEmitter } from 'events';
import { Request } from 'express';

class SaveFile extends EventEmitter {
    private fileName: string;
    private uploadDir: string;
    private fileWriteStream: fs.WriteStream;

    constructor(request: Request, fileName: string) {
        super();
        this.fileName = fileName;
        this.uploadDir = './uploaded/' + Math.floor(Math.random() * 10000000);
        fs.mkdirSync(`${this.uploadDir}`);
        this.fileWriteStream = fs.createWriteStream(`${this.uploadDir}/` + fileName);
        this.fileWriteStream.on('close', () => {
            this.emit('FileStreamClosed', {id: "Ended"});
        });
    }

    _returnFileStream(): fs.WriteStream {
        return this.fileWriteStream;
    }

    _writeChunk(chunk: Buffer): void {
        this.fileWriteStream.write(chunk);
    }

    //need some way to propogate this up
    _uploadFinished(event: any): void {
        this.fileWriteStream.end();
    }

    _returnFilePath(): string {
        return this.uploadDir + '/' + this.fileName;
    }
}

export = SaveFile;