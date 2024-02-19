import psycopg2

#https://www.datacamp.com/tutorial/tutorial-postgresql-pythonv


def connectionTODB():
    conn = psycopg2.connect(database = "JobSeekingDB", 
                        user = "postgres", 
                        host= 'localhost',
                        password = "1399",
                        port = 5432)
    return conn

def SelectAllTable(conn, cur, Table):
    cur.execute(f"SELECT * FROM public.{Table};")
    rows = cur.fetchall()
    conn.commit()
    conn.close()
    for row in rows:
        print(row)


def insert_into_jobs_table(table_name= "jobsfromtelegram", values = None):
    conn = connectionTODB()
    cur = conn.cursor()

    try:
        # Ensure values are properly formatted
        company_name = values["Company Name"].replace("'", "''")  # Escape single quotes
        job_desc = values["Job Description"].replace("'", "''")  
        city = values["Location"].replace("'", "''")  
        date_str = values["Date"].strftime('%Y-%m-%d')
        link = values["Link"].replace("'", "''")  

        # Insert query
        query = f"""
            INSERT INTO public.{table_name} ("Company", "JobDesc", "City", "Date", "Link")
            VALUES ('{company_name}', '{job_desc}', '{city}', '{date_str}', '{link}')
            RETURNING "jobsfromtelegram"."key";  -- Assuming 'id' is the name of the primary key column
        """

        # Execute the query
        cur.execute(query)

        # Get the inserted primary key
        inserted_id = cur.fetchone()[0]

        # Commit the transaction
        conn.commit()

        return inserted_id

    except psycopg2.Error as e:
        print(f"Error inserting into {table_name}: {e}")
        conn.rollback()
        raise

    finally:
        cur.close()


def InsertTOTableMain(Values):
    conn = connectionTODB()
    table = "jobsfromtelegram"
    insert_into_jobs_table(conn, table, Values)
