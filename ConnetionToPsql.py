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

def main():
    conn = connectionTODB()
    cur = conn.cursor()
    SelectAllTable(conn, cur, "jobsfromtelegram")

if __name__ == '__main__':
    main()