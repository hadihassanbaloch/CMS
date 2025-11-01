import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/UserComponents/Navbar';
import Hero from '../components/UserComponents/Hero';
import Services from '../components/UserComponents/Services';
import About from '../components/UserComponents/About';
import Testimonials from '../components/UserComponents/Testimonials';
import Research from '../components/UserComponents/Research';
import Blog from '../components/UserComponents/Blog';
import BlogPages from './User/BlogPages';
import Videos from '../components/UserComponents/Videos';
import SurgeryDetails from './User/SurgeryDetails';
import Footer from '../components/UserComponents/Footer';
import WhatsAppButton from '../components/UserComponents/WhatsAppButton';

function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-white to-primary-100/30"></div>
        <div className="absolute top-0 left-0 w-[800px] h-[800px] blob blob-1"></div>
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] blob blob-2"></div>
        <div className="absolute bottom-0 left-0 w-[700px] h-[700px] blob blob-3"></div>
        <div className="absolute top-2/3 right-0 w-[900px] h-[900px] blob blob-4"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <main>
                <Hero />
                <Services />
                <About />
                <Testimonials />
                <Research />
                <Videos />
                <Blog />
              </main>
            }
          />
          <Route path="/blog/*" element={<BlogPages />} />
          <Route path="/surgery/:type" element={<SurgeryDetails />} />
        </Routes>
        <Footer />
        <WhatsAppButton />
      </div>
    </div>
  );
}

export default LandingPage;
