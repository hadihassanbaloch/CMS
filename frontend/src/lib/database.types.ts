export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string;
          patient_name: string;
          email: string;
          phone: string;
          service: string;
          message: string | null;
          preferred_date: string;
          preferred_time: string;
          status: 'pending' | 'confirmed' | 'cancelled';
          created_at: string;
          updated_at: string;

          // ✅ Add these new columns
          payment_reference: string | null;
          payment_proof: string | null;
          clinic_id: string | null;
        };
        Insert: {
          id?: string;
          patient_name: string;
          email: string;
          phone: string;
          service: string;
          message?: string | null;
          preferred_date: string;
          preferred_time: string;
          status?: 'pending' | 'confirmed' | 'cancelled';
          created_at?: string;
          updated_at?: string;

          // ✅ Add these as well
          payment_reference?: string | null;
          payment_proof?: string | null;
          clinic_id?: string | null;
        };
        Update: {
          id?: string;
          patient_name?: string;
          email?: string;
          phone?: string;
          service?: string;
          message?: string | null;
          preferred_date?: string;
          preferred_time?: string;
          status?: 'pending' | 'confirmed' | 'cancelled';
          created_at?: string;
          updated_at?: string;

          // ✅ Add these too
          payment_reference?: string | null;
          payment_proof?: string | null;
          clinic_id?: string | null;
        };
      },
      consultation_notes: {
        Row: {
          id: string;
          appointment_id: string;
          notes: string;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          appointment_id: string;
          notes: string;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          appointment_id?: string;
          notes?: string;
          created_by?: string;
          created_at?: string;
        };
      };


    };
  };
}