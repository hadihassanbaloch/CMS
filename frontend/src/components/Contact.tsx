import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, Clock, Check, CreditCard, Upload, Building } from 'lucide-react';

interface FormData {
  patient_name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  preferred_date: string;
  preferred_time: string;
  payment_reference: string;
  payment_proof: File | null;
  clinic_id: string;
}

interface Clinic {
  id: string;
  name: string;
  address: string;
  schedule: {
    [key: string]: { open: string; close: string } | null;
  };
}

// Dummy clinic data
const dummyClinics: Clinic[] = [
  {
    id: '1',
    name: 'Hameed Latif Cosmetology Centre',
    address: '81 Abu Bakr Block, New Garden Town',
    schedule: {
      monday: { open: '16:00', close: '18:00' },
      tuesday: { open: '16:00', close: '18:00' },
      wednesday: { open: '16:00', close: '18:00' },
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null
    }
  },
  {
    id: '2',
    name: 'Shalamar Hospital',
    address: 'OPD, Room 4B, Shalamar Hospital',
    schedule: {
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: { open: '11:00', close: '13:00' },
      friday: null,
      saturday: null,
      sunday: null
    }
  }
];

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    patient_name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    preferred_date: '',
    preferred_time: '',
    payment_reference: '',
    payment_proof: null,
    clinic_id: ''
  });
  const [clinics] = useState<Clinic[]>(dummyClinics);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [selectedClinicSchedule, setSelectedClinicSchedule] = useState<{ [key: string]: { open: string; close: string } | null }>({});

  const handleClinicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clinicId = e.target.value;
    const clinic = clinics.find(c => c.id === clinicId);
    setSelectedClinicSchedule(clinic?.schedule || {});
    setFormData(prev => ({
      ...prev,
      clinic_id: clinicId,
      preferred_time: '' // Reset time when clinic changes
    }));
  };

  const getAvailableTimeSlots = () => {
    if (!formData.preferred_date || !formData.clinic_id) return [];
    
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayOfWeek = days[new Date(formData.preferred_date).getDay()];
    
    const schedule = selectedClinicSchedule[dayOfWeek];
    if (!schedule) return [];

    const { open, close } = schedule;
    const slots = [];
    let time = open;
    
    while (time <= close) {
      slots.push(time);
      // Add 1 hour
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours));
      date.setMinutes(parseInt(minutes));
      date.setHours(date.getHours() + 1);
      time = date.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    return slots;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.payment_proof) {
        throw new Error('Please attach payment proof');
      }

      // Simulate form submission delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate successful submission
      console.log('Form submitted with data:', {
        ...formData,
        payment_proof: formData.payment_proof?.name
      });

      setSuccess(true);
      setFormData({
        patient_name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
        preferred_date: '',
        preferred_time: '',
        payment_reference: '',
        payment_proof: null,
        clinic_id: ''
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit appointment request. Please try again.');
      console.error('Error submitting appointment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setFormData(prev => ({
        ...prev,
        payment_proof: file
      }));
      setError(''); // Clear any previous errors
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Schedule a Consultation
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
            Take the first step towards a healthier life
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-gray-900">
                  Contact Information
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <Phone className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Phone</p>
                      <a 
                        href="tel:+923009421994" 
                        className="text-lg font-medium text-gray-900 hover:text-primary-600 transition-colors"
                      >
                        +92 329 166 4350
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Email</p>
                      <a 
                        href="mailto:drmaaz@hotmail.com"
                        className="text-lg font-medium text-gray-900 hover:text-primary-600 transition-colors"
                      >
                        drmaaz@hotmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-lg font-medium text-gray-900">
                        Shalimar Link Road, Lahore
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Consultation Hours</p>
                      <p className="text-lg font-medium text-gray-900">
                        Monday to Wednesday: 4:00 PM - 6:00 PM
                        <br />
                        <span className="text-sm text-gray-600">Hameed Latif Cosmetology Centre</span>
                        <br />
                        <span className="text-sm text-gray-600">81 Abu Bakr Block, New Garden Town</span>
                        <br /><br />
                        Thursday: 11:00 AM - 1:00 PM
                        <br />
                        <span className="text-sm text-gray-600">OPD, Room 4B, Shalamar Hospital</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Payment Information</p>
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">Consultation Fee: PKR 4,000</p>
                        <p className="text-gray-600">Bank: Meezan Bank</p>
                        <p className="text-gray-600">Account Title: Maaz ul Hassan</p>
                        <p className="text-gray-600">Account #: 02930104467972</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">
              Book an Appointment
            </h3>
            
            {success ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-lg font-medium text-green-800 mb-2">Appointment Request Submitted</h4>
                <p className="text-green-600">
                  We'll review your payment proof and contact you shortly to confirm your appointment.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="patient_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="patient_name"
                      value={formData.patient_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="clinic_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Clinic
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="clinic_id"
                      value={formData.clinic_id}
                      onChange={(e) => {
                        handleClinicChange(e);
                        handleChange(e);
                      }}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    >
                      <option value="">Select a clinic</option>
                      {clinics.map((clinic) => (
                        <option key={clinic.id} value={clinic.id}>
                          {clinic.name} - {clinic.address}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                    Service Required
                  </label>
                  <select
                    id="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                    <option value="">Select a service</option>
                    <option value="General Consultation">General Consultation</option>
                    <option value="Bariatric Surgery">Bariatric Surgery</option>
                    <option value="Laparoscopic Surgery">Laparoscopic Surgery</option>
                    <option value="General Surgery">General Surgery</option>
                    <option value="Metabolic Surgery">Metabolic Surgery</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="preferred_date" className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      id="preferred_date"
                      value={formData.preferred_date}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="preferred_time" className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Time
                    </label>
                    <select
                      id="preferred_time"
                      value={formData.preferred_time}
                      onChange={handleChange}
                      required
                      disabled={!formData.clinic_id || !formData.preferred_date}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    >
                      <option value="">Select time</option>
                      {getAvailableTimeSlots().map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="payment_reference" className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Reference Number
                  </label>
                  <input
                    type="text"
                    id="payment_reference"
                    value={formData.payment_reference}
                    onChange={handleChange}
                    required
                    placeholder="Enter bank transfer reference number"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="payment_proof" className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Proof
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="payment_proof"
                          className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="payment_proof"
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            className="sr-only"
                            required
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, PDF up to 10MB
                      </p>
                      {formData.payment_proof && (
                        <p className="text-sm text-primary-600">
                          Selected: {formData.payment_proof.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  ></textarea>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                  <p className="font-medium">Important Note:</p>
                  <p>Please transfer PKR 4,000 as consultation fee and attach the payment proof. Your appointment will be confirmed only after verification of payment proof.</p>
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-100">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-lg text-white bg-primary-600 hover:bg-primary-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Book Appointment</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;