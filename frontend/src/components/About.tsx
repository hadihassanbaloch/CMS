import React from 'react';
import { Award, GraduationCap, Trophy, Heart, CheckCircle, Star } from 'lucide-react';

const About = () => {
  const qualifications = [
    {
      title: "MBBS",
      institution: "Quaid-e-Azam Medical College, Bahawalpur",
      year: "1997"
    },
    {
      title: "FCPS (Surgery)",
      institution: "College of Physicians & Surgeons Pakistan",
      year: "2004"
    },
    {
      title: "Fellowship in Bariatric and Metabolic Surgery",
      institution: "France, Belgium and KSA",
      year: "2010"
    },
    {
      title: "Diploma in Minimally Invasive General and Bariatric Surgery",
      institution: "France",
      year: "2012"
    },
    {
      title: "Certification in Laparoscopic and Minimally Invasive Surgery",
      institution: "USA",
      year: "2015"
    }
  ];

  const achievements = [
    {
      title: "Record-Breaking Surgery",
      description: "Successfully performed surgery on Pakistan's heaviest patient (380 kg, reduced to 140 kg)",
      icon: <Trophy className="h-6 w-6" />
    },
    {
      title: "Pediatric Achievement",
      description: "Performed surgery on the world's heaviest child (200 kg, reduced to 100 kg)",
      icon: <Star className="h-6 w-6" />
    },
    {
      title: "International Recognition",
      description: "Member of the International Federation for the Surgery of Obesity and Metabolic Disorders (IFSO)",
      icon: <Award className="h-6 w-6" />
    },
    {
      title: "Leadership Role",
      description: "President of the Pakistan Society for Metabolic & Bariatric Surgery (Lahore Chapter)",
      icon: <CheckCircle className="h-6 w-6" />
    }
  ];

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50"></div>
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-64 h-64 bg-tertiary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-primary-500 to-secondary-500 text-white mb-4">
            Meet Your Surgeon
          </span>
          <h2 className="text-4xl font-extrabold sm:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-secondary-500 to-tertiary-500">
            Prof Dr. Maaz Ul Hassan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pioneering minimally invasive surgical solutions in Pakistan
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative group">
            <div className="absolute -inset-4">
              <div className="w-full h-full mx-auto opacity-30 blur-lg filter group-hover:opacity-70 transition duration-1000 group-hover:duration-200 animate-tilt bg-gradient-to-r from-primary-600 via-secondary-500 to-tertiary-500"></div>
            </div>
            <div className="relative">
              <div className="aspect-w-4 aspect-h-5 rounded-2xl overflow-hidden">
                <img
                  src="https://shalamarhospital.org.pk/wp-content/uploads/2023/10/Dr.-Maaz-ul-Hassan-1-scaled-1-1366x2048.jpg"
                  alt="Prof Dr. Maaz Ul Hassan"
                  className="object-cover object-center w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 transform hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center mb-4">
                <Heart className="h-8 w-8 text-primary-500" />
                <h3 className="ml-4 text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
                  Expert Care
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                With over two decades of experience, Prof Dr. Hassan has established himself as a leading figure in bariatric and metabolic surgery. His expertise spans minimally invasive techniques, offering patients the most advanced surgical solutions available.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100 transform hover:-translate-y-1 transition-all duration-300">
                <div className="text-3xl font-bold text-primary-500 mb-2">10,000+</div>
                <div className="text-gray-600">Successful Surgeries</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100 transform hover:-translate-y-1 transition-all duration-300">
                <div className="text-3xl font-bold text-secondary-500 mb-2">28+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <GraduationCap className="h-8 w-8 text-primary-500" />
              <h3 className="ml-4 text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">
                Education & Training
              </h3>
            </div>
            <div className="space-y-6">
              {qualifications.map((qual, index) => (
                <div
                  key={index}
                  className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b from-primary-500 to-secondary-500 hover:before:w-1 before:transition-all"
                >
                  <h4 className="font-semibold text-gray-900">{qual.title}</h4>
                  <p className="text-gray-600">{qual.institution}</p>
                  <span className="text-sm text-primary-600">{qual.year}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <Trophy className="h-8 w-8 text-primary-500" />
              <h3 className="ml-4 text-2xl font-semibold text-gray-900">
                Achievements
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-start group hover:bg-gray-50 p-4 rounded-xl transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <div className="text-primary-600 group-hover:text-primary-700 transition-colors">
                      {achievement.icon}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900 mb-1">{achievement.title}</h4>
                    <p className="text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;