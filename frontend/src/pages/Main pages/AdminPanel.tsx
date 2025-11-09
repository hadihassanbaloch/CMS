// import React, { useEffect, useState } from 'react';
// import { supabase } from '../../lib/supabase';
// import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle, XCircle, Search, Image, FileText, History, Building } from 'lucide-react';
// import ClinicManagement from '../../components/ClinicManagement';
// import Modal from '../../components/Modal';

// interface Appointment {
//   id: string;
//   patient_name: string;
//   email: string;
//   phone: string;
//   service: string;
//   message: string;
//   preferred_date: string;
//   preferred_time: string;
//   status: 'pending' | 'confirmed' | 'cancelled';
//   created_at: string;
//   payment_proof: string;
//   payment_reference: string;
//   clinic: {
//     name: string;
//     address: string;
//   };
// }

// interface ConsultationNote {
//   id: string;
//   notes: string;
//   created_at: string;
//   created_by: string;
// }

// const AdminPanel = () => {
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchField, setSearchField] = useState<'patient_name' | 'email' | 'phone'>('patient_name');
//   const [selectedPaymentProof, setSelectedPaymentProof] = useState<string | null>(null);
//   const [imageError, setImageError] = useState(false);
//   const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
//   const [consultationNotes, setConsultationNotes] = useState<ConsultationNote[]>([]);
//   const [newNote, setNewNote] = useState('');
//   const [patientHistory, setPatientHistory] = useState<Appointment[]>([]);
//   const [showHistory, setShowHistory] = useState(false);
//   const [activeTab, setActiveTab] = useState<'appointments' | 'clinics'>('appointments');

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   const fetchConsultationNotes = async (appointmentId: string) => {
//     try {
//       const { data, error } = await supabase
//         .from('consultation_notes')
//         .select(`
//           id,
//           notes,
//           created_at,
//           admin_users (
//             name
//           )
//         `)
//         .eq('appointment_id', appointmentId)
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setConsultationNotes(data || []);
//     } catch (error) {
//       console.error('Error fetching consultation notes:', error);
//     }
//   };

//   const fetchPatientHistory = async (email: string) => {
//     try {
//       const { data, error } = await supabase
//         .from('appointments')
//         .select('*')
//         .eq('email', email)
//         .order('preferred_date', { ascending: false });

//       if (error) throw error;
//       setPatientHistory(data || []);
//     } catch (error) {
//       console.error('Error fetching patient history:', error);
//     }
//   };

//   const addConsultationNote = async () => {
//     if (!selectedAppointment || !newNote.trim()) return;

//     try {
//       const {
//       data: { user },
//       error: userError,
//     } = await supabase.auth.getUser();

//     if (userError) throw userError;
//     if (!user) throw new Error('User not found');

//     const { data: adminData } = await supabase
//       .from('admin_users')
//       .select('id')
//       .eq('user_id', user.id) // ✅ Now guaranteed to be a string
//       .single();

//     const { error } = await supabase
//       .from('consultation_notes')
//       .insert([
//         {
//           appointment_id: selectedAppointment.id,
//           notes: newNote.trim(),
//           created_by: adminData?.id,
//         },
//       ]);


//       if (error) throw error;

//       setNewNote('');
//       fetchConsultationNotes(selectedAppointment.id);
//     } catch (error) {
//       console.error('Error adding consultation note:', error);
//     }
//   };

//   const fetchAppointments = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('appointments')
//         .select(`
//           *,
//           clinic:clinic_id (
//             name,
//             address
//           )
//         `)
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setAppointments(data || []);
//     } catch (error) {
//       console.error('Error fetching appointments:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateAppointmentStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
//     try {
//       const { error } = await supabase
//         .from('appointments')
//         .update({ status })
//         .eq('id', id);

//       if (error) throw error;
      
//       setAppointments(appointments.map(apt => 
//         apt.id === id ? { ...apt, status } : apt
//       ));
//     } catch (error) {
//       console.error('Error updating appointment:', error);
//     }
//   };

//   const filteredAppointments = appointments.filter(apt => {
//     const statusMatch = filter === 'all' ? true : apt.status === filter;
    
//     if (!searchQuery) return statusMatch;
    
//     const query = searchQuery.toLowerCase();
//     switch (searchField) {
//       case 'patient_name':
//         return statusMatch && apt.patient_name.toLowerCase().includes(query);
//       case 'email':
//         return statusMatch && apt.email.toLowerCase().includes(query);
//       case 'phone':
//         return statusMatch && apt.phone.includes(query);
//       default:
//         return statusMatch;
//     }
//   });

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'confirmed': return 'bg-green-100 text-green-800';
//       case 'cancelled': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const handleImageError = () => {
//     setImageError(true);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-lg shadow-lg p-6">
//           <div className="flex space-x-4 mb-6">
//             <button
//               onClick={() => setActiveTab('appointments')}
//               className={`px-4 py-2 rounded-md ${
//                 activeTab === 'appointments'
//                   ? 'bg-primary-100 text-primary-800 font-medium'
//                   : 'text-gray-600 hover:bg-gray-100'
//               }`}
//             >
//               Appointments
//             </button>
//             <button
//               onClick={() => setActiveTab('clinics')}
//               className={`px-4 py-2 rounded-md ${
//                 activeTab === 'clinics'
//                   ? 'bg-primary-100 text-primary-800 font-medium'
//                   : 'text-gray-600 hover:bg-gray-100'
//               }`}
//             >
//               Clinics
//             </button>
//           </div>

//           {activeTab === 'appointments' ? (
//             <>
//           {/* Search and Filter Controls */}
//           <div className="mb-6 space-y-4">
//             <div className="flex flex-col sm:flex-row gap-4">
//               <div className="flex-1">
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Search className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Search appointments..."
//                     className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
//                   />
//                 </div>
//               </div>
//               <div className="sm:w-48">
//                 <select
//                   value={searchField}
//                   onChange={(e) => setSearchField(e.target.value as 'patient_name' | 'email' | 'phone')}
//                   className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
//                 >
//                   <option value="patient_name">Search by Name</option>
//                   <option value="email">Search by Email</option>
//                   <option value="phone">Search by Phone</option>
//                 </select>
//               </div>
//             </div>

//             <div className="flex flex-wrap gap-2">
//               {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((status) => (
//                 <button
//                   key={status}
//                   onClick={() => setFilter(status)}
//                   className={`px-4 py-2 rounded-md transition-colors ${
//                     filter === status
//                       ? 'bg-primary-100 text-primary-800 border-2 border-primary-200'
//                       : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
//                   }`}
//                 >
//                   {status.charAt(0).toUpperCase() + status.slice(1)}
//                   <span className="ml-2 text-sm">
//                     ({appointments.filter(apt => status === 'all' ? true : apt.status === status).length})
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Appointments List */}
//           {loading ? (
//             <div className="text-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
//             </div>
//           ) : (
//             <div className="space-y-6">
//               {filteredAppointments.map((appointment) => (
//                 <div
//                   key={appointment.id}
//                   className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
//                 >
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     <div>
//                       <div className="flex items-center mb-4">
//                         <User className="h-5 w-5 text-gray-400 mr-2" />
//                         <span className="font-medium">{appointment.patient_name}</span>
//                       </div>
//                       <div className="flex items-center mb-4">
//                         <Mail className="h-5 w-5 text-gray-400 mr-2" />
//                         <span>{appointment.email}</span>
//                       </div>
//                       <div className="flex items-center">
//                         <Phone className="h-5 w-5 text-gray-400 mr-2" />
//                         <span>{appointment.phone}</span>
//                       </div>
//                     </div>

