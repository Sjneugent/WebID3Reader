const mediaInfo = require('music-metadata');
const EventEmitter = require('events').EventEmitter;

class MetadataHandler extends EventEmitter{
    constructor(filePath){
        super();
        mediaInfo.parseFile(filePath).then( meta => {
                this.collectData(meta);
        }).catch( (err) => console.error("Music metadata stream error " ,err));
    }
    collectData(data){
        this.metadataObject = data;
        if(this.metadataObject)
            this.emit('MetadataObjectCreated', this.metadataObject);
    }
}

module.exports = MetadataHandler;