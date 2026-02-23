import sqlite3
import shutil
import os
from datetime import datetime

DATABASE_PATH = 'users.db'
BACKUP_DIR = 'database'

def backup_database():
    if not os.path.exists(DATABASE_PATH):
        print(f"[ERROR] Database file not found: {DATABASE_PATH}")
        return False
    
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)
        print(f"[INFO] Created backup directory: {BACKUP_DIR}")
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_filename = f"users_backup_{timestamp}.db"
    backup_path = os.path.join(BACKUP_DIR, backup_filename)
    
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        conn.close()
        
        shutil.copy2(DATABASE_PATH, backup_path)
        
        backup_size = os.path.getsize(backup_path)
        print(f"[SUCCESS] Backup created: {backup_path}")
        print(f"[INFO] Backup size: {backup_size} bytes")
        print(f"[INFO] Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        return True
        
    except Exception as e:
        print(f"[ERROR] Backup failed: {str(e)}")
        return False

if __name__ == '__main__':
    print("=" * 50)
    print("Database Backup Script")
    print("=" * 50)
    backup_database()
    print("=" * 50)
