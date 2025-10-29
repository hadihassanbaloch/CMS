import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../lib/supabase';
import { Calendar, Clock, Stethoscope, FileText } from 'lucide-react';
import type { Session } from '@supabase/supabase-js'; 

interface Appointment {
  id: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
  created_at: string;
  message?: string;
}

const PatientPortal = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchAppointments(session.user.email ?? '');

      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
       fetchAppointments(session.user.email ?? '');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchAppointments = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('email', email)
        .order('preferred_date', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center justify-center mb-8">
            <Stethoscope className="h-8 w-8 text-primary-600" />
            <h2 className="text-2xl font-bold text-gray-900 ml-3">Patient Portal</h2>
          </div>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={['google']}
            redirectTo={`${window.location.origin}/patient-portal`}
            theme="light"
          />
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
              onClick={() => supabase.auth.signOut()}
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