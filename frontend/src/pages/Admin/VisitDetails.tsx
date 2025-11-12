import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { ArrowLeft, Calendar, User, FileText, Pill, Stethoscope, Clock, Edit } from 'lucide-react';

// TypeScript interface for visit details
interface VisitDetails {
  id: number;
  patient_id: number;
  patient_name: string;
  visit_date: string;
  visit_type: 'consultation' | 'follow_up' | 'surgery' | 'emergency';
  chief_complaint: string;
  history_of_present_illness: string;
  physical_examination: string;
  diagnosis: string;
  differential_diagnosis: string;
  treatment_plan: string;
  prescription: string;
  lab_tests_ordered: string;
  imaging_ordered: string;
  follow_up_instructions: string;
  notes: string;
  doctor_name: string;
  next_appointment: string | null;
  created_at: string;
  updated_at: string;
}

export default function VisitDetails() {
  const { patientId, visitId } = useParams<{ patientId: string; visitId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [visit, setVisit] = useState<VisitDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (patientId && visitId) {
      fetchVisitDetails();
    }
  }, [patientId, visitId]);

  const fetchVisitDetails = async () => {
    try {
      setLoading(true);
      // For now, we'll create detailed dummy data
      // TODO: Replace with actual API call when visits backend is ready
      const dummyVisitDetails: VisitDetails = {
        id: parseInt(visitId!),
        patient_id: parseInt(patientId!),
        patient_name: 'Hadi Hassan', // This would come from the API
        visit_date: '2024-11-08',
        visit_type: 'consultation',
        chief_complaint: 'Patient presents with severe abdominal pain, nausea, and vomiting for the past 2 days',
        history_of_present_illness: 'The patient reports sudden onset of epigastric pain radiating to the back, associated with nausea and multiple episodes of vomiting. Pain is constant, 8/10 severity, worsened after meals. No fever or changes in bowel movements reported.',
        physical_examination: 'Vital Signs: BP 130/85, HR 95, Temp 37.2°C, RR 18. General: Alert and oriented, appears uncomfortable. Abdomen: Tender epigastric region, positive Murphy sign, bowel sounds present. No rebound tenderness.',
        diagnosis: 'Acute Gastroenteritis with possible cholecystitis',
        differential_diagnosis: 'Peptic ulcer disease, pancreatitis, gastroesophageal reflux disease',
        treatment_plan: 'Conservative management with medications, dietary modifications, and close monitoring. If symptoms persist, consider ultrasound and further imaging.',
        prescription: `1. Omeprazole 20mg - Take twice daily before meals for 14 days
2. Ondansetron 4mg - Take as needed for nausea (max 3 times daily)
3. ORS solution - Take frequently for hydration
4. Simethicone 40mg - Take after meals for gas relief`,
        lab_tests_ordered: 'CBC with differential, Basic metabolic panel, Lipase, Amylase, LFTs',
        imaging_ordered: 'Abdominal ultrasound if symptoms persist after 48 hours',
        follow_up_instructions: `1. Return if symptoms worsen or new symptoms develop
2. Maintain clear liquid diet for 24 hours, then advance as tolerated
3. Avoid fatty, spicy foods for 1 week
4. Follow up appointment in 1 week
5. Emergency contact if severe pain or high fever develops`,
        notes: 'Patient education provided regarding dietary modifications and warning signs. Family member present and understands discharge instructions. Patient verbalized understanding of treatment plan.',
        doctor_name: 'Dr. Ahmed Khan',
        next_appointment: '2024-11-15',
        created_at: '2024-11-08T10:30:00Z',
        updated_at: '2024-11-08T10:30:00Z'
      };
      
      setVisit(dummyVisitDetails);
    } catch (err: any) {
      setError(err.message || 'Failed to load visit details');
    } finally {
      setLoading(false);
    }
  };

  const getVisitTypeColor = (type: string) => {
    const colors = {
      'consultation': 'bg-blue-100 text-blue-800',
      'follow_up': 'bg-green-100 text-green-800',
      'surgery': 'bg-purple-100 text-purple-800',
      'emergency': 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getVisitTypeName = (type: string) => {
    const names = {
      'consultation': 'Consultation',
      'follow_up': 'Follow-up',
      'surgery': 'Surgery',
      'emergency': 'Emergency'
    };
    return names[type as keyof typeof names] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading visit details...</div>
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Visit not found</h3>
        <button
          onClick={() => navigate(`/admin/patients/${patientId}`)}
          className="text-primary-600 hover:text-primary-700"
        >
          Return to patient history
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/admin/patients/${patientId}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Patient History
          </button>
        </div>
        <button
          onClick={() => navigate(`/admin/patients/${patientId}/visit/${visitId}/edit`)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit Visit
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Visit Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <Stethoscope className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{visit.patient_name} - Visit Details</h1>
              <div className="flex items-center gap-4 mt-2">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getVisitTypeColor(visit.visit_type)}`}>
                  {getVisitTypeName(visit.visit_type)}
                </span>
                <div className="flex items-center gap-1 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(visit.visit_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{visit.doctor_name}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right text-sm text-gray-500">
            <div>Created: {new Date(visit.created_at).toLocaleString()}</div>
            <div>Updated: {new Date(visit.updated_at).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Visit Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chief Complaint & History */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary-600" />
            Clinical Presentation
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Chief Complaint</h3>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{visit.chief_complaint}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">History of Present Illness</h3>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{visit.history_of_present_illness}</p>
            </div>
          </div>
        </div>

        {/* Physical Examination */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary-600" />
            Physical Examination
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-900 whitespace-pre-line">{visit.physical_examination}</p>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Diagnosis & Assessment</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Primary Diagnosis</h3>
              <p className="text-gray-900 bg-green-50 p-3 rounded-lg border border-green-200">{visit.diagnosis}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Differential Diagnosis</h3>
              <p className="text-gray-900 bg-yellow-50 p-3 rounded-lg border border-yellow-200">{visit.differential_diagnosis}</p>
            </div>
          </div>
        </div>

        {/* Treatment Plan */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Treatment Plan</h2>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-gray-900">{visit.treatment_plan}</p>
          </div>
        </div>
      </div>

      {/* Prescription */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Pill className="h-5 w-5 text-primary-600" />
          Prescription
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg border">
          <pre className="text-gray-900 whitespace-pre-wrap font-mono text-sm">{visit.prescription}</pre>
        </div>
      </div>

      {/* Tests & Imaging */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Laboratory Tests</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-900">{visit.lab_tests_ordered || 'No lab tests ordered'}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Imaging Studies</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-900">{visit.imaging_ordered || 'No imaging studies ordered'}</p>
          </div>
        </div>
      </div>

      {/* Follow-up Instructions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary-600" />
          Follow-up Instructions
        </h2>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <pre className="text-gray-900 whitespace-pre-wrap">{visit.follow_up_instructions}</pre>
          </div>
          {visit.next_appointment && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="font-medium text-green-800">Next Appointment:</p>
              <p className="text-green-900">{new Date(visit.next_appointment).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Clinical Notes */}
      {visit.notes && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Clinical Notes</h2>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <p className="text-gray-900">{visit.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
}