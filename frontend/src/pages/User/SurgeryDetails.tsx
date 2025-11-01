import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';

interface SurgeryDetail {
  title: string;
  summary: string;
  procedures: string[];
  benefits: string[];
}

const surgeryDetails: Record<string, SurgeryDetail> = {
  'bariatric': {
    title: "Bariatric Surgery",
    summary: "Bariatric and metabolic surgery offers transformative solutions for individuals struggling with severe obesity and metabolic disorders. Dr. Maaz Ul Hassan specializes in the latest minimally invasive techniques that help patients achieve sustainable weight loss and improve obesity-related health conditions.",
    procedures: [
      "Sleeve Gastrectomy (VSG)",
      "One Anastomosis Gastric Bypass",
      "Mini Gastric Bypass (OAGB/MGB)",
      "Maaz Modification of Roux en Y Gastric Bypass (MMRYGB)",
      "SASI",
      "SADI",
      "Liposuction"
    ],
    benefits: [
      "Significant and sustainable weight loss",
      "Improvement or resolution of type 2 diabetes",
      "Reduced cardiovascular risk",
      "Enhanced quality of life",
      "Improved mobility and joint health"
    ]
  },
  'laparoscopic': {
    title: "Laparoscopic Surgery",
    summary: "Laparoscopic surgery represents the pinnacle of modern surgical techniques, offering patients the benefits of minimal scarring, reduced pain, and faster recovery. Dr. Hassan employs state-of-the-art equipment and techniques for optimal outcomes.",
    procedures: [
      "Laparoscopic Cholecystectomy",
      "Laparoscopic Hernia Repair",
      "Laparoscopic Appendectomy",
      "Minimally Invasive Colon Surgery"
    ],
    benefits: [
      "Smaller incisions and minimal scarring",
      "Reduced post-operative pain",
      "Shorter hospital stay",
      "Faster return to work",
      "Lower risk of surgical site infections"
    ]
  },
  'general': {
    title: "General Surgery",
    summary: "Our general surgery services encompass a comprehensive range of procedures using advanced minimally invasive techniques. Dr. Hassan's expertise ensures the highest standard of care for all surgical needs.",
    procedures: [
      "Appendectomy",
      "Cholecystectomy",
      "Hernia Repair",
      "Gastrectomy",
      "Fundoplication",
      "Abdominoplasty",
      "Laparotomy"
    ],
    benefits: [
      "Comprehensive pre-operative evaluation",
      "Advanced surgical techniques",
      "Personalized post-operative care",
      "Expert management of complications",
      "Long-term follow-up care"
    ]
  },
  'metabolic': {
    title: "Metabolic Surgery",
    summary: "Metabolic surgery offers hope for patients with type 2 diabetes and other metabolic disorders. These procedures can lead to significant improvements in blood sugar control and overall metabolic health.",
    procedures: [
      "Metabolic Gastric Bypass",
      "Duodenal Switch",
      "Ileal Interposition",
      "Metabolic Sleeve Gastrectomy"
    ],
    benefits: [
      "Improved diabetes control or remission",
      "Reduced medication dependency",
      "Better cardiovascular health",
      "Improved fertility and hormonal balance",
      "Enhanced metabolic profile"
    ]
  }
};

const SurgeryDetails = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!type || !surgeryDetails[type]) {
    return <div>Surgery type not found</div>;
  }

  const details = surgeryDetails[type];

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/#services')}
          className="flex items-center text-primary-600 hover:text-primary-700 mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Services
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{details.title}</h1>
          
          <p className="text-lg text-gray-600 mb-12 leading-relaxed">
            {details.summary}
          </p>

          <div className="grid gap-12">
            <div className="bg-gray-50 rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Key Procedures</h2>
              <ul className="space-y-4">
                {details.procedures.map((procedure, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-6 w-6 text-primary-600 mr-4 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{procedure}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Benefits</h2>
              <ul className="space-y-4">
                {details.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-6 w-6 text-primary-600 mr-4 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center pt-8">
              <a 
                href="#contact" 
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-white bg-primary-600 hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg font-medium"
              >
                Book Consultation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurgeryDetails;