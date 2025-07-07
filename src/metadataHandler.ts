import * as mediaInfo from 'music-metadata';
import { EventEmitter } from 'events';

class MetadataHandler extends EventEmitter {
    private metadataObject?: any;

    constructor(filePath: string) {
        super();
        mediaInfo.parseFile(filePath).then(meta => {
            this.collectData(meta);
        }).catch((err) => console.error("Music metadata stream error ", err));
    }

    collectData(data: any): void {
        this.metadataObject = data;
        if (this.metadataObject)
            this.emit('MetadataObjectCreated', this.metadataObject);
    }
}

export = MetadataHandler;