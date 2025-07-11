let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let fs = require('fs');
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let uploadRouter =require('./routes/upload');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/upload', uploadRouter);

if(!fs.existsSync('./uploaded'))
    fs.mkdir('./uploaded', (err) => {
        if (err) console.error('Error creating uploaded directory:', err);
    });

module.exports = app;
