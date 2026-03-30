import fs from 'fs';
import { Request } from 'express';

class SaveFile {
    private readonly fileName: string;
    private readonly uploadDir: string;
    private readonly writeStream: fs.WriteStream;
    private readonly closePromise: Promise<void>;

    constructor(request: Request, fileName: string) {
        this.fileName = fileName;
        this.uploadDir = `./uploaded/${Math.floor(Math.random() * 10_000_000)}`;
        fs.mkdirSync(this.uploadDir);
        this.writeStream = fs.createWriteStream(`${this.uploadDir}/${fileName}`);
        this.closePromise = new Promise<void>((resolve, reject) => {
            this.writeStream.on('close', resolve);
            this.writeStream.on('error', reject);
        });
        request.pipe(this.writeStream);
    }

    get stream(): fs.WriteStream {
        return this.writeStream;
    }

    get filePath(): string {
        return `${this.uploadDir}/${this.fileName}`;
    }

    waitForClose(): Promise<void> {
        return this.closePromise;
    }
}

export default SaveFile;