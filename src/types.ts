export interface FileInfo {
    size: number;
    path: string;
    hash: string;
    name: string;
}

export interface MetadataInfo {
    common: {
        album?: string;
        title?: string;
        artist?: string;
        genre?: string[];
        year?: number;
    };
    format: {
        dataformat?: string;
        duration?: number;
        bitrate?: number;
        encoder?: string;
    };
}

export interface DatabaseCallbacks {
    success<T>(error: null, result: T): void;
    error(error: Error, result?: null): void;
}

export interface UploadEvent {
    id: string;
}