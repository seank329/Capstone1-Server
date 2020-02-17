'use strict';

module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DATABASE_URL || 'postgresql://sean:123@localhost/memory_general',
    TEST_DB_URL: process.env.TEST_DATABASE_URL,
    JWT_SECRET:process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY || '20s'
};