import mysql, { Connection, RowDataPacket, OkPacket } from 'mysql2/promise';
import { IAudioMetadata } from 'music-metadata';
import { FileInfo } from './types';
import mysqlConfig from '../config/mysql.json';

// Map from external-facing column name to actual SQL column name.
// Only columns listed here are searchable, preventing SQL injection via column names.
const SEARCHABLE_COLUMNS: ReadonlyMap<string, string> = new Map([
    ['Album', 'Album'],
    ['TrackName', 'TrackName'],
    ['Format', 'Format'],
    ['Duration', 'Duration'],
    ['AlbumPerformer', 'AlbumPerformer'],
    ['Performer', 'Performer'],
    ['Genre', 'Genre'],
    ['RecordedDate', 'RecordedDate'],
    ['Hash', 'Hash'],
    ['OverallBitRate', 'OverallBitRate'],
    ['WritingLibrary', 'WritingLibrary'],
]);

/** MD5 hashes are exactly 32 lowercase hex characters. */
const MD5_REGEX = /^[0-9a-f]{32}$/i;

class DB {
    private connection?: Connection;

    async connect(): Promise<void> {
        const { host = 'localhost', user, password, database } = mysqlConfig;
        if (!user || !password || !database) {
            throw new Error('Missing required database configuration fields (user, password, database).');
        }
        this.connection = await mysql.createConnection({ host, user, password, database });
    }

    private getConnection(): Connection {
        if (!this.connection) {
            throw new Error('Database connection not established. Call connect() first.');
        }
        return this.connection;
    }

    async insertFileInfo(fileStruct: FileInfo): Promise<number> {
        const conn = this.getConnection();
        const [result] = await conn.execute<OkPacket>(
            'INSERT INTO fileInfo (FilePath, FileName, Hash, Size) VALUES (?, ?, ?, ?)',
            [fileStruct.path, fileStruct.name, fileStruct.hash, fileStruct.size],
        );
        return result.insertId;
    }

    async insertFileMetadata(metadata: IAudioMetadata, hash: string): Promise<number> {
        const conn = this.getConnection();
        const { common, format } = metadata;
        const [result] = await conn.execute<OkPacket>(
            `INSERT INTO fileMetadata
             (Album, TrackName, Format, Duration, AlbumPerformer, Performer, Genre, RecordedDate, Hash, OverallBitRate, WritingLibrary)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                common.album ?? null,
                common.title ?? null,
                format.container ?? null,
                format.duration ?? null,
                common.artist ?? null,
                common.artist ?? null,
                common.genre?.join(', ') ?? null,
                common.year ?? null,
                hash,
                format.bitrate ?? null,
                format.tool ?? null,
            ],
        );
        return result.insertId;
    }

    async joinTableIds(fileInfoId: number, fileMetadataId: number): Promise<void> {
        const conn = this.getConnection();
        await conn.execute(
            'INSERT INTO fileinfometadata (fileInfoID, fileMetadataId) VALUES (?, ?)',
            [fileInfoId, fileMetadataId],
        );
    }

    async searchByHash(hash: string): Promise<RowDataPacket[]> {
        if (!MD5_REGEX.test(hash)) {
            throw new Error('Invalid hash format.');
        }
        const conn = this.getConnection();
        const [rows] = await conn.execute<RowDataPacket[]>(
            `SELECT fileInfo.*, fileMetadata.*
             FROM fileMetadata
             LEFT JOIN fileInfo ON fileInfo.Hash = fileMetadata.Hash
             WHERE fileInfo.Hash = ?`,
            [hash],
        );
        return rows;
    }

    /**
     * Returns the list of column names that callers are allowed to search against.
     * Derived from the static SEARCHABLE_COLUMNS allowlist — no DB round-trip needed
     * and no internal schema is exposed to callers.
     */
    static findAllSearchableColumns(): string[] {
        return Array.from(SEARCHABLE_COLUMNS.keys());
    }

    async searchByAll(queryText: string): Promise<RowDataPacket[]> {
        const colonIndex = queryText.indexOf(':');
        if (colonIndex === -1) {
            throw new Error('Invalid query format. Expected "searchString:columnName".');
        }
        const searchString = queryText.slice(0, colonIndex);
        const columnString = queryText.slice(colonIndex + 1);
        const sqlColumn = SEARCHABLE_COLUMNS.get(columnString);
        if (!sqlColumn) {
            throw new Error('The specified search column is not allowed.');
        }
        const conn = this.getConnection();
        // `sqlColumn` is a value from the SEARCHABLE_COLUMNS Map whose keys and values
        // are all hardcoded safe identifiers (no user input reaches this point), so
        // interpolating it with backtick quoting is safe. MySQL's protocol does not
        // support parameterized column/identifier names, making this the correct pattern.
        const [rows] = await conn.execute<RowDataPacket[]>(
            `SELECT * FROM fileMetadata WHERE \`${sqlColumn}\` LIKE ?`,
            [`%${searchString}%`],
        );
        return rows;
    }

    async fileExists(fileHash: string): Promise<boolean> {
        if (!MD5_REGEX.test(fileHash)) {
            throw new Error('Invalid hash format.');
        }
        const conn = this.getConnection();
        const [rows] = await conn.execute<RowDataPacket[]>(
            'SELECT Hash FROM fileInfo WHERE Hash = ?',
            [fileHash],
        );
        return rows.length > 0;
    }
}

export default DB;