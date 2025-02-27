import pandas as pd
import psycopg2

# Database connection details
DB_NAME = "noscoring"
DB_USER = "noscoring"
DB_PASSWORD = "V83f2kcVZlzZOfTJ1uUH"
DB_HOST = "ec2-52-47-66-177.eu-west-3.compute.amazonaws.com"
DB_PORT = "5432"

# Table name to export
TABLE_NAME = "user"

try:
    # Establish connection
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    print("✅ Connection successful!")

    # SQL query to fetch data
    query = f"SELECT * FROM public.{TABLE_NAME};"

    # Load data into a pandas DataFrame
    df = pd.read_sql(query, conn)

    # Export to Excel
    df.to_excel(f"{TABLE_NAME}.xlsx", index=False, engine="openpyxl")

    print(f"✅ Table '{TABLE_NAME}' exported successfully to {TABLE_NAME}.xlsx")

except psycopg2.Error as e:
    print(f"❌ Connection failed: {e}")

finally:
    if conn and not conn.closed:
        conn.close()
        print("🔒 Connection closed.")
