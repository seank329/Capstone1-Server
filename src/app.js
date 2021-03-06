'use strict';

require ('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors =  require('cors');
const helmet = require('helmet');
const { NODE_ENV, CLIENT_ORIGIN } = require('./config');
const authRouter = require('./auth/auth-router');
const { requireAuth } = require('./middleware/jwt-auth')
const generalRouter = require('./memory-general/memory-general-router');
const usersRouter = require('./user/user-router');

const app = express();

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common' ;

app.use(morgan(morganOption, { skip: () => NODE_ENV === 'test' }));
app.use(cors({
    origin: CLIENT_ORIGIN   // Necessary for CORS
}));
app.use(helmet());

app.use('/api/users', usersRouter);             // User registration
app.use('/api/auth', authRouter);               // User authentication
app.use('/api/memory-general', generalRouter);      // All game-related transactions 

app.get('/', (req, res) => {
   res.send('Hello, boilerplate!');
});

//Catch-all 404
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//Catch-all Error Handler
//Add NODE_ENV check to prevent a stacktrace leak
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: app.get('env') === 'development' ? err : {}
    });
});

module.exports = app;
