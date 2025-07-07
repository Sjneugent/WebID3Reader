import headerParse from './parseHeader';
import { Request } from 'express';

class HandleUpload {
    private request: Request;
    private fileName: string;

    constructor(request: Request) {
        this.request = request;
        this.fileName = headerParse(this.request.headers['content-disposition'] || '');
    }

    getFileName(): string {
        return this.fileName;
    }
}

export = HandleUpload;