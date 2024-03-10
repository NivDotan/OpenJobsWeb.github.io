import psycopg2
import supabase
import os
from os.path import join, dirname
from dotenv import load_dotenv

def connectionTODB():
    dotenv_path = join(dirname(__file__), '.env')
    load_dotenv(dotenv_path)
    supabase_url = os.environ.get("supabaseUrl")
    supabase_key = os.environ.get("supabaseKey")
    conn = supabase.create_client(supabase_url, supabase_key)
    
    return conn

def SelectAllTable(conn, Table):
    response = conn.table(Table).select("*").execute()
    print(response)
    for row in response:
        print(row)


def insert_into_jobs_table(conn, table_name="jobsfromtelegram", values=None):
    supabase_client = conn

    try:
        # Ensure values are properly formatted
        company_name = values["Company Name"].replace("'", "''")  # Escape single quotes
        job_desc = values["Job Description"].replace("'", "''")  
        city = values["Location"].replace("'", "''")  
        date_str = values["Date"].strftime('%Y-%m-%d')
        link = values["Link"].replace("'", "''")  
        
        # Insert data into the Supabase table
        response = supabase_client.table(table_name).upsert([{
            "Company": company_name,
            "JobDesc": job_desc,
            "City": city,
            "Date": date_str,
            "Link": link
        }]).execute()
       
        # Get the inserted primary key
        #inserted_id = response.data[0]["jobsfromtelegram"]["key"]

        #return inserted_id

    except Exception as e:
        print(f"Error inserting into {table_name}: {e}")
        raise

def InsertTOTableMain(conn, Values):
    #conn = connectionTODB()
    table = "jobsfromtelegram"
    insert_into_jobs_table(conn, table, Values)
