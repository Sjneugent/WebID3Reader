import { promises as fsPromises } from 'fs';
import { createHash } from 'crypto';
import { createReadStream } from 'fs';
import { FileInfo } from './types';

async function computeMd5(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const hash = createHash('md5');
        const stream = createReadStream(filePath);
        stream.on('data', (chunk) => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
        stream.on('error', reject);
    });
}

class ExtractFileInfo {
    private readonly filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    async getFileInfo(): Promise<FileInfo> {
        const [hash, stats] = await Promise.all([
            computeMd5(this.filePath),
            fsPromises.stat(this.filePath),
        ]);
        return {
            size: stats.size,
            path: this.filePath,
            hash,
            name: this.filePath.substring(this.filePath.lastIndexOf('/') + 1),
        };
    }
}

export default ExtractFileInfo;