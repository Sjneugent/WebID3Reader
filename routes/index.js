const express = require('express');
const router = express.Router();
const db = require('../js/db');
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

function searchCallback(err, sqlRes,  res) {
    if(err){
        res.send(JSON.stringify({type: "Error"}));
    }else
        res.send(JSON.stringify(sqlRes));
}


module.exports = router;