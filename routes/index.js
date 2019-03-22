const express = require('express');
const router = express.Router();
const db = require('../js/db');
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/search', function (req, res, next) {
    console.error(req);
    res.send('U GOT IT');
    req.on('data', (d) => {
        let queryText = String(d);
        let dbCon = new db();
        dbCon._connect();
        dbCon.searchByHash(queryText, searchCallback);

    });
});

function searchCallback(err, res) {
    console.error(res);
}


module.exports = router;