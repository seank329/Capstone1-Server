'use strict';

require ('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors =  require('cors');
const helmet = require('helmet');
const { NODE_ENV, CLIENT_ORIGIN } = require('./config');
const authRouter = require('./auth/auth-router');
const generalRouter = require('./memory-general/memory-general-router');
const usersRouter = require('./user/user-router')


const app = express();

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common' ;

app.use(morgan(morganOption, { skip: () => NODE_ENV === 'test' }));
//app.use(cors());
app.use(helmet());

// app.use(
// 	cors({
// 		origin: CLIENT_ORIGIN
// 	})
// );


// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     next();
//   });
let whiteListOrigin = config.CLIENT_ORIGIN
let corsOptions = {
    origin: function (origin, callback) {
      if (whiteListOrigin === origin || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }

app.use('/api/users',cors(corsOptions), usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/memory-general', cors(corsOptions), generalRouter);

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
