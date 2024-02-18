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
    cur.execute(f"INSERT INTO public.{Table} (Company, JobDesc, City, Date, Link) VALUES ( {Values["Job Description"]}, {Values["Company Name"]}, {Values["Location"]}, {Values["Date"].strftime("%Y-%m-%d")}, {Values["Link"]});")
    conn.commit()
    cur.close()
    conn.close()
    
def InsertTOTableMain(Values):
    conn = connectionTODB()
    cur = conn.cursor()
    table = "jobsfromtelegram"
    InsertIntoTable(conn, cur, table, Values)
    #SelectAllTable(conn, cur, "jobsfromtelegram")

#{'Date': datetime.datetime(2024, 2, 18, 0, 0), 'Job Description': 'Student Software Engineer', 'Company Name': 'Genesys', 
#    'Location': 'Tel Aviv, Israel', 'Link': 'https://genesys.wd1.myworkdayjobs.com/Genesys/job/Tel-Aviv-Israel/Student-Software-Engineer_JR103659'}