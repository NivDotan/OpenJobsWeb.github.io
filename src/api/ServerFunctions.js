import { createClient } from '@supabase/supabase-js';
import Swal from 'sweetalert2';

//
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


export async function selectAllFromTable2() {
  try {
    const response = await fetch('https://vercel-serverless-functions3.vercel.app/api/getData'); // Replace with your actual Vercel URL
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Data fetched from serverless function:', data);
    return data;
  } 
  catch (error) {
    console.error('Error fetching data from serverless function:', error);
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

export async function GetStudentJuniorTAAndHaifa2() {
  try {
    const response = await fetch('https://vercel-serverless-functions3.vercel.app/api/GetStudentJuniorTAAndHaifa'); // Replace with your actual Vercel URL
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Data fetched from serverless function:', data);
    return data;
  } 
  catch (error) {
    console.error('Error fetching data from serverless function:', error);
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
            .select('Company, JobDesc, City, Link, Date');
        if (selectError) {
            console.error('Error fetching data:', selectError);
            throw selectError;
        }
        
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



export async function validatePassword(password){
    try {
        const { data, error } = await supabase
            .from('PASS')
            .select()
            .eq('PASS', password)
            .single();

        if (error || !data) {
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error validating password:', error);
        return false;
    }
}

export async function validatePassword2(password){
  try {
    const response = await fetch('https://vercel-serverless-functions3.vercel.app/api/validatePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    const result = await response.json();
    return result.isValid;
  } catch (error) {
    console.error('Error validating password:', error);
    return false;
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


export async function selectDateFromTable() {
    try {
        // Fetch rows from Supabase table
        const { data, error } = await supabase
            .from('jobsfromtelegram')
            .select('Date');

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

export async function getDistinctDate(){
    try {
        //const { data1, error1 } = await supabase.rpc('echo', { say: '👋' })  
        const { data, error } = await supabase
        .rpc('get_distinct_dates');
        console.log(data);
      if (error) {
        throw error;
      }
  
      return data;
    } catch (error) {
      console.error('Error fetching distinct values:', error);
      return [];
    }
  };


  export async function getDistinctDate2() {
    try {
      const response = await fetch('https://vercel-serverless-functions3.vercel.app/api/getDistinctDate'); // Replace with your actual Vercel URL
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Data fetched from serverless function:', data);
      return data;
    } 
    catch (error) {
      console.error('Error fetching data from serverless function:', error);
      throw error;
    }
  }

export async function CopyAndDeleteByDate(date) {
    const tableName = 'jobsfromtelegram';
    const oldTableName = 'OldJobPosting';
    

    try {
        // Step 1: Copy data to the new table
        const { data: selectedRows, error: selectError } = await supabase
            .from(tableName)
            .select('Company, JobDesc, City, Link, Date')
            .eq('Date', date);
        if (selectError) {
            console.error('Error fetching data:', selectError);
            throw selectError;
        }
        console.log(selectedRows);
        const { data: insertResult, error: insertError } = await supabase
            .from(oldTableName)
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
            .eq('Date', date);

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

export async function triggerCopyAndDeleteByDate(date) {
  try {
    const response = await fetch('https://vercel-serverless-functions3.vercel.app/api/copyAndDeleteByDate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ date })   
    });
    
    const result = await response.json();
    if (response.ok) {
      console.log('Operation successful:', result.message);
    } else {
      console.error('Error:', result.error);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

export async function get_ip() {
    try {
        // Use a third-party API to get the IP address
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) {
            throw new Error('Failed to fetch IP address');
        }
        const data = await response.json();
        const ip_address = data.ip;
        const device_info = getDeviceInfo();
        const browser = getDeviceInfo() + ", " + getBrowserAndOS();
        const last_visit = new Date().toISOString();
        console.log('last_visit:', last_visit);
        //const insertPayload = { IP_address: ipAddress };
        const payload = { ip_address: ip_address, 
                          device_info: device_info, 
                          browser_and_os: browser, 
                          last_visit: last_visit };
        
        
        const serverResponse = await fetch('https://vercel-serverless-functions3.vercel.app/api/HandlingIPaddresses', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
          });

        if (!serverResponse.ok) {
            throw new Error('Failed to insert or update IP address in the database');
        }

        const result = await serverResponse.json();
        //console.log('Database response:', result);                        

        // Insert the IP address into the database, device_info: device_info, browser_and_os: browser
        /////////const { data: insertResult, error: insertError } = await supabase
        /////////    .from('IPAddress')
        /////////    .insert({IP_address: ipAddress});
        /////////
        /////////const { data: insertResult2, error: insertError2 } = await supabase
        /////////    .from('IPAddress')
        /////////    .update({device_info: device_info, browser_and_os: browser})
        /////////    .eq('IP_address', ipAddress);
        //if (insertError) {
        //    console.error('Error inserting IP address:', insertError);
        //    throw insertError;
        //}

        //console.log('IP address inserted:', ipAddress);
        //trackUserActions();
        
    } catch (error) {
        console.error('Error fetching or inserting IP address:', error);
        throw error;
    }
}

function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    if (/Mobi|Android|iPhone|iPad|iPod/.test(userAgent)) {
      console.log('Mobile');
      return userAgent + " " + 'Mobile';
    } else if (/Tablet|iPad/.test(userAgent)) {
      return userAgent + " " + 'Tablet';
    } else {
      return userAgent + " " + 'Desktop';
    }
  }

  function getBrowserAndOS() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
  
    // Detect browser
    let browser;
    if (userAgent.includes('Firefox')) {
      browser = 'Firefox';
    } else if (userAgent.includes('Chrome')) {
      browser = 'Chrome';
    } else if (userAgent.includes('Safari')) {
      browser = 'Safari';
    } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
      browser = 'Internet Explorer';
    } else {
      browser = 'Other';
    }
  
    // Detect OS
    let os;
    if (platform.startsWith('Win')) {
      os = 'Windows';
    } else if (platform.startsWith('Mac')) {
      os = 'macOS';
    } else if (platform.startsWith('Linux')) {
      os = 'Linux';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (/iPhone|iPad|iPod/.test(userAgent)) {
      os = 'iOS';
    } else {
      os = 'Other';
    }
    //console.log(`Browser: ${browser}, OS: ${os}`);
    return `Browser: ${browser}, OS: ${os}`;
    
  }

  function trackUserActions() {
    document.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', () => {
        console.log(`Button clicked: ${button.innerText}`);
      });
    });
    }

