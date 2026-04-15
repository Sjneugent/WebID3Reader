import { Request } from 'express';
import parseHeader from './parseHeader';

class HandleUpload {
    private readonly request: Request;
    private readonly fileName: string;

    constructor(request: Request) {
        this.request = request;
        this.fileName = parseHeader(this.request.headers['content-disposition'] ?? '');
    }

    getFileName(): string {
        return this.fileName;
    }
}

export default HandleUpload;