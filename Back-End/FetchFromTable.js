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


app.get('/cities', async (req, res) => {
    try {
        const tableName = 'jobsfromtelegram';
        const rows = await getCitiesFromDatabase(tableName);
        console.log(extractUniqueCities(rows));
        res.setHeader('Content-Type', 'application/json');
        res.json(rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/GetStudentJuniorTAAndHaifa', async (req, res) => {
    try {
        const tableName = 'jobsfromtelegram';
        const rows = await GetStudentJuniorTAAndHaifa(tableName);
        res.setHeader('Content-Type', 'application/json');
        res.json(rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/DeleteAndContinue', async (req, res) => {
    try {
        const Tmp = await CopyAndDelete();
        const tableName = 'jobsfromtelegram';
        const rows = await selectAllFromTable(tableName);
        res.setHeader('Content-Type', 'application/json');
        res.json(rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
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

  async function getCitiesFromDatabase(tableName) {
    const { knex } = setupDBConnection();

    try {
        const result = await knex.distinct('City').from(tableName);
        return result.map(row => row.City);
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    } finally {
        await knex.destroy();
    }
}

async function GetStudentJuniorTAAndHaifa(tableName) {
    const { knex } = setupDBConnection();

    try {
        const result = await knex.select('*').from(tableName)
                        .where(builder => {
                            builder.where(function() {
                            this.where('JobDesc', 'like', '%student%')
                                .orWhere('JobDesc', 'like', '%junior%')
                                .orWhere('JobDesc', 'like', '%Student%')
                                .orWhere('JobDesc', 'like', '%Junior%');
                            }).andWhere(function() {
                            this.where('City', 'like', '%Haifa%')
                                .orWhere('City', 'like', '%haifa%')
                                .orWhere('City', 'like', '%Tel%')
                                .orWhere('City', 'like', '%TEL%')
                                .orWhere('City', 'like', '%HQ%')
                                .orWhere('City', 'like', '%IL%')
                                .orWhere('City', 'like', 'Israel')
                                .orWhere('City', 'like', '%Yokneam%')
                                .orWhere('City', 'like', '%tel%');
                            });
                        });
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


async function CopyAndDelete() {
    const { knex } = setupDBConnection();
    const tableName = 'jobsfromtelegram';
    const oldTableName = 'OldJobPosting';
    
    try {
        // Step 1: Copy data to the new table
        const selectedRows = await knex
                            .select('Company', 'JobDesc', 'City', 'Link', 'Date')
                            .from(tableName);
        const insertResult = await knex(oldTableName).insert(selectedRows);
        const copiedRows = await knex.select('*').from(oldTableName);

        const deleteResult = await knex(tableName).del();

        // Return a message or any other information based on your needs
        return {
            success: true,
            message: 'Data copied to OldJobPosting and deleted from jobsfromtelegram.',
        };
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    } finally {
        await knex.destroy();
    }
}

