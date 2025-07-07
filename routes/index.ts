import express from 'express';
import db from '../src/db';
import { Response } from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/search',  (req, res, next) => {
    req.on('data', (d) => {
        let queryText = String(d);
        let dbCon = new db();
        dbCon._connect();
        dbCon.searchByHash(queryText, searchCallback, res);
    });
});

router.post('/findAllSearchableColumns', (req, res, next) => {
        let dbCon = new db();
        dbCon._connect();
        dbCon.findAllSearchableColumns(searchCallback, res);
});

router.post('/findStringAgainstAllColumns', (req, res, next) => {
    req.on('data', (d) => {
        let queryText = String(d);
        let dbCon = new db();
        dbCon._connect();
        dbCon.searchByAll(queryText, searchCallback, res);
    });
});

function searchCallback(err: any, sqlRes: any, res: Response): void {
    if(err){
        res.send(JSON.stringify({type: "Error"}));
    }else
        res.send(JSON.stringify(sqlRes));
}

export = router;