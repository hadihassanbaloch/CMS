import React, { useEffect, useRef } from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';

const Hero = () => {
  const counterRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            animateValue(0, 10000, 1000); // Updated to animate to 10000
          }
        });
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateValue = (start: number, end: number, duration: number) => {
    if (!counterRef.current) return;
    
    const range = end - start;
    const increment = 200; // Increased increment for smoother animation to 10000
    const steps = Math.ceil(range / increment);
    const stepTime = duration / steps;
    
    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if (counterRef.current) {
        counterRef.current.textContent = Math.min(current, end).toLocaleString() + '+';
      }
      if (current >= end) {
        clearInterval(timer);
      }
    }, stepTime);
  };

  return (
    <div className="relative min-h-screen">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80")',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-900/70"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold">
            <span className="block text-white mb-2">Transform Your Life</span>
            <span className="block text-primary-400">With Expert Surgical Care</span>
          </h1>
          
          <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Prof Dr. Maaz Ul Hassan - Pakistan's premier bariatric surgeon with over 10,000 successful surgeries and life-changing transformations.
          </p>
        </div>
        
        <div className="mt-12 max-w-4xl mx-auto grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="glass-card p-6 transform hover:scale-105 transition-all duration-300 border border-primary-400/20">
            <div ref={counterRef} className="text-3xl font-bold text-primary-400 mb-2">0+</div>
            <div className="text-white/90">Successful Surgeries</div>
          </div>
          
          <div className="glass-card p-6 transform hover:scale-105 transition-all duration-300 border border-primary-400/20">
            <div className="text-3xl font-bold text-primary-400 mb-2">28+</div>
            <div className="text-white/90">Years Experience</div>
          </div>
          
          <div className="glass-card p-6 transform hover:scale-105 transition-all duration-300 border border-primary-400/20">
            <div className="text-3xl font-bold text-primary-400 mb-2">98%</div>
            <div className="text-white/90">Success Rate</div>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <a href="#contact" className="btn-primary group bg-primary-600 hover:bg-primary-700">
            Book Consultation
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </a>
          
          <a href="#testimonials" className="btn-secondary border-primary-400 text-primary-400 hover:bg-primary-400/10">
            View Success Stories
            <ChevronRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-60 z-[1]"></div>
    </div>
  );
};

export default Hero;