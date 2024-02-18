const { Pool } = require('pg');
const knex = require('knex');

function setupDBConnection() {
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'JobSeekingDB',
        password: '1399',
        port: 5432,
    });

    const db = knex({
        client: 'pg',
        connection: {
            host: 'localhost',
            user: 'postgres',
            password: '1399',
            database: 'JobSeekingDB',
            port: 5432,
        },
    });

    return {
        pool: pool,
        knex: db,
    };
}

async function selectAllFromTable(tableName) {
    const { knex } = setupDBConnection();

    try {
        const result = await knex.select('*').from(tableName);
        return result;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    } finally {
        await knex.destroy();
    }
}


async function main() {
    try {
        const tableName = 'jobsfromtelegram';
        const rows = await selectAllFromTable(tableName);
        console.log(rows);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();