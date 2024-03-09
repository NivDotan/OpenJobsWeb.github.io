import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = "https://opnfoozwkdnolacljfbo.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wbmZvb3p3a2Rub2xhY2xqZmJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk1NjUzNjUsImV4cCI6MjAyNTE0MTM2NX0.D7pAw1ZVlZ9bkC_16HSHkrL5MinsPHPFTaaj9uV1cwI";
const supabase = createClient(supabaseUrl, supabaseKey);

function convertDateFormat(originalDate) {
    const date = new Date(originalDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(2);
    return `${day}/${month}/${year}`;
}

export async function selectAllFromTable() {
    try {
        // Fetch rows from Supabase table
        const { data, error } = await supabase
            .from('jobsfromtelegram')
            .select('*');

        if (error) {
            console.error('Error fetching data:', error);
            throw error;
        }

        // Convert date format in each row
        const formattedRows = data.map(row => ({
            ...row,
            Date: convertDateFormat(row.Date),
        }));

        return formattedRows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
}

export async function getCitiesFromDatabase(tableName) {
    try {
        // Fetch distinct cities from Supabase table
        const { data, error } = await supabase
            .from(tableName)
            .select('City')
            .distinct();

        if (error) {
            console.error('Error fetching data:', error);
            throw error;
        }

        return data.map(row => row.City);
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
}

export async function GetStudentJuniorTAAndHaifa() {
    try {
        // Fetch rows from Supabase table with the specified conditions
        const tableName = 'jobsfromtelegram';
        const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .or('JobDesc.ilike.%Junior%,JobDesc.ilike.%Student%')
        .or('City.ilike.%Tel%,City.ilike.%Haifa%,City.ilike.%HQ%,City.ilike.%IL%,City.ilike.%Israel%,City.ilike.%Yokneam%');

        if (error) {
            console.error('Error executing query:', error);
            throw error;
        }

        // Convert date format in each row
        const formattedRows = data.map(row => ({
            ...row,
            Date: convertDateFormat(row.Date),
        }));

        return formattedRows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
}

export async function CopyAndDelete() {
    const tableName = 'jobsfromtelegram';
    const oldTableName = 'OldJobPosting';

    try {
        // Step 1: Copy data to the new table
        const { data: selectedRows, error: selectError } = await supabase
            .from(tableName)
            .select('Company', 'JobDesc', 'City', 'Link', 'Date');

        if (selectError) {
            console.error('Error fetching data:', selectError);
            throw selectError;
        }

        const { data: insertResult, error: insertError } = await supabase
            .from(oldTableName)
            .upsert(selectedRows);

        if (insertError) {
            console.error('Error inserting into OldJobPosting:', insertError);
            throw insertError;
        }

        const { data: copiedRows, error: copyError } = await supabase
            .from(oldTableName)
            .select('*');

        if (copyError) {
            console.error('Error fetching copied data:', copyError);
            throw copyError;
        }

        // Step 2: Delete data from the original table
        const { data: deleteResult, error: deleteError } = await supabase
            .from(tableName)
            .delete();

        if (deleteError) {
            console.error('Error deleting data from jobsfromtelegram:', deleteError);
            throw deleteError;
        }

        // Return a message or any other information based on your needs
        return {
            success: true,
            message: 'Data copied to OldJobPosting and deleted from jobsfromtelegram.',
        };
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


export async function GetStudentJuniorTAAndHaifaJSON() {
    try {
        const CheckIfExistTheTable = await getAllPathsAndCheckTableExistence();
        const tableName = 'jobsfromtelegram';
        const rows = await GetStudentJuniorTAAndHaifa(tableName);
        //Delete the table and create a new table
        //if (CheckIfExistTheTable){
        //    recreateTable();
        //}
        ////Only create a new table
        //else{
        //    CreateTable2();
        //}
        
        return rows;
    } catch (error) {
        console.error('Error:', error);
        //res.status(500).send('Internal Server Error');
    }
}




async function checkAndCreateTable() {
    // Check if the table exists
    const tableName = "TmpFilterTable";
    const { data: tableExists, error } = await supabase
        .select ('has_table','TmpFilterTable');
    if (error) {
        console.error('Error checking table existence:', error);
        throw error;
    }

    if (tableExists) {
        // Table exists, delete it
        const { data: deleteResult, error: deleteError } = await supabase
            .rpc('delete_table', { table_name: tableName });

        if (deleteError) {
            console.error('Error deleting table:', deleteError);
            throw deleteError;
        }

        console.log('Table deleted:', deleteResult);

        // Create a new table
        const { data: createResult, error: createError } = await supabase
            .rpc('create_table', { table_name: tableName });

        if (createError) {
            console.error('Error creating table:', createError);
            throw createError;
        }

        console.log('Table created:', createResult);
    } else {
        // Table doesn't exist, create it
        const { data: createResult, error: createError } = await supabase
            .rpc('create_table', { table_name: tableName });

        if (createError) {
            console.error('Error creating table:', createError);
            throw createError;
        }

        console.log('Table created:', createResult);
    }
}



async function getAllPathsAndCheckTableExistence() {
    try {
        const { data, error } = await supabase
            .from('')
            .select('paths');

        if (error) {
            console.log('Error fetching paths:', error);
            return [];
        }

        const paths = data.paths;

        if (paths) {
            console.log('All Paths:');
            Object.keys(paths).forEach(path => {
                console.log(`- ${path}`);
            });

            // Check if the table "TmpJobs" exists
            const tableExists = paths['/TmpJobsPosting'] !== undefined;
            console.log(`Table "TmpJobsPosting" exists: ${tableExists}`);
            return tableExists;
            //return Object.keys(paths);
        } else {
            console.log('No paths found.');
            return [];
        }
    } catch (error) {
        console.log('Unexpected error:', error);
        return [];
    }
}



async function CreateTable() {
    const tableName = 'TmpJobsPosting';
    const newTableName = 'jobsfromtelegram';

    try {
        // Step 1: Create a new table with the same structure as JobsPosting
        const createResult = await supabase.rpc('create_table_like', {
            new_table_name: tableName,
            source_table_name: newTableName,
        });

        // Return a message or any other information based on your needs
        return {
            success: true,
            message: 'Table recreated successfully.',
        };
    } catch (error) {
        console.error('Error recreating table:', error);
        throw error;
    }
}


async function CreateTable2() {
    const { data, error } = await supabase.from('jobsfromtelegram').select('*')
    if (error) return console.log('Error fetching posts:', error.message)
  
    if (data.length === 0) {
      const { error } = await supabase.from('jobsfromtelegram').create({
        id: 'serial primary key',
        title: 'text not null',
        body: 'text not null',
        embedding: 'vector(384)'
      })
      if (error) return console.log('Error creating posts table:', error.message)
  
      console.log('Posts table created successfully!')
    } else {
      console.log('Posts table already exists.')
    }
  }
