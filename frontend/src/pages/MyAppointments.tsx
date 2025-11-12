import { useState, useEffect } from 'react';
import { useAuth } from '../auth/useAuth';
import { get } from '../api/client';
import { Calendar, Clock, User, MapPin, Plus, Filter, Loader2, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Appointment interface matching backend schema
interface Appointment {
  id: number;
  full_name: string;
  phone: string;
  email: string;
  clinic: string;
  service_required: string;
  preferred_date: string;
  preferred_time: string;
  payment_reference: string;
  payment_proof?: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_by_user_id?: number;
  created_at: string;
  updated_at: string;
}

export default function MyAppointments() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBookAppointment = () => {
    // Navigate to landing page contact section
    if (window.location.pathname !== '/landing') {
      navigate('/landing');
      // Wait for navigation to complete then scroll
      setTimeout(() => {
        const element = document.getElementById('contact');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);
    } else {
      // Already on landing page, just scroll
      const element = document.getElementById('contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Fetch appointments from API
  useEffect(() => {
    async function fetchAppointments() {
      if (!token) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await get<Appointment[]>('/my-appointments', token);
        setAppointments(data);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
        setError('Failed to load appointments. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, [token]);

  // Filter appointments based on status
  const filteredAppointments = appointments.filter((appointment: Appointment) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return appointment.status === 'confirmed' || appointment.status === 'pending';
    if (filter === 'completed') return appointment.status === 'completed';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-600';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Pending';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getClinicName = (clinic: string) => {
    switch (clinic) {
      case 'clinic_a': return 'Main Clinic';
      case 'clinic_b': return 'Secondary Clinic';
      default: return clinic;
    }
  };

  const getServiceName = (service: string) => {
    switch (service) {
      case 'general_consultation': return 'General Consultation';
      case 'bariatric_surgery': return 'Bariatric Surgery';
      case 'laparoscopic_surgery': return 'Laparoscopic Surgery';
      case 'general_surgery': return 'General Surgery';
      case 'metabolic_surgery': return 'Metabolic Surgery';
      default: return service;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Loading your appointments...
          </h1>
          <p className="text-gray-600">Please wait while we fetch your data.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="h-6 w-6 text-red-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Appointments
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
              <p className="text-gray-600 mt-2">Welcome back, {user?.full_name}</p>
            </div>
            <button
              onClick={handleBookAppointment}
              className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Book New Appointment
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-teal-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter((a: Appointment) => a.status === 'confirmed' || a.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointments.filter((a: Appointment) => a.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <div className="flex gap-2">
                {['all', 'upcoming', 'completed'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab as any)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      filter === tab
                        ? 'bg-teal-600 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Appointments ({filteredAppointments.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredAppointments.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No appointments found
                </h3>
                <p className="text-gray-600 mb-4">
                  You don't have any {filter === 'all' ? '' : filter + ' '} appointments.
                </p>
                <button
                  onClick={handleBookAppointment}
                  className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Book Your First Appointment
                </button>
              </div>
            ) : (
              filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="px-6 py-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {getServiceName(appointment.service_required)}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                            {getStatusText(appointment.status)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(appointment.preferred_date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {appointment.preferred_time}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            Prof Dr. Maaz Ul Hassan
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {getClinicName(appointment.clinic)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {appointment.status === 'confirmed' && (
                        <button className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                          Cancel
                        </button>
                      )}
                      <button className="px-3 py-1.5 text-sm font-medium text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}