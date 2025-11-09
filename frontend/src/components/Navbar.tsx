import React, { useState } from 'react';
import { Menu, X, Stethoscope, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const isHomePage = location.pathname === '/landing';

  React.useEffect(() => {
  // When URL hash changes, scroll to that section
  if (location.hash) {
    const sectionId = location.hash.replace('#', '');
    const element = document.getElementById(sectionId);
    if (element) {
      // Delay slightly to ensure DOM is ready
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }
}, [location]);


  // React.useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setSession(session);
  //   });

  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session);
  //   });

  //   return () => subscription.unsubscribe();
  // }, []);

  const scrollToSection = (sectionId: string) => {
    if (!isHomePage) {
      navigate(`/#${sectionId}`);
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/landing" className="flex items-center">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">Prof Dr. Maaz Ul Hassan</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-blue-600">About</button>
            <button onClick={() => scrollToSection('services')} className="text-gray-600 hover:text-blue-600">Services</button>
            <button onClick={() => scrollToSection('testimonials')} className="text-gray-600 hover:text-blue-600">Testimonials</button>
            <button onClick={() => scrollToSection('research')} className="text-gray-600 hover:text-blue-600">Research</button>
            <button onClick={() => scrollToSection('videos')} className="text-gray-600 hover:text-blue-600">Videos</button>
            <button onClick={() => scrollToSection('blog')} className="text-gray-600 hover:text-blue-600">Blog</button>
            <button onClick={() => scrollToSection('contact')} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Book Appointment
            </button>
            <Link
              to="/patient-portal"
              className="flex items-center text-gray-600 hover:text-blue-600"
            >
              <User className="h-5 w-5 mr-1" />
              {token ? 'My Portal' : 'Sign In'}
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button 
              onClick={() => {
                scrollToSection('about');
                setIsOpen(false);
              }} 
              className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600"
            >
              About
            </button>
            <button 
              onClick={() => {
                scrollToSection('services');
                setIsOpen(false);
              }} 
              className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600"
            >
              Services
            </button>
            <button 
              onClick={() => {
                scrollToSection('testimonials');
                setIsOpen(false);
              }} 
              className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600"
            >
              Testimonials
            </button>
            <button 
              onClick={() => {
                scrollToSection('research');
                setIsOpen(false);
              }} 
              className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600"
            >
              Research
            </button>
            <button 
              onClick={() => {
                scrollToSection('videos');
                setIsOpen(false);
              }} 
              className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600"
            >
              Videos
            </button>
            <button 
              onClick={() => {
                scrollToSection('blog');
                setIsOpen(false);
              }} 
              className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600"
            >
              Blog
            </button>
            <button 
              onClick={() => {
                scrollToSection('contact');
                setIsOpen(false);
              }} 
              className="block w-full px-3 py-2 bg-blue-600 text-white text-center rounded-md"
            >
              Book Appointment
            </button>
            <Link
              to={token ? "/patient-portal" : "/auth"}
              className="block w-full text-center px-3 py-2 text-gray-600 hover:text-blue-600"
              onClick={() => setIsOpen(false)}
              >
              {token ? 'My Portal' : 'Sign In'}
            </Link>

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;