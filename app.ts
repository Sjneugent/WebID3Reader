import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import fs from 'fs';
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import uploadRouter from './routes/upload';

const app = express();

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

export = app;