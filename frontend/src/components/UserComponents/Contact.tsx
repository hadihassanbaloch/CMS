import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, Clock, Check, CreditCard, Upload, Building } from 'lucide-react';

const Contact = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    patient_name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    preferred_date: '',
    preferred_time: '',
    payment_reference: '',
    payment_proof: null as File | null,
    clinic_id: '',
  });

  const clinics = [
    { id: '1', name: 'Hameed Latif Cosmetology Centre', address: '81 Abu Bakr Block, New Garden Town' },
    { id: '2', name: 'Shalamar Hospital', address: 'Room 4B, OPD, Lahore' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setFormData({ ...formData, payment_proof: file });
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    if (!formData.patient_name || !formData.email || !formData.payment_proof) {
      setError('Please fill all required fields and upload payment proof.');
      return;
    }
    setError('');
    setTimeout(() => setSuccess(true), 1000);
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Book An Appointment
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
            Take the first step towards a healthier life
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Contact Information */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
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
                  <a href="tel:+923291664350" className="text-lg font-medium text-gray-900 hover:text-primary-600">
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
                  <a href="mailto:drmaaz@hotmail.com" className="text-lg font-medium text-gray-900 hover:text-primary-600">
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
                  <p className="text-lg font-medium text-gray-900">Shalimar Link Road, Lahore</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Consultation Hours</p>
                  <p className="text-lg font-medium text-gray-900">
                    Monday–Wednesday: 4:00 PM – 6:00 PM
                    <br />
                    <span className="text-sm text-gray-600">Hameed Latif Cosmetology Centre</span>
                    <br />
                    Thursday: 11:00 AM – 1:00 PM
                    <br />
                    <span className="text-sm text-gray-600">OPD Room 4B, Shalamar Hospital</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Payment Info</p>
                  <p className="font-medium text-gray-900">Consultation Fee: PKR 4,000</p>
                  <p className="text-gray-600">Meezan Bank – Maaz ul Hassan</p>
                  <p className="text-gray-600">Account #: 02930104467972</p>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">Book an Appointment</h3>

            {success ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-lg font-medium text-green-800 mb-2">Appointment Submitted</h4>
                <p className="text-green-600">We’ll contact you soon to confirm your booking.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="patient_name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input id="patient_name" value={formData.patient_name} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input id="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg" />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input id="email" type="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg" />
                </div>

                <div>
                  <label htmlFor="clinic_id" className="block text-sm font-medium text-gray-700 mb-1">Select Clinic</label>
                  <select id="clinic_id" value={formData.clinic_id} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg">
                    <option value="">Select clinic</option>
                    {clinics.map(c => (
                      <option key={c.id} value={c.id}>{c.name} - {c.address}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">Service Required</label>
                  <select id="service" value={formData.service} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg">
                    <option value="">Select a service</option>
                    <option>General Consultation</option>
                    <option>Bariatric Surgery</option>
                    <option>Laparoscopic Surgery</option>
                    <option>General Surgery</option>
                    <option>Metabolic Surgery</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="preferred_date" className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                    <input id="preferred_date" type="date" value={formData.preferred_date} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg" />
                  </div>
                  <div>
                    <label htmlFor="preferred_time" className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                    <input id="preferred_time" type="time" value={formData.preferred_time} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg" />
                  </div>
                </div>

                <div>
                  <label htmlFor="payment_reference" className="block text-sm font-medium text-gray-700 mb-1">Payment Reference</label>
                  <input id="payment_reference" value={formData.payment_reference} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg" />
                </div>

                <div>
                  <label htmlFor="payment_proof" className="block text-sm font-medium text-gray-700 mb-1">Payment Proof</label>
                  <div className="border-2 border-dashed p-6 text-center rounded-lg">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <label className="cursor-pointer text-primary-600">
                      <span>Upload File</span>
                      <input id="payment_proof" type="file" accept="image/*,.pdf" onChange={handleFileChange} className="sr-only" />
                    </label>
                    {formData.payment_proof && (
                      <p className="text-sm text-green-600 mt-2">
                        Selected: {formData.payment_proof.name}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                  <textarea id="message" rows={4} value={formData.message} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg"></textarea>
                </div>

                {error && (
                  <p className="text-red-600 bg-red-50 border p-3 rounded-md text-sm">{error}</p>
                )}

                <button type="submit" className="w-full py-4 px-6 rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-all duration-300 flex items-center justify-center space-x-2">
                  <Send className="h-5 w-5" />
                  <span>Book Appointment</span>
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
