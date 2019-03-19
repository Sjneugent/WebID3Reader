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

        this.connection.query("SELECT * FROM FileInfo", function (error, results, fields){
            // console.error(error, results, fields);
        });
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
        this.connection.query(`INSERT INTO fileInfo (FilePath, FileName, Hash, Size) VALUES (\"${fileStruct.path}\", \"${fileStruct.name}\", \"${fileStruct.hash}\", \"${fileStruct.size}\");`, function (error, results, fields){
            console.error(results);
            console.error(error);
        });
        this.connection.commit();
    }



}

module.exports = DB;