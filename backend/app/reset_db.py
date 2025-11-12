# app/reset_db.py
"""
Reset database script - drops all tables and recreates them.
Use this when you need to reset the database schema.
"""
import os
import sys
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy import create_engine
from app.core.db import DATABASE_URL, Base
from app.models import users, appointments  # Import all model modules
from app.startup_seed import ensure_default_admin

def reset_database():
    """Drop all tables and recreate them with current schema."""
    print("Resetting database...")
    
    # Create engine
    engine = create_engine(DATABASE_URL)
    
    # Drop all tables
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    
    # Create all tables
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    
    # Seed default admin
    print("Seeding default admin user...")
    ensure_default_admin()
    
    print("Database reset complete!")

if __name__ == "__main__":
    reset_database()