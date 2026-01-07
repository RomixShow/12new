import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
import sys
sys.path.append('/app/backend')
from pathlib import Path
from dotenv import load_dotenv
import bcrypt
import uuid
from datetime import datetime, timezone

# Load env
env_path = Path('/app/backend/.env')
load_dotenv(env_path)

async def create_admin():
    mongo_url = os.environ['MONGO_URL']
    db_name = os.environ['DB_NAME']
    
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Check if admin exists
    existing = await db.users.find_one({"username": "admin"})
    if existing:
        print("❌ Admin user already exists")
        client.close()
        return
    
    # Create admin user
    password = "admin123"  # Default password - change after first login
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    user = {
        "id": str(uuid.uuid4()),
        "username": "admin",
        "password_hash": password_hash,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user)
    print("✅ Admin user created!")
    print(f"   Username: admin")
    print(f"   Password: {password}")
    print("   ⚠️  CHANGE PASSWORD AFTER FIRST LOGIN!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(create_admin())
