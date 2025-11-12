import React, { useState } from 'react';
import { Menu, X, Stethoscope, User, ChevronDown, Settings, LogOut, Calendar } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { token, user, signout } = useAuth();
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
            
            {/* User Menu */}
            {token && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center text-gray-600 hover:text-blue-600 focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mr-2">
                    {user.profile_picture ? (
                      <img
                        src={user.profile_picture}
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium text-white">
                        {user.full_name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:block">{user.full_name.split(' ')[0]}</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link
                      to="/appointments"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      My Appointments
                    </Link>
                    
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Profile Settings
                    </Link>
                    
                    {user.is_admin && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <div className="border-t border-gray-200"></div>
                    <button
                      onClick={() => {
                        signout();
                        setIsUserDropdownOpen(false);
                        navigate('/auth');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center text-gray-600 hover:text-blue-600"
              >
                <User className="h-5 w-5 mr-1" />
                Sign In
              </Link>
            )}
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
            
            {token && user ? (
              <>
                <Link
                  to="/appointments"
                  className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  My Appointments
                </Link>
                <Link
                  to="/profile"
                  className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600"
                  onClick={() => setIsOpen(false)}
                >
                  Profile Settings
                </Link>
                {user.is_admin && (
                  <Link
                    to="/admin"
                    className="block w-full text-left px-3 py-2 text-gray-600 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    signout();
                    setIsOpen(false);
                    navigate('/auth');
                  }}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="block w-full text-center px-3 py-2 text-gray-600 hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;