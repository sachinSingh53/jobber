import { Sequelize } from 'sequelize';
import config from './config.js';
import { winstonLogger } from '@sachinsingh53/jobber-shared';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'authServerDatabase', 'debug');

const sequelize = new Sequelize(config.MYSQL_DB, {
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
        multipleStatements: true
    }
});

async function databaseConnection() {
    try {
        await sequelize.authenticate();
        log.info('AuthService Mysql database connection has been established successfully.');

    } catch (error) {
        log.error('Auth Service - Unable to connect to the database.');
        log.log('error', 'AuthService databaseConnection() method error:', error);
    }
}

export { sequelize, databaseConnection };
