import psycopg2
import supabase
from dotenv import load_dotenv
#https://www.datacamp.com/tutorial/tutorial-postgresql-pythonv
#https://stackoverflow.com/questions/40216311/reading-in-environment-variables-from-an-environment-file
#https://stackoverflow.com/questions/41546883/what-is-the-use-of-python-dotenv
def connectionTODB():
    supabase_url = "https://opnfoozwkdnolacljfbo.supabase.co"
    supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wbmZvb3p3a2Rub2xhY2xqZmJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk1NjUzNjUsImV4cCI6MjAyNTE0MTM2NX0.D7pAw1ZVlZ9bkC_16HSHkrL5MinsPHPFTaaj9uV1cwI"
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
