const express = require('express');
const router = express.Router();
const path = require('path')


router.get('/', function(req, res, next) {
    res.sendFile(path.resolve('public/html/upload.html'), {title: "upload"});
});
module.exports = router;