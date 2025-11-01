import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.overflow = 'unset';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" onClick={onClose}></div>
      <div className="fixed inset-0 overflow-y-auto">
        <div className="relative bg-white w-full min-h-screen overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="sticky top-0 z-[90] flex justify-between items-center mb-8 bg-white py-4">
              <h3 className="text-3xl font-bold text-gray-900">{title}</h3>
            </div>
            <div className="mt-6">
              {children}
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[110] p-3 rounded-full bg-white hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-xl"
      >
        <X className="h-6 w-6 text-gray-500 hover:text-gray-700" />
      </button>
    </div>
  );
};

export default Modal;