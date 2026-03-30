import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import { Request } from 'express';

class SaveFile {
    private readonly fileName: string;
    private readonly uploadDir: string;
    private readonly writeStream: fs.WriteStream;
    private readonly closePromise: Promise<void>;

    constructor(request: Request, fileName: string) {
        // Strip any directory components to prevent path traversal (e.g. "../../etc/passwd").
        const safeName = path.basename(fileName);
        if (!safeName) {
            throw new Error('Invalid or missing filename.');
        }
        this.fileName = safeName;

        // Use cryptographically random bytes for the subdirectory name to avoid collisions.
        this.uploadDir = `./uploaded/${randomBytes(8).toString('hex')}`;
        fs.mkdirSync(this.uploadDir);
        this.writeStream = fs.createWriteStream(path.join(this.uploadDir, this.fileName));
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
        return path.join(this.uploadDir, this.fileName);
    }

    waitForClose(): Promise<void> {
        return this.closePromise;
    }
}

export default SaveFile;