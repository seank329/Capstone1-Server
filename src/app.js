'use strict';

require ('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors =  require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const authRouter = require('./auth/auth-router');
const generalRouter = require('./memory-general/memory-general-router');
const usersRouter = require('./user/user-router')

const app = express();

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common' ;

// var whitelist = ['https://memory-app-sigma.now.sh']
// var corsOptionsDelegate = function (req, callback) {
//   var corsOptions;
//   if (whitelist.indexOf(req.header('Origin')) !== -1) {
//     corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions = { origin: false } // disable CORS for this request
//   }
//   callback(null, corsOptions) // callback expects two parameters: error and options
// }


app.use(morgan(morganOption, { skip: () => NODE_ENV === 'test' }));
app.use(cors({
        origin : process.env.CLIENT_ORIGIN, 
        credentials : true,
        allowedHeaders: 'content-type, authorization',
        preflightContinue
            }));
//app.use(cors(corsOptionsDelegate))
app.use(helmet());

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/memory-general',  generalRouter);

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
