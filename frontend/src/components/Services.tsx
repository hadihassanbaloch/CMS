import React, { useState } from 'react';
import { Scale, Microscope, Stethoscope, Activity, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
  details: {
    summary: string;
    procedures: string[];
    benefits: string[];
  };
}

const Services = () => {
  const navigate = useNavigate();

  const services: Service[] = [
    {
      title: "Bariatric Surgery",
      description: "Advanced weight loss surgical procedures including gastric bypass and sleeve gastrectomy.",
      icon: <Scale className="h-8 w-8" />,
      details: {
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
      }
    },
    {
      title: "Laparoscopic Surgery",
      description: "Minimally invasive procedures for various conditions with faster recovery times.",
      icon: <Microscope className="h-8 w-8" />,
      details: {
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
      }
    },
    {
      title: "General Surgery",
      description: "Comprehensive surgical care for a wide range of medical conditions.",
      icon: <Stethoscope className="h-8 w-8" />,
      details: {
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
      }
    },
    {
      title: "Metabolic Surgery",
      description: "Surgical solutions for diabetes and other metabolic disorders.",
      icon: <Activity className="h-8 w-8" />,
      details: {
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
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Comprehensive Surgical Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced surgical procedures using state-of-the-art minimally invasive techniques
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              onClick={() => navigate(`/surgery/${service.title.toLowerCase().split(' ')[0]}`)}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-2 border-gray-100 hover:border-primary-200"
            >
              <div className="relative">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-primary-600">{service.icon}</div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
                
                <div className="flex items-center text-primary-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;