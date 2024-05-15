import { createClient } from '@supabase/supabase-js';


const supabaseUrl="https://opnfoozwkdnolacljfbo.supabase.co"
const supabaseKey="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wbmZvb3p3a2Rub2xhY2xqZmJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk1NjUzNjUsImV4cCI6MjAyNTE0MTM2NX0.D7pAw1ZVlZ9bkC_16HSHkrL5MinsPHPFTaaj9uV1cwI"
//const supabaseUrl = await process.env.REACT_APP_API_URL;
//const supabaseKey = process.env.REACT_APP_API_KEY;
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
// It's copying the data from the original table and then deleting the data from the original table.
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
        debug.print("Try");
        const { data: insertResult, error: insertError } = await supabase
            .from(oldTableName)
            //.upsert(selectedRows);
            .insert(selectedRows);

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
            .delete()
            .neq('City', '');

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
        return rows;
    } catch (error) {
        console.error('Error:', error);
        //res.status(500).send('Internal Server Error');
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



export async function CopyAndDelete2() {
    // Set up the database connection
    const supabase = createClient(
      'https://your-project-url.supabase.co',
      'your-supabase-key'
    );
    // Define the table names
    const tableName = 'jobsfromtelegram';
    const oldTableName = 'OldJobPosting';
  
    try {
      // Step 1: Copy data to the new table
      // Select the columns to copy from the original table
      const { data: selectedRows, error: selectError } = await supabase
        .from(tableName)
        .select('Company, JobDesc, City, Link, Date');
      if (selectError) {
        throw selectError;
      }
      // Insert the selected rows into the new table
      const { error: insertError } = await supabase
        .from(oldTableName)
        .insert(selectedRows);
      if (insertError) {
        throw insertError;
      }
      // Select all rows from the new table
      const { data: copiedRows, error: selectAllError } = await supabase
        .from(oldTableName)
        .select('*');
      if (selectAllError) {
        throw selectAllError;
      }
      // Delete the copied rows from the original table
      const { error: deleteError } = await supabase.from(tableName).delete();
      if (deleteError) {
        throw deleteError;
      }
  
      // Return a message or any other information based on your needs
      return {
        success: true,
        message: 'Data copied to OldJobPosting and deleted from jobsfromtelegram.',
      };
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    } finally {
      // Destroy the database connection
      await supabase.disconnect();
    }
  }