import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Stethoscope, FileText } from 'lucide-react';
import { useAuth } from '../../auth/useAuth';

interface Appointment {
  id: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
  created_at: string;
  message?: string;
}

// Dummy data for now
const dummyAppointments: Appointment[] = [
  {
    id: '1',
    service: 'General Consultation',
    preferred_date: '2025-11-15',
    preferred_time: '10:00 AM',
    status: 'confirmed',
    created_at: '2025-11-10T08:00:00Z',
    message: 'Regular checkup'
  },
  {
    id: '2',
    service: 'Blood Test',
    preferred_date: '2025-11-20',
    preferred_time: '9:30 AM',
    status: 'pending',
    created_at: '2025-11-09T14:30:00Z'
  }
];

const PatientPortal = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, token, signout } = useAuth();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      if (user) {
        setAppointments(dummyAppointments);
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-center mb-8">
            <Stethoscope className="h-8 w-8 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900 ml-3">Patient Portal</h2>
          </div>
          <p className="text-gray-600 text-center mb-4">Please sign in to view your appointments</p>
          <button
            onClick={() => navigate('/auth')}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
            <button
              onClick={signout}
              className="text-gray-600 hover:text-gray-900"
            >
              Sign Out
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No appointments found</p>
              <button
                onClick={() => navigate('/#contact')}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
              >
                Book an Appointment
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Calendar className="h-5 w-5 mr-2" />
                        {new Date(appointment.preferred_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-5 w-5 mr-2" />
                        {appointment.preferred_time}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Stethoscope className="h-5 w-5 mr-2" />
                        {appointment.service}
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>

                    {appointment.message && (
                      <div className="lg:col-span-2">
                        <p className="text-gray-600">
                          <span className="font-medium">Additional Notes:</span> {appointment.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientPortal;