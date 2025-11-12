"""
Payment Proof Naming System Test

This script demonstrates the new enhanced naming system for payment proof files.
"""

from datetime import datetime
import uuid

def generate_new_filename(user_id, original_filename):
    """Generate a new filename using the enhanced naming convention."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    session_id = str(uuid.uuid4())[:8]
    file_extension = original_filename.split('.')[-1] if '.' in original_filename else ''
    
    if file_extension:
        file_extension = f".{file_extension}"
    
    if user_id:
        return f"user{user_id}_{timestamp}_{session_id}_appointment_proof{file_extension}"
    else:
        return f"guest_{timestamp}_{session_id}_appointment_proof{file_extension}"

def generate_download_filename(user_id, patient_name, appointment_id, appointment_date, file_extension):
    """Generate a descriptive download filename for admins."""
    clean_name = patient_name.replace(' ', '_').replace('.', '_')
    return f"PaymentProof_User{user_id or 'Guest'}_{clean_name}_Appointment{appointment_id}_{appointment_date}{file_extension}"

def generate_session_reference(user_id):
    """Generate a session-specific payment reference."""
    timestamp = datetime.now().isoformat().replace(':', '-')
    return f"ONLINE_BOOKING_{user_id}_{timestamp}"

# Test Examples
print("=== Enhanced Payment Proof Naming System ===\n")

print("1. File Storage Examples:")
print("   Original:", "payment_receipt.jpg")
print("   New User 1:", generate_new_filename(1, "payment_receipt.jpg"))
print("   New User 25:", generate_new_filename(25, "bank_transfer.png"))
print("   Guest User:", generate_new_filename(None, "receipt.pdf"))
print()

print("2. Admin Download Examples:")
print("   User 1:", generate_download_filename(1, "John Doe", 123, "2025-11-11", ".jpg"))
print("   User 5:", generate_download_filename(5, "Sarah Ahmed", 456, "2025-11-11", ".pdf"))
print()

print("3. Session Reference Examples:")
print("   User 1:", generate_session_reference(1))
print("   User 10:", generate_session_reference(10))
print()

print("4. File Organization Structure:")
print("   uploads/payment_proofs/")
print("   ├── user_1/")
print("   │   ├── user1_20251111_143052_a8b9c3d2_appointment_proof.jpg")
print("   │   └── user1_20251111_150230_f2e4d1a5_appointment_proof.pdf")
print("   ├── user_2/")
print("   │   └── user2_20251111_144521_b7c8e9f1_appointment_proof.jpg")
print("   └── [Legacy files - backward compatible]")
print("       ├── 669bd446-d99c-4910-804b-32da2b1bda34.jpg")
print("       └── 04a90226-d9db-467e-9a3b-5ae58555bf15.jpg")
print()

print("✅ Benefits:")
print("   • User isolation with separate directories")
print("   • Session tracking with unique identifiers")
print("   • Timestamp tracking for audit trails")
print("   • Descriptive names for admin downloads")
print("   • Backward compatibility with existing files")
print("   • Prevention of filename collisions")