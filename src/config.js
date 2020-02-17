'use strict';

module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: 'postgres://uddnwkwxnbawuj:d2e6ea0b00b6c885209fca79026018bca00cba84eddabcdc4cdc98d2e530c620@ec2-184-72-235-159.compute-1.amazonaws.com:5432/d8l3nho10lf5h5',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
    JWT_SECRET:process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY || '20s',
    CLIENT_ORIGIN:'http://localhost://3000'
};