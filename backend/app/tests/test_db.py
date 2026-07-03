from app.database import engine
from sqlalchemy import text

try:
    # Connect to the database
    with engine.connect() as connection:
        print("✅ Database connected successfully!")

        # Execute a simple SQL query
        result = connection.execute(text("SELECT version();"))

        print("\nPostgreSQL Version:")
        print(result.fetchone()[0])

except Exception as e:
    print("❌ Database connection failed!")
    print(f"Error: {e}")