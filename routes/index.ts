import express, { Request } from 'express';
import DB from '../src/db';

const router = express.Router();

const MAX_BODY_BYTES = 1024;

function readBody(req: Request): Promise<string> {
    return new Promise((resolve, reject) => {
        let body = '';
        let size = 0;
        req.on('data', (chunk: Buffer | string) => {
            size += Buffer.byteLength(chunk);
            if (size > MAX_BODY_BYTES) {
                req.destroy();
                reject(new Error('Request body too large.'));
                return;
            }
            body += String(chunk);
        });
        req.on('end', () => resolve(body));
        req.on('error', reject);
    });
}

router.get('/', (_req, res) => {
    res.render('index', { title: 'Express' });
});

router.post('/search', async (req, res, next) => {
    try {
        const queryText = await readBody(req);
        const db = new DB();
        await db.connect();
        const results = await db.searchByHash(queryText);
        res.json(results);
    } catch (err) {
        next(err);
    }
});

router.post('/findAllSearchableColumns', (_req, res) => {
    res.json(DB.findAllSearchableColumns());
});

router.post('/findStringAgainstAllColumns', async (req, res, next) => {
    try {
        const queryText = await readBody(req);
        const db = new DB();
        await db.connect();
        const results = await db.searchByAll(queryText);
        res.json(results);
    } catch (err) {
        next(err);
    }
});

export default router;