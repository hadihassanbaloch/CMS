import React from 'react';
import { BookOpen, ScrollText, Microscope, Brain, Activity, Heart } from 'lucide-react';

const Research = () => {
  const researchAreas = [
    {
      title: "Obesity & Metabolic Surgery",
      description: "Studying the impact of bariatric surgery on weight loss, diabetes remission, and long-term health benefits",
      icon: <Activity className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Laparoscopic Innovations",
      description: "Evaluating the safety and effectiveness of minimally invasive procedures",
      icon: <Microscope className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Diabetes & Bariatric Surgery",
      description: "Investigating the relationship between metabolic disorders and weight loss interventions",
      icon: <Brain className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Post-Surgical Outcomes",
      description: "Analyzing complications, recovery time, and long-term health improvements",
      icon: <Heart className="h-6 w-6 text-blue-600" />
    }
  ];

  const publications = [
    {
      title: "Comparison of Surgical Excision vs. Aspiration and Steroid Injection for Wrist Ganglion",
      description: "A study evaluating treatment options for ganglion cysts",
      year: "2023"
    },
    {
      title: "Predictors of Difficult Cholecystectomy and Conversion to Open Surgery",
      description: "Research on identifying risk factors in gallbladder removal surgeries",
      year: "2022"
    },
    {
      title: "The Relationship Between Diabetes and Hepatitis C",
      description: "Analysis of metabolic disorders correlation with viral infections",
      year: "2022"
    },
    {
      title: "Outcomes of Laparoscopic Appendectomy: A Comparative Study",
      description: "Assessment of laparoscopic versus traditional surgery benefits",
      year: "2021"
    },
    {
      title: "Bariatric Surgery in Super Obese Patients: Success Stories & Challenges",
      description: "Case studies on extreme weight loss transformations",
      year: "2021"
    }
  ];

  return (
    <section id="research" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-6">
            Research & Publications
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
            Dr. Maaz Ul Hassan is a passionate researcher and academic, dedicated to advancing the field of bariatric, 
            laparoscopic, and general surgery. His research focuses on minimally invasive techniques, metabolic disorders, 
            obesity management, and surgical innovations.
          </p>
        </div>

        <div className="mb-20">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Research Focus Areas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {researchAreas.map((area, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  {area.icon}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{area.title}</h4>
                <p className="text-gray-600">{area.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-20">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Key Publications</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {publications.map((pub, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{pub.title}</h4>
                    <p className="text-gray-600 mb-2">{pub.description}</p>
                    <p className="text-sm text-blue-600 font-medium">{pub.year}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-8 lg:p-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Academic Contributions</h3>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="leading-relaxed">
              Dr. Hassan actively collaborates with leading medical institutions and researchers to enhance 
              surgical knowledge and best practices. His work has been presented at international conferences 
              and has contributed to shaping the future of minimally invasive and metabolic surgery.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Research;