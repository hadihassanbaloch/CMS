import React from 'react';
import { Stethoscope } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Stethoscope className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">Prof Dr. Maaz Ul Hassan</span>
            </div>
            <p className="text-gray-400 max-w-md">
              Leading General, Laparoscopic, and Bariatric Surgeon in Lahore, Pakistan.
              Committed to providing exceptional surgical care using advanced minimally
              invasive techniques.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#about" className="text-gray-400 hover:text-white">About</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white">Services</a></li>
              <li><a href="#testimonials" className="text-gray-400 hover:text-white">Testimonials</a></li>
              <li><a href="#blog" className="text-gray-400 hover:text-white">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Shalimar Link Road</li>
              <li>Shalimar Larechs Colony</li>
              <li>Lahore, Punjab 54000</li>
              <li>
                <a 
                  href="tel:+923009421994" 
                  className="hover:text-white transition-colors"
                >
                  Phone: +92 300 942 1994
                </a>
              </li>
              <li>
                <a 
                  href="mailto:maazul.hassan@sihs.org.pk"
                  className="hover:text-white transition-colors"
                >
                  Email: maazul.hassan@sihs.org.pk
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Prof Dr. Maaz Ul Hassan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;