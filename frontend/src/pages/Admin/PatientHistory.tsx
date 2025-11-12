import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { ArrowLeft, Calendar, FileText, Plus, Eye, User, Phone, Mail, MapPin, Clock, CreditCard } from 'lucide-react';

// TypeScript interfaces for appointments (replacing patient visits)
interface Appointment {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  clinic: 'clinic_a' | 'clinic_b';
  service_required: 'general_consultation' | 'bariatric_surgery' | 'laparoscopic_surgery' | 'general_surgery' | 'metabolic_surgery';
  preferred_date: string;
  preferred_time: string;
  payment_reference: string;
  payment_proof: string | null;
  message: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_by_user_id: number | null;
  created_at: string;
  updated_at: string;
}

interface Patient {
  id: number;
  full_name: string;
  phone_number: string;
  email?: string;
}

export default function PatientHistory() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
      fetchPatientAppointments();
    }
  }, [patientId]);

  const fetchPatientData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/patients/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch patient data');
      }

      const data = await response.json();
      setPatient(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load patient data');
    }
  };

  const fetchPatientAppointments = async () => {
    try {
      setLoading(true);
      
      // Fetch user's appointment history from the backend
      const response = await fetch(`http://localhost:8000/api/v1/appointments/user/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          // User has no appointments
          setAppointments([]);
          return;
        }
        throw new Error('Failed to fetch patient appointments');
      }

      const data = await response.json();
      setAppointments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load patient appointments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-amber-100 text-amber-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getServiceName = (service: string) => {
    const serviceMap = {
      'general_consultation': 'General Consultation',
      'bariatric_surgery': 'Bariatric Surgery',
      'laparoscopic_surgery': 'Laparoscopic Surgery',
      'general_surgery': 'General Surgery',
      'metabolic_surgery': 'Metabolic Surgery'
    };
    return serviceMap[service as keyof typeof serviceMap] || service;
  };

  const getClinicName = (clinic: string) => {
    return clinic === 'clinic_a' ? 'Hameed Latif Cosmetology Centre' : 'Shalamar Hospital';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading patient appointment history...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/patients')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Patients
        </button>
      </div>

      {/* Patient Information Card */}
      {patient && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <User className="h-8 w-8 text-primary-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{patient.full_name}</h1>
              <div className="flex items-center gap-4 mt-2 text-gray-600">
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{patient.phone_number}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>{appointments.length} appointments</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate(`/admin/appointments`)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Appointment
            </button>
          </div>
        </div>
      )}

      {/* Appointment Statistics */}
      {appointments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">
              {appointments.filter(a => a.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-amber-600">
              {appointments.filter(a => a.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {appointments.filter(a => a.status === 'confirmed').length}
            </div>
            <div className="text-sm text-gray-500">Confirmed</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-600">
              {appointments.filter(a => a.status === 'cancelled').length}
            </div>
            <div className="text-sm text-gray-500">Cancelled</div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Appointment History */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Appointment History</h2>
          <p className="text-gray-600 mt-1">Complete appointment history for this patient</p>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments recorded</h3>
            <p className="text-gray-500 mb-4">This patient hasn't booked any appointments yet.</p>
            <button
              onClick={() => navigate('/admin/appointments')}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              View All Appointments
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {appointments
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((appointment) => (
              <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(appointment.preferred_date).toLocaleDateString()}</span>
                        <Clock className="h-4 w-4 ml-2" />
                        <span>{appointment.preferred_time}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-gray-700">Service: </span>
                        <span className="text-gray-900">{getServiceName(appointment.service_required)}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Clinic: </span>
                        <span className="text-gray-900 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {getClinicName(appointment.clinic)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Contact: </span>
                        <span className="text-gray-900 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {appointment.email}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Payment: </span>
                        <span className="text-gray-900 flex items-center gap-1">
                          <CreditCard className="h-3 w-3" />
                          {appointment.payment_reference}
                          {appointment.payment_proof && (
                            <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              ✓ Proof Uploaded
                            </span>
                          )}
                        </span>
                      </div>
                      {appointment.message && (
                        <div>
                          <span className="font-medium text-gray-700">Message: </span>
                          <span className="text-gray-900">{appointment.message}</span>
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        <span>Booked on: {new Date(appointment.created_at).toLocaleDateString()} at {new Date(appointment.created_at).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/appointments`)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      View in Admin
                    </button>
                    {appointment.payment_proof && (
                      <button
                        onClick={() => window.open(`http://localhost:8000/api/v1/appointments/${appointment.id}/payment-proof`, '_blank')}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <FileText className="h-4 w-4" />
                        Payment Proof
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}