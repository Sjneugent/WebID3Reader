class DB {
    constructor() {
        this.mysql = require('mysql');
        this.host = 'localhost';
        this.user = 'media';
        this.password = 'mediaPassword';
        this.database = 'media';
    }

    _connect() {
        this.connection = this.mysql.createConnection({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database
        });
        this.connection.connect();
    }

    /**
     * fileStruct {
     *     size,
     *     path,
     *     hash,
     *     name
     * }
     * @param fileStruct
     */
    insertFileInfo(fileStruct, callback) {
        this.connection.query(`INSERT INTO fileInfo (FilePath, FileName, Hash, Size) VALUES (\"${fileStruct.path}\", \"${fileStruct.name}\", \"${fileStruct.hash}\", \"${fileStruct.size}\");`, (error, results, fields) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, results.insertId);
            }
        });
        this.connection.commit();
    }

    insertFileMetadata(id3Structure, hash, callback) {
        this.connection.query(`INSERT INTO fileMetadata (Album, TrackName, Format, Duration, AlbumPerformer, Performer, Genre, RecordedDate, Hash) VALUES("${id3Structure.common.album}", "${id3Structure.common.title}", "${id3Structure.format.dataformat}", ${id3Structure.format.duration},"${id3Structure.common.artist}",  "${id3Structure.common.artist}", "${id3Structure.common.genre}", ${id3Structure.common.year}, "${hash}");`, function (error, results, fields) {
            console.error(error);
            if (error)
                callback(error, null);
            else
                callback(null, results.insertId);
        });
        this.connection.commit();
    }

    joinTableIds(fileInfoId, fileMetadataId) {
        this.connection.query(`INSERT INTO fileinfometadata (fileInfoID, fileMetadataId) VALUES(${fileInfoId}, ${fileMetadataId});`, function (result, error, fields) {
            console.error("Finished the joint table");
        });
        this.connection.commit();
    }

    searchByHash(hash, callback, reqObject) {
        let joinQuery = `SELECT fileInfo.*, fileMetadata.* FROM fileMetadata LEFT JOIN fileInfo ON fileInfo.Hash = fileMetadata.Hash WHERE fileInfo.Hash = "${hash}";`;
        this.connection.query(joinQuery, (err, res, field) => {
            if (err)
                callback(err, null, reqObject);
            else
                callback(null, res, reqObject);
        });
    }

    /**
     *
     * @param fileHash
     * @param callback
     */
    fileExistsAsync(fileHash, callback) {
        this.connection.query(`SELECT Hash FROM fileInfo WHERE Hash = "${fileHash}"`, (error, results, fields) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, results)
            }
        });
    }


}

module.exports = DB;