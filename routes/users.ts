import express from 'express';

const router = express.Router();

router.get('/', (_req, res) => {
    res.send('respond with a resource');
});

export default router;