'use strict';
const knex=require('knex')
const app = require('./app');
const { PORT, DATABASE_URL } = require('./config');

const db = knex({
    client:'pg',
    connection:DATABASE_URL,
})

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://memory-app-sigma.now.sh"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
app.set('db', db)
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost: ${PORT} `)
})