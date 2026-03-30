import express, { Request } from 'express';
import DB from '../src/db';

const router = express.Router();

function readBody(req: Request): Promise<string> {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => { body += String(chunk); });
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

router.post('/findAllSearchableColumns', async (_req, res, next) => {
    try {
        const db = new DB();
        await db.connect();
        const columns = await db.findAllSearchableColumns();
        res.json(columns);
    } catch (err) {
        next(err);
    }
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