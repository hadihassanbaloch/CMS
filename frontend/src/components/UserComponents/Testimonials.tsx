import React from 'react';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Ahmed Khan",
      text: "Dr. Maaz's expertise in bariatric surgery changed my life. I've lost 40kg and my diabetes is now under control.",
      rating: 5,
      role: "Bariatric Surgery Patient",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Sara Ahmad",
      text: "The laparoscopic procedure was minimally invasive with a quick recovery time. Highly recommend Dr. Hassan.",
      rating: 5,
      role: "Laparoscopic Surgery Patient",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Mohammad Qasim",
      text: "Professional, caring, and highly skilled. The entire process from consultation to post-surgery care was excellent.",
      rating: 5,
      role: "General Surgery Patient",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    }
  ];

  return (
    <section id="testimonials" className="pt-0 pb-20 bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-primary-500 to-secondary-500 text-white mb-4">
            Patient Stories
          </span>
          <h2 className="text-4xl font-extrabold sm:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 via-secondary-500 to-tertiary-500">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real experiences from patients who transformed their lives
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-lg transform -rotate-1 group-hover:-rotate-2 transition-transform">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <Quote className="h-4 w-4 text-white" />
                </div>
                
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a 
            href="#contact"
            className="inline-flex items-center px-8 py-4 rounded-full text-white bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Share Your Story
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;