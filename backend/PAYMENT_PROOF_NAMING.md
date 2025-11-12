# Payment Proof File Naming Convention

## Overview
This document describes the enhanced file naming system for payment proof uploads to prevent mixing of files between users and sessions.

## File Organization Structure
```
uploads/
└── payment_proofs/
    ├── user_1/
    │   ├── user1_20251111_143052_a8b9c3d2_appointment_proof.jpg
    │   └── user1_20251111_150230_f2e4d1a5_appointment_proof.pdf
    ├── user_2/
    │   └── user2_20251111_144521_b7c8e9f1_appointment_proof.jpg
    └── [Legacy files for backward compatibility]
        ├── 04a90226-d9db-467e-9a3b-5ae58555bf15.jpg
        └── ...
```

## Filename Format
**Pattern:** `user{userId}_{timestamp}_{sessionId}_appointment_proof{extension}`

### Components:
1. **User ID**: `user{userId}` - Identifies the user who uploaded the file
2. **Timestamp**: `YYYYMMDD_HHMMSS` - When the file was uploaded
3. **Session ID**: `8-character UUID` - Unique identifier for the upload session
4. **File Type**: `appointment_proof` - Describes the file purpose
5. **Extension**: Original file extension (`.jpg`, `.pdf`, `.png`, etc.)

### Examples:
- `user1_20251111_143052_a8b9c3d2_appointment_proof.jpg`
- `user25_20251111_150230_f2e4d1a5_appointment_proof.pdf`
- `guest_20251111_144521_b7c8e9f1_appointment_proof.png` (for anonymous users)

## Download Filename Format
When admins download payment proofs, the filename includes additional context:

**Pattern:** `PaymentProof_User{userId}_Appointment{appointmentId}_{date}{extension}`

### Example:
`PaymentProof_User1_Appointment123_2025-11-11.jpg`

## Benefits
1. **User Isolation**: Files are separated by user directories
2. **Session Tracking**: Each upload session has a unique identifier
3. **Timestamp Tracking**: Easy to identify when files were uploaded
4. **Descriptive Names**: Clear purpose and context for each file
5. **Admin Friendly**: Download names include patient and appointment context
6. **Backward Compatibility**: Legacy files remain accessible

## Frontend Integration
The frontend automatically generates session-specific payment references:
- Format: `ONLINE_BOOKING_{userId}_{timestamp}`
- Example: `ONLINE_BOOKING_1_2025-11-11T14-30-52-123Z`

## Security Features
- User-specific directories prevent cross-user file access
- Authentication required for file viewing and downloading
- Session tracking helps with audit trails
- Unique identifiers prevent filename collisions