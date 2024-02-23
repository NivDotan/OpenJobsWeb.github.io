const { Pool } = require('pg');
const knex = require('knex');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors())
app.get('/', async (req, res) => {
    try {
        const tableName = 'jobsfromtelegram';
        const rows = await selectAllFromTable(tableName);
        //console.log(rows);
        res.setHeader('Content-Type', 'application/json');
        res.json(rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});



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

        // Convert date format in each row
        const formattedRows = result.map(row => {
            return {
                ...row,
                Date: convertDateFormat(row.Date),
            };
        });

        return formattedRows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    } finally {
        await knex.destroy();
    }
}


function convertDateFormat(originalDate) {
    const date = new Date(originalDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(2);
    return `${day}/${month}/${year}`;
  }