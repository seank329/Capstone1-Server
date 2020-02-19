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

// var corsOptions = {
//     origin: process.env.CLIENT_ORIGIN,
//     credentials:true,
// };

app.use(morgan(morganOption, { skip: () => NODE_ENV === 'test' }));
//app.use(cors(corsOptions));
//app.use(cors(corsOptionsDelegate))
app.all('*',function(req,res,next)
{
    if (!req.get('Origin')) return next();

    res.set('Access-Control-Allow-Origin','https://memory-app-sigma.now.sh');
    res.set('Access-Control-Allow-Methods','GET,POST');
    res.set('Access-Control-Allow-Headers','X-Requested-With,Content-Type,authorization');

    if ('OPTIONS' == req.method) return res.send(200);

    next();
});
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
