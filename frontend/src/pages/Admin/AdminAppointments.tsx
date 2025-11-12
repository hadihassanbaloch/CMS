import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/useAuth';
import { Calendar, User, Clock, Eye, RefreshCw } from 'lucide-react';

// TypeScript interfaces matching backend schema
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

type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export default function AdminAppointments() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showAllTimeModal, setShowAllTimeModal] = useState(false);
  const [paymentProofModal, setPaymentProofModal] = useState<{ show: boolean; url: string; appointmentId: number }>({ 
    show: false, 
    url: '', 
    appointmentId: 0 
  });

  // Fetch appointments from backend
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:8000/api/v1/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      setAppointments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update appointment status
  const updateAppointmentStatus = async (appointmentId: number, newStatus: AppointmentStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update appointment status');
      }

      // Refresh appointments
      fetchAppointments();
    } catch (err: any) {
      setError(err.message || 'Failed to update appointment');
      console.error('Error updating appointment:', err);
    }
  };

  // Handle payment proof viewing
  const viewPaymentProof = async (appointmentId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/appointments/${appointmentId}/payment-proof`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          alert('Payment proof not found');
        } else {
          throw new Error('Failed to load payment proof');
        }
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      setPaymentProofModal({ show: true, url, appointmentId });
    } catch (error) {
      console.error('Error loading payment proof:', error);
      alert('Failed to load payment proof. Please try again.');
    }
  };

  const closePaymentProofModal = () => {
    if (paymentProofModal.url) {
      window.URL.revokeObjectURL(paymentProofModal.url);
    }
    setPaymentProofModal({ show: false, url: '', appointmentId: 0 });
  };

  // Helper functions
  const getClinicName = (clinic: string) => {
    return clinic === 'clinic_a' ? 'Hameed Latif Cosmetology Centre' : 'Shalamar Hospital';
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

  // Filter appointments into sections
  const pendingAppointments = appointments.filter(appointment => appointment.status === 'pending');
  const completedAppointments = appointments.filter(appointment => appointment.status === 'completed');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="bg-[color:var(--color-cream-100)] min-h-screen p-6 animate-[fade-in_0.5s_ease-in-out]">
      <div className="w-full mx-auto flex flex-col gap-6">
        {/* Header with Refresh Button */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[color:var(--color-dark-900)]">Appointments Management</h1>
              <p className="mt-1 text-gray-600">Manage and track all appointment requests</p>
            </div>
            <button
              onClick={fetchAppointments}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[color:var(--color-primary-600)] text-white rounded-lg hover:bg-[color:var(--color-primary-700)] transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Main Content - Side by Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Stats Cards */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 h-[500px] flex flex-col">
              <h2 className="text-xl font-semibold text-[color:var(--color-dark-900)] mb-4">Overview Statistics</h2>
              <div className="flex-1 flex flex-col justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg transition-transform duration-200 hover:scale-105">
                    <div className="text-2xl font-bold text-gray-900">{appointments.length}</div>
                    <div className="text-sm text-gray-500">Total Appointments</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg transition-transform duration-200 hover:scale-105">
                    <div className="text-2xl font-bold text-[color:var(--color-primary-600)]">
                      {appointments.filter(a => a.status === 'pending').length}
                    </div>
                    <div className="text-sm text-gray-500">Pending</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg transition-transform duration-200 hover:scale-105">
                    <div className="text-2xl font-bold text-green-600">
                      {appointments.filter(a => a.status === 'confirmed').length}
                    </div>
                    <div className="text-sm text-gray-500">Confirmed</div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg transition-transform duration-200 hover:scale-105">
                    <div className="text-2xl font-bold text-green-700">
                      {appointments.filter(a => a.status === 'completed').length}
                    </div>
                    <div className="text-sm text-gray-500">Completed</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg transition-transform duration-200 hover:scale-105">
                    <div className="text-2xl font-bold text-red-600">
                      {appointments.filter(a => a.status === 'cancelled').length}
                    </div>
                    <div className="text-sm text-gray-500">Cancelled Appointments</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Latest Appointments */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm h-[500px] flex flex-col">
              <div className="bg-gradient-to-br from-[color:var(--color-primary-500)] to-[color:var(--color-primary-600)] text-white p-6 rounded-t-lg flex-shrink-0">
                <h2 className="text-xl font-semibold flex items-center gap-3">Latest Appointments</h2>
                <p className="mt-2 opacity-90">Pending appointment requests ({pendingAppointments.length} total)</p>
              </div>

              <div className="bg-white rounded-b-lg flex-1 overflow-hidden flex flex-col">
                {pendingAppointments.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-center p-12">
                    <div>
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-[color:var(--color-dark-900)] mb-2">No pending appointments</h3>
                      <p className="text-gray-500">All appointments have been processed.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-hidden">
                    <div className="h-full overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-br from-[color:var(--color-cream-100)] to-gray-50 border-b-2 border-[color:var(--color-primary-500)] sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[color:var(--color-dark-900)] uppercase tracking-wider">Patient</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[color:var(--color-dark-900)] uppercase tracking-wider">Date & Time</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[color:var(--color-dark-900)] uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[color:var(--color-dark-900)] uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {pendingAppointments.map((appointment) => (
                            <tr key={appointment.id} className="transition-colors duration-200 hover:bg-[color:var(--color-primary-50)]">
                              <td className="px-4 py-3 text-sm text-[color:var(--color-dark-900)]">
                                <div className="flex items-center">
                                  <User className="h-4 w-4 mr-2 text-gray-400" />
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {appointment.full_name}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-[color:var(--color-dark-900)]">
                                <div className="flex flex-col text-xs text-gray-900">
                                  <span className="flex items-center">
                                    <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                                    {appointment.preferred_date}
                                  </span>
                                  <span className="flex items-center mt-1">
                                    <Clock className="h-3 w-3 text-gray-400 mr-1" />
                                    {appointment.preferred_time}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-[color:var(--color-dark-900)]">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full uppercase tracking-wide ${
                                  appointment.status === 'pending' 
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                    : appointment.status === 'confirmed'
                                    ? 'bg-[color:var(--color-primary-100)] text-[color:var(--color-primary-700)] border border-[color:var(--color-primary-500)]'
                                    : appointment.status === 'completed'
                                    ? 'bg-green-100 text-green-800 border border-green-500'
                                    : 'bg-red-100 text-red-800 border border-red-500'
                                }`}>
                                  {appointment.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-[color:var(--color-dark-900)]">
                                <div className="flex flex-col space-y-1">
                                  <select
                                    value={appointment.status}
                                    onChange={(e) => updateAppointmentStatus(appointment.id, e.target.value as AppointmentStatus)}
                                    className="border border-gray-300 rounded px-2 py-1 text-xs bg-white cursor-pointer transition-all duration-200 focus:outline-none focus:border-[color:var(--color-primary-500)] focus:ring-1 focus:ring-[color:var(--color-primary-500)]/20"
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                  <button
                                    onClick={() => setSelectedAppointment(appointment)}
                                    className="bg-[color:var(--color-primary-50)] text-[color:var(--color-primary-700)] px-2 py-1 text-xs rounded font-medium inline-flex items-center justify-center gap-1 transition-all duration-200 hover:bg-[color:var(--color-primary-100)] hover:text-[color:var(--color-primary-800)]"
                                  >
                                    <Eye className="h-3 w-3" />
                                    View
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* All Time Appointments Section - Modal Trigger */}
        <div className="bg-white rounded-lg shadow-sm">
          <div 
            className="bg-gradient-to-br from-[color:var(--color-cream-100)] to-gray-50 p-6 rounded-lg border-2 border-[color:var(--color-primary-500)] cursor-pointer hover:from-[color:var(--color-cream-200)] hover:to-gray-100 transition-all duration-200"
            onClick={() => setShowAllTimeModal(true)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[color:var(--color-dark-900)]">All Time Appointments</h2>
                <p className="mt-1 text-gray-600">
                  View all completed appointments ({completedAppointments.length} total) - 
                  <span className="text-[color:var(--color-primary-600)] font-medium ml-1">
                    Click to view all appointments
                  </span>
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{completedAppointments.length}</div>
                  <div className="text-sm text-gray-500">Completed</div>
                </div>
                <div className="text-[color:var(--color-primary-600)]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Time Appointments Modal */}
        {showAllTimeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-[fade-in_0.3s_ease-in-out]">
            <div className="bg-white rounded-lg w-full max-w-7xl h-[90vh] flex flex-col shadow-2xl">
              <div className="bg-gradient-to-br from-[color:var(--color-primary-500)] to-[color:var(--color-primary-600)] text-white p-6 rounded-t-lg flex-shrink-0">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-semibold">All Time Appointments</h3>
                    <p className="mt-1 opacity-90">Complete history of all appointments ({appointments.length} total)</p>
                  </div>
                  <button
                    onClick={() => setShowAllTimeModal(false)}
                    className="text-white hover:text-gray-200 text-2xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-hidden bg-white rounded-b-lg">
                {appointments.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-[color:var(--color-dark-900)] mb-2">No appointments found</h3>
                      <p className="text-gray-500">Appointments will appear here when they are created.</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Patient Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Service
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {appointments
                          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                          .map((appointment) => (
                          <tr key={appointment.id} className="transition-colors duration-200 hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-3 text-gray-400" />
                                <div className="text-sm font-medium text-gray-900">
                                  {appointment.full_name}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {getServiceName(appointment.service_required)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col">
                                <div className="flex items-center text-sm text-gray-900">
                                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                  <span>{appointment.preferred_date}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                  <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                  <span>{appointment.preferred_time}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full uppercase tracking-wide ${
                                appointment.status === 'pending' 
                                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                  : appointment.status === 'confirmed'
                                  ? 'bg-[color:var(--color-primary-100)] text-[color:var(--color-primary-700)] border border-[color:var(--color-primary-500)]'
                                  : appointment.status === 'completed'
                                  ? 'bg-green-100 text-green-800 border border-green-500'
                                  : 'bg-red-100 text-red-800 border border-red-500'
                              }`}>
                                {appointment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {new Date(appointment.created_at).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(appointment.created_at).toLocaleTimeString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => setSelectedAppointment(appointment)}
                                className="bg-[color:var(--color-primary-50)] text-[color:var(--color-primary-700)] px-3 py-1 text-xs rounded-md font-medium inline-flex items-center gap-1 transition-all duration-200 hover:bg-[color:var(--color-primary-100)] hover:text-[color:var(--color-primary-800)]"
                              >
                                <Eye className="h-3 w-3" />
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Appointment Details Modal */}
        {selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-[fade-in_0.3s_ease-in-out]">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="bg-gradient-to-br from-[color:var(--color-primary-500)] to-[color:var(--color-primary-600)] text-white p-6 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    Appointment Details - {selectedAppointment.full_name}
                  </h3>
                  <button
                    onClick={() => setSelectedAppointment(null)}
                    className="text-white hover:text-gray-200 text-xl"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-b-lg p-6 space-y-6">
                {/* Patient Information Section */}
                <div className="rounded-lg p-4 bg-[color:var(--color-cream-100)]">
                  <h4 className="text-md font-semibold mb-3 text-[color:var(--color-dark-900)]">Patient Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Full Name</label>
                      <div className="mt-1 text-sm text-[color:var(--color-dark-900)]">{selectedAppointment.full_name}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Phone</label>
                      <div className="mt-1 text-sm text-gray-900">{selectedAppointment.phone}</div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-600">Email</label>
                      <div className="mt-1 text-sm text-gray-900">{selectedAppointment.email}</div>
                    </div>
                  </div>
                </div>

                {/* Appointment Details Section */}
                <div className="bg-[color:var(--color-primary-50)] rounded-lg p-4">
                  <h4 className="text-md font-semibold text-[color:var(--color-dark-900)] mb-3">Appointment Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Clinic</label>
                      <div className="mt-1 text-sm text-gray-900">{getClinicName(selectedAppointment.clinic)}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Service</label>
                      <div className="mt-1 text-sm text-gray-900">{getServiceName(selectedAppointment.service_required)}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Preferred Date</label>
                      <div className="mt-1 text-sm text-gray-900">{selectedAppointment.preferred_date}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Preferred Time</label>
                      <div className="mt-1 text-sm text-gray-900">{selectedAppointment.preferred_time}</div>
                    </div>
                  </div>
                </div>

                {/* Payment Information Section */}
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-[color:var(--color-dark-900)] mb-3">Payment Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Payment Reference</label>
                      <div className="mt-1 text-sm text-gray-900 font-mono">{selectedAppointment.payment_reference}</div>
                      {selectedAppointment.payment_reference.includes('ONLINE_BOOKING_') && (
                        <div className="text-xs text-gray-500 mt-1">
                          Session: {selectedAppointment.payment_reference.split('_').slice(-2).join('_')}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Payment Proof</label>
                      <div className="mt-1">
                        {selectedAppointment.payment_proof ? (
                          <div className="space-y-2">
                            <button
                              onClick={() => viewPaymentProof(selectedAppointment.id)}
                              className="text-[color:var(--color-primary-600)] hover:text-[color:var(--color-primary-700)] text-sm underline inline-flex items-center gap-1 bg-none border-none p-0 cursor-pointer hover:bg-[color:var(--color-primary-50)] px-2 py-1 rounded"
                            >
                              <Eye className="h-3 w-3" />
                              View Payment Proof
                            </button>
                            {selectedAppointment.payment_proof.includes('user') && (
                              <div className="text-xs text-gray-500">
                                <div>📁 File stored in user-specific folder</div>
                                <div>🏷️ Session-tracked filename</div>
                                <div>🔒 Secure authenticated access</div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No payment proof uploaded</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Message Section */}
                {selectedAppointment.message && (
                  <div className="bg-amber-50 rounded-lg p-4">
                    <h4 className="text-md font-medium text-[color:var(--color-dark-900)] mb-2">Patient Message</h4>
                    <div className="text-sm text-gray-900 italic">
                      "{selectedAppointment.message}"
                    </div>
                  </div>
                )}

                {/* System Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-[color:var(--color-dark-900)] mb-3">System Information</h4>
                  <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                    <div>
                      <span className="font-medium">Appointment ID:</span> #{selectedAppointment.id}
                    </div>
                    <div>
                      <span className="font-medium">Created:</span> {new Date(selectedAppointment.created_at).toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span> {new Date(selectedAppointment.updated_at).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => setSelectedAppointment(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment Proof Modal */}
        {paymentProofModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 animate-[fade-in_0.3s_ease-in-out]">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="bg-gradient-to-br from-[color:var(--color-primary-500)] to-[color:var(--color-primary-600)] text-white p-6 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Payment Proof - Appointment #{paymentProofModal.appointmentId}
                    </h3>
                    {(() => {
                      const appointment = appointments.find(a => a.id === paymentProofModal.appointmentId);
                      return appointment ? (
                        <p className="mt-1 opacity-90 text-sm">
                          Patient: {appointment.full_name} | Date: {appointment.preferred_date} | User ID: {appointment.created_by_user_id || 'Guest'}
                        </p>
                      ) : null;
                    })()}
                  </div>
                  <button
                    onClick={closePaymentProofModal}
                    className="text-white hover:text-gray-200 text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-b-lg p-6">
                <div className="flex justify-center">
                  <img
                    src={paymentProofModal.url}
                    alt="Payment Proof"
                    className="max-w-full max-h-[70vh] object-contain border rounded-lg shadow-lg"
                    onError={(e) => {
                      console.error('Error loading image');
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `
                        <div class="text-center p-8">
                          <p class="text-gray-600 mb-4">Unable to display image preview</p>
                          <a href="${paymentProofModal.url}" download="payment-proof-${paymentProofModal.appointmentId}" 
                             class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Download File
                          </a>
                        </div>
                      `;
                    }}
                  />
                </div>
                
                <div className="flex justify-center gap-4 mt-6">
                  <a
                    href={paymentProofModal.url}
                    download={(() => {
                      const appointment = appointments.find(a => a.id === paymentProofModal.appointmentId);
                      if (appointment) {
                        return `PaymentProof_User${appointment.created_by_user_id || 'Guest'}_${appointment.full_name.replace(/\s+/g, '_')}_Appointment${paymentProofModal.appointmentId}_${appointment.preferred_date}`;
                      }
                      return `payment-proof-appointment-${paymentProofModal.appointmentId}`;
                    })()}
                    className="px-4 py-2 bg-[color:var(--color-primary-600)] text-white rounded-lg hover:bg-[color:var(--color-primary-700)] transition-colors inline-flex items-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download
                  </a>
                  <button
                    onClick={closePaymentProofModal}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
