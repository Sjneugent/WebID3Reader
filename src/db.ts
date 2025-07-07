import mysql from 'mysql';
import { Response } from 'express';

interface FileStruct {
    size: number;
    path: string;
    hash: string;
    name: string;
}

interface MetadataStruct {
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

type DatabaseCallback<T> = (error: mysql.MysqlError | null, results: T) => void;
type DatabaseCallbackWithReq<T> = (error: mysql.MysqlError | null, results: T, reqObject: Response) => void;

class DB {
    private mysql: typeof mysql;
    private host: string;
    private user: string;
    private password: string;
    private database: string;
    private connection?: mysql.Connection;

    constructor() {
        this.mysql = mysql;
        this.host = 'localhost';
        this.user = 'mymedia';
        this.password = 'mymedia';
        this.database = 'media';
    }

    _connect(): void {
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
    insertFileInfo(fileStruct: FileStruct, callback: DatabaseCallback<number>): void {
        if (!this.connection) {
            throw new Error('Database connection not established');
        }
        
        let path = this.connection.escape(fileStruct.path);
        let name = this.connection.escape(fileStruct.name);
        let hash = this.connection.escape(fileStruct.hash);
        let size = this.connection.escape(fileStruct.size);
        
        this.connection.query(`INSERT INTO fileInfo (FilePath, FileName, Hash, Size) VALUES (${path}, ${name}, ${hash}, ${size});`, (error, results, fields) => {
            if (error) {
                callback(error, 0);
            } else {
                callback(null, (results as any).insertId);
            }
        });
        this.connection.commit();
    }

    /**
     *
     *  (Incomplete) file metadata storage
     * @param id3Structure - Culmination of the readfile events from media-info
     * @param hash - file hash.  Since this table is created right after the fileinfo insert, you should still have the hash
     * @param callback - Give back the results to upload.js
     */
    insertFileMetadata(id3Structure: MetadataStruct, hash: string, callback: DatabaseCallback<number>): void {
        if (!this.connection) {
            throw new Error('Database connection not established');
        }

        let album = this.connection.escape(id3Structure.common.album);
        let title = this.connection.escape(id3Structure.common.title);
        let dataFormat = this.connection.escape(id3Structure.format.dataformat);
        let duration = this.connection.escape(id3Structure.format.duration);
        let artist = this.connection.escape(id3Structure.common.artist);
        let genre = this.connection.escape(id3Structure.common.genre);
        let year = this.connection.escape(id3Structure.common.year);
        let bitRate = this.connection.escape(id3Structure.format.bitrate);
        let encoder = this.connection.escape(id3Structure.format.encoder);
        hash = this.connection.escape(hash);
        
        this.connection.query(`INSERT INTO fileMetadata (Album, TrackName, Format, Duration, AlbumPerformer, Performer, Genre, RecordedDate, Hash, OverallBitRate, WritingLibrary)`
                                + `VALUES(${album}, ${title}, ${dataFormat}, ${duration},${artist},`
                                + `${artist}, ${genre}, ${year}, ${hash}, ${bitRate}, ${encoder});`, function (error, results, fields) {
            if (error){
                console.error("Error received on insertFileMetadata ", error);
                callback(error, 0);
            } else
                callback(null, (results as any).insertId);
        });
        this.connection.commit();
    }

    /**
     *  If you have the id of fileinfo and filemetadata we add these together so if you have a fileId and want the info from the other table, you dont have to start hashing shit to get it.
     * @param fileInfoId - can be queried via hash
     * @param fileMetadataId - can be queried via hash
     */
    joinTableIds(fileInfoId: number, fileMetadataId: number): void {
        if (!this.connection) {
            throw new Error('Database connection not established');
        }
        
        this.connection.query(`INSERT INTO fileinfometadata (fileInfoID, fileMetadataId) VALUES(${fileInfoId}, ${fileMetadataId});`, function (result, error, fields) {
            console.error("Finished the joint table");
        });
        this.connection.commit();
    }

    /**
     *  Not so much as search BY hash, as it is join two tables via hash
     * @param hash
     * @param callback
     * @param reqObject
     */
    searchByHash(hash: string, callback: DatabaseCallbackWithReq<any>, reqObject: Response): void {
        if (!this.connection) {
            throw new Error('Database connection not established');
        }
        
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
     * @param callback 
     * @param reqObject 
     */
    findAllSearchableColumns(callback: DatabaseCallbackWithReq<string[]>, reqObject: Response): void {
        if (!this.connection) {
            throw new Error('Database connection not established');
        }
        
        var fullList: string[] = [];
        this.connection.query(`SELECT * FROM fileMetadata LIMIT 1;`, (error, results, field) => {
            if (error) {
                callback(error, [], reqObject);
            } else {
                if (field) {
                    field.forEach((element: any) => {
                        fullList.push(element.name);
                    });
                }
                callback(null, fullList, reqObject);
            }
        });
    }

    /**
     * 
     * @param {*} input 
     * @param {*} callback 
     */
    searchByAll(queryText: string, callback: DatabaseCallbackWithReq<any>, reqObject: Response): void {
        if (!this.connection) {
            throw new Error('Database connection not established');
        }
        
        let searchString = queryText.split(":")[0];
        let columnString = queryText.split(":")[1];
        this.connection.query(`SELECT * FROM fileMetadata WHERE ${columnString} LIKE "%${searchString}%";`, (error, results, field) => {
            if (error) {
                callback(error, null, reqObject);
            } else {
                callback(null, results, reqObject);
            }
        });
    }

    /**
     *
     * @param fileHash
     * @param callback
     */
    fileExistsAsync(fileHash: string, callback: DatabaseCallback<any>): void {
        if (!this.connection) {
            throw new Error('Database connection not established');
        }
        
        this.connection.query(`SELECT Hash FROM fileInfo WHERE Hash = "${fileHash}"`, (error, results, fields) => {
            if (error) {
                callback(error, null);
            } else {
                callback(null, results)
            }
        });
    }
}

export = DB;