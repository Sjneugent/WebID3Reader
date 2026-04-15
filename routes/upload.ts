import express from 'express';
import path from 'path';
import HandleUpload from '../src/handleUpload';
import SaveFile from '../src/saveFile';
import DB from '../src/db';
import ExtractFileInfo from '../src/extractFileInfo';
import parseMetadata from '../src/metadataHandler';

const router = express.Router();

router.get('/', (_req, res) => {
    res.sendFile(path.resolve('public/html/upload.html'));
});

router.post('/', async (req, res, next) => {
    try {
        const db = new DB();
        await db.connect();

        const fileName = new HandleUpload(req).getFileName();
        const saveFile = new SaveFile(req, fileName);
        await saveFile.waitForClose();

        const extractor = new ExtractFileInfo(saveFile.filePath);
        const fileInfo = await extractor.getFileInfo();

        const exists = await db.fileExists(fileInfo.hash);
        if (!exists) {
            const [fileInfoId, metadata] = await Promise.all([
                db.insertFileInfo(fileInfo),
                parseMetadata(fileInfo.path),
            ]);
            const metadataId = await db.insertFileMetadata(metadata, fileInfo.hash);
            await db.joinTableIds(fileInfoId, metadataId);
        }

        res.json({ status: 'ok' });
    } catch (err) {
        next(err);
    }
});

export default router;