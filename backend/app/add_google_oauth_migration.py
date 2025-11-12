"""
Quick Google OAuth Migration Script
Run this to add Google OAuth support to your existing database

Usage: python add_google_oauth_migration.py
"""

import sqlite3
import os

def run_google_oauth_migration():
    """
    Add Google OAuth fields to existing User table
    """
    # Find database file
    db_path = os.path.join(os.path.dirname(__file__), "..", "cms.db")
    
    if not os.path.exists(db_path):
        print("❌ Database not found. Start the FastAPI server first to create the database.")
        return False
    
    print("🚀 Starting Google OAuth migration...")
    print(f"Database: {db_path}")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check current table structure
        cursor.execute("PRAGMA table_info(users)")
        existing_columns = [column[1] for column in cursor.fetchall()]
        print(f"Existing columns: {existing_columns}")
        
        changes_made = []
        
        # Add google_id column
        if 'google_id' not in existing_columns:
            cursor.execute("ALTER TABLE users ADD COLUMN google_id VARCHAR(255)")
            changes_made.append("Added google_id column")
            
            # Create unique index for google_id
            cursor.execute("""
                CREATE UNIQUE INDEX idx_users_google_id_unique 
                ON users(google_id) 
                WHERE google_id IS NOT NULL
            """)
            changes_made.append("Created unique index for google_id")
        else:
            print("✓ google_id column already exists")
        
        # Add profile_picture column
        if 'profile_picture' not in existing_columns:
            cursor.execute("ALTER TABLE users ADD COLUMN profile_picture VARCHAR(500)")
            changes_made.append("Added profile_picture column")
        else:
            print("✓ profile_picture column already exists")
        
        # Create performance indexes
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id)")
        changes_made.append("Created performance indexes")
        
        # Commit changes
        conn.commit()
        
        # Show results
        if changes_made:
            print("\n✅ Migration completed successfully!")
            for change in changes_made:
                print(f"  • {change}")
        else:
            print("\n✅ Database already up to date!")
        
        # Verify final structure
        cursor.execute("PRAGMA table_info(users)")
        final_columns = [column[1] for column in cursor.fetchall()]
        print(f"\nFinal table structure: {final_columns}")
        
        return True
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        conn.rollback()
        return False
        
    finally:
        conn.close()

if __name__ == "__main__":
    success = run_google_oauth_migration()
    if success:
        print("\n🎉 Ready for Google OAuth!")
    else:
        print("\n💥 Migration failed. Check errors above.")