//                     <div>
//                       <div className="flex items-center mb-4">
//                         <Calendar className="h-5 w-5 text-gray-400 mr-2" />
//                         <span>{new Date(appointment.preferred_date).toLocaleDateString()}</span>
//                       </div>
//                       <div className="flex items-center mb-4">
//                         <Clock className="h-5 w-5 text-gray-400 mr-2" />
//                         <span>{appointment.preferred_time}</span>
//                       </div>
//                       <div className="flex items-center">
//                         <MessageSquare className="h-5 w-5 text-gray-400 mr-2" />
//                         <span className="text-sm text-gray-600">{appointment.service}</span>
//                         {appointment.clinic && (
//                           <div className="ml-4 flex items-center text-sm text-gray-600">
//                             <Building className="h-5 w-5 text-gray-400 mr-2" />
//                             <span>{appointment.clinic.name}</span>
//                           </div>
//                         )}
//                       </div>
//                       {appointment.payment_proof && (
//                         <button
//                           onClick={() => {
//                             setSelectedPaymentProof(appointment.payment_proof);
//                             setImageError(false);
//                           }}
//                           className="flex items-center mt-4 text-primary-600 hover:text-primary-700"
//                         >
//                           <Image className="h-5 w-5 mr-2" />
//                           View Payment Proof
//                         </button>
//                       )}
//                     </div>

//                     <div>
//                       <div className="mb-4">
//                         <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
//                           {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
//                         </span>
//                       </div>
//                       <div className="flex space-x-2">
//                         {appointment.status === 'confirmed' && (
//                           <button
//                             onClick={() => {
//                               setSelectedAppointment(appointment);
//                               fetchConsultationNotes(appointment.id);
//                             }}
//                             className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
//                           >
//                             <FileText className="h-4 w-4 mr-2" />
//                             Notes
//                           </button>
//                         )}
//                         <button
//                           onClick={() => {
//                             fetchPatientHistory(appointment.email);
//                             setShowHistory(true);
//                           }}
//                           className="flex items-center px-3 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
//                         >
//                           <History className="h-4 w-4 mr-2" />
//                           History
//                         </button>
                      
//                         {appointment.status === 'pending' && (
//                           <div className="flex space-x-4">
//                             <button
//                               onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
//                               className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
//                             >
//                               <CheckCircle className="h-4 w-4 mr-2" />
//                               Confirm
//                             </button>
//                             <button
//                               onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
//                               className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
//                             >
//                               <XCircle className="h-4 w-4 mr-2" />
//                               Cancel
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               {filteredAppointments.length === 0 && (
//                 <div className="text-center py-12 text-gray-500">
//                   No appointments found
//                 </div>
//               )}
//             </div>
//           )}
//             </>
//           ) : (
//             <ClinicManagement />
//           )}
//         </div>
//       </div>

//       {/* Consultation Notes Modal */}
//       <Modal
//         isOpen={!!selectedAppointment}
//         onClose={() => setSelectedAppointment(null)}
//         title="Consultation Notes"
//       >
//         <div className="space-y-6">
//           <div className="bg-gray-50 rounded-lg p-4">
//             <h3 className="font-medium text-gray-900">Patient Information</h3>
//             <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
//               <div>
//                 <p className="text-gray-500">Name</p>
//                 <p className="font-medium">{selectedAppointment?.patient_name}</p>
//               </div>
//               <div>
//                 <p className="text-gray-500">Service</p>
//                 <p className="font-medium">{selectedAppointment?.service}</p>
//               </div>
//               <div>
//                 <p className="text-gray-500">Date</p>
//                 <p className="font-medium">
//                   {selectedAppointment?.preferred_date && 
//                     new Date(selectedAppointment.preferred_date).toLocaleDateString()}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-gray-500">Time</p>
//                 <p className="font-medium">{selectedAppointment?.preferred_time}</p>
//               </div>
//             </div>
//           </div>

//           <div>
//             <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
//               Add New Note
//             </label>
//             <div className="mt-1">
//               <textarea
//                 id="notes"
//                 rows={4}
//                 className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
//                 value={newNote}
//                 onChange={(e) => setNewNote(e.target.value)}
//               />
//             </div>
//             <div className="mt-2">
//               <button
//                 onClick={addConsultationNote}
//                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
//               >
//                 Add Note
//               </button>
//             </div>
//           </div>

//           <div className="space-y-4">
//             <h3 className="font-medium text-gray-900">Previous Notes</h3>
//             {consultationNotes.length === 0 ? (
//               <p className="text-gray-500 text-sm">No consultation notes yet</p>
//             ) : (
//               consultationNotes.map((note) => (
//                 <div key={note.id} className="bg-white border rounded-lg p-4">
//                   <p className="text-gray-900 whitespace-pre-wrap">{note.notes}</p>
//                   <div className="mt-2 text-sm text-gray-500">
//                     <p>By {note.admin_users?.name || 'Admin'}</p>
//                     <p>{new Date(note.created_at).toLocaleString()}</p>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </Modal>

//       {/* Patient History Modal */}
//       <Modal
//         isOpen={showHistory}
//         onClose={() => setShowHistory(false)}
//         title="Patient History"
//       >
//         <div className="space-y-6">
//           {patientHistory.length === 0 ? (
//             <p className="text-gray-500 text-center py-4">No previous appointments found</p>
//           ) : (
//             patientHistory.map((apt) => (
//               <div key={apt.id} className="border rounded-lg p-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-gray-500">Date</p>
//                     <p className="font-medium">
//                       {new Date(apt.preferred_date).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-gray-500">Service</p>
//                     <p className="font-medium">{apt.service}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-500">Status</p>
//                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
//                       {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
//                     </span>
//                   </div>
//                 </div>
//                 {apt.message && (
//                   <div className="mt-4">
//                     <p className="text-gray-500">Notes</p>
//                     <p className="text-gray-900">{apt.message}</p>
//                   </div>
//                 )}
//               </div>
//             ))
//           )}
//         </div>
//       </Modal>

//       {/* Payment Proof Modal */}
//       <Modal
//         isOpen={!!selectedPaymentProof}
//         onClose={() => setSelectedPaymentProof(null)}
//         title="Payment Proof"
//       >
//         <div className="relative">
//           {imageError ? (
//             <div className="text-center p-8 bg-red-50 rounded-lg">
//               <p className="text-red-600">Failed to load payment proof image.</p>
//               <p className="text-sm text-red-500 mt-2">The image might have been deleted or is no longer accessible.</p>
//             </div>
//           ) : (
//             <img
//               src={selectedPaymentProof || ''}
//               alt="Payment Proof"
//               className="w-full rounded-lg"
//               onError={handleImageError}
//             />
//           )}
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default AdminPanel;