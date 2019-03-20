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

        // this.connection.query("SELECT * FROM FileInfo", function (error, results, fields){
        // });
    }

    /**
     * fileStruct {
     *     size,
     *     path,
     *     hash,
     *     name
     * }
     * @param fileStruct
     * @private
     */
    _insertFileInfo(fileStruct){
        // doesn't need to be async
        this.connection.query(`INSERT INTO fileInfo (FilePath, FileName, Hash, Size) VALUES (\"${fileStruct.path}\", \"${fileStruct.name}\", \"${fileStruct.hash}\", \"${fileStruct.size}\");`, function (error, results, fields){
            // console.error(results);
            console.error(error);
        });
        this.connection.commit();
    }

    _fileAsync(fileHash, callback) {
        this.connection.query(`SELECT Hash FROM fileInfo WHERE Hash = "${fileHash}"`, (error, results, fields) => {
            if(error){
                callback(error, null);
            }else {
                callback(null, results)
            }
        });
    }


}

module.exports = DB;