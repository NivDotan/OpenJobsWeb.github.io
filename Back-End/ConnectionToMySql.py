import mysql.connector
from mysql.connector import errorcode

def connectionTODB():
    try:
        conn = mysql.connector.connect(
            user="if0_36071616",
            password="knhmgHmWz6o",
            host="sql305.infinityfree.com",
            database="if0_36071616_jobseekingdb", 
            port = 3306
        )
        return conn

    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Error: Access denied. Check username and password.")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print("Error: Database does not exist.")
        else:
            print(f"Error: {err}")

def SelectAllTable(conn, cur, Table):
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM {Table};")
    rows = cur.fetchall()
    conn.commit()
    conn.close()
    for row in rows:
        print(row)

def insert_into_jobs_table(conn, table_name, values):
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
            INSERT INTO {table_name} (Company, JobDesc, City, Date, Link)
            VALUES ('{company_name}', '{job_desc}', '{city}', '{date_str}', '{link}');
        """

        # Execute the query
        cur.execute(query)

        # Commit the transaction
        conn.commit()

    except mysql.connector.Error as e:
        print(f"Error inserting into {table_name}: {e}")
        conn.rollback()
        raise

    finally:
        cur.close()

def InsertTOTableMain(values):
    conn = connectionTODB()
    table = "jobsfromtelegram"
    insert_into_jobs_table(conn, table, values)

conn = connectionTODB()