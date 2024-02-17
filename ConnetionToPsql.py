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

def InsertIntoTable(conn, cur, Table, Values):
    JobDesc = Values["Job Description"]
    Company = Values["Company Name"]
    City = Values["Location"]
    Link = Values["Apply Link"]
    cur.execute(f"INSERT INTO public.{Table} (Company, JobDesc, City, Link) 
                VALUES ({JobDesc}, {Company}, {City}, {Link});")
    conn.commit()
    cur.close()
    conn.close()
    
def InsertTOTableMain(Values):
    conn = connectionTODB()
    cur = conn.cursor()
    table = "jobsfromtelegram"
    InsertIntoTable(conn, cur, table, Values)
    #SelectAllTable(conn, cur, "jobsfromtelegram")

