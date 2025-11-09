import React, { useState } from 'react';
import { Clock, Phone, MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import Modal from './Modal';

interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  schedule: {
    [key: string]: { open: string; close: string } | null;
  };
  status: 'active' | 'inactive';
}

interface ClinicFormData {
  name: string;
  address: string;
  phone: string;
  schedule: {
    [key: string]: { open: string; close: string } | null;
  };
  status: 'active' | 'inactive';
}

const defaultSchedule = {
  monday: { open: '09:00', close: '17:00' },
  tuesday: { open: '09:00', close: '17:00' },
  wednesday: { open: '09:00', close: '17:00' },
  thursday: { open: '09:00', close: '17:00' },
  friday: { open: '09:00', close: '17:00' },
  saturday: null,
  sunday: null
};

// Dummy clinic data
const dummyClinics: Clinic[] = [
  {
    id: '1',
    name: 'Hameed Latif Cosmetology Centre',
    address: '81 Abu Bakr Block, New Garden Town',
    phone: '+92 329 166 4350',
    schedule: {
      monday: { open: '16:00', close: '18:00' },
      tuesday: { open: '16:00', close: '18:00' },
      wednesday: { open: '16:00', close: '18:00' },
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null
    },
    status: 'active'
  },
  {
    id: '2',
    name: 'Shalamar Hospital',
    address: 'OPD, Room 4B, Shalamar Hospital',
    phone: '+92 329 166 4350',
    schedule: {
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: { open: '11:00', close: '13:00' },
      friday: null,
      saturday: null,
      sunday: null
    },
    status: 'active'
  }
];

const ClinicManagement = () => {
  const [clinics, setClinics] = useState<Clinic[]>(dummyClinics);
  const [loading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);
  const [formData, setFormData] = useState<ClinicFormData>({
    name: '',
    address: '',
    phone: '',
    schedule: defaultSchedule,
    status: 'active'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate saving
    if (editingClinic) {
      // Update existing clinic
      setClinics(prev => prev.map(clinic => 
        clinic.id === editingClinic.id 
          ? { 
              ...clinic, 
              name: formData.name,
              address: formData.address,
              phone: formData.phone || null,
              schedule: formData.schedule,
              status: formData.status
            }
          : clinic
      ));
    } else {
      // Add new clinic
      const newClinic: Clinic = {
        id: Date.now().toString(),
        name: formData.name,
        address: formData.address,
        phone: formData.phone || null,
        schedule: formData.schedule,
        status: formData.status
      };
      setClinics(prev => [...prev, newClinic]);
    }

    closeModal();
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this clinic?')) return;
    setClinics(prev => prev.filter(clinic => clinic.id !== id));
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingClinic(null);
    setFormData({
      name: '',
      address: '',
      phone: '',
      schedule: defaultSchedule,
      status: 'active'
    });
  };

  const openEditModal = (clinic: Clinic) => {
    setEditingClinic(clinic);
    setFormData({
      name: clinic.name,
      address: clinic.address,
      phone: clinic.phone || '',
      schedule: clinic.schedule,
      status: clinic.status
    });
  };

  const handleScheduleChange = (day: string, field: 'open' | 'close', value: string) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: prev.schedule[day] ? {
          ...prev.schedule[day]!,
          [field]: value
        } : null
      }
    }));
  };

  const toggleDayEnabled = (day: string) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: prev.schedule[day] ? null : { open: '09:00', close: '17:00' }
      }
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Clinic Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Clinic
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : clinics.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No clinics found. Add your first clinic to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clinics.map((clinic) => (
            <div
              key={clinic.id}
              className={`border rounded-lg p-6 ${
                clinic.status === 'active' ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{clinic.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(clinic)}
                    className="p-1 text-gray-600 hover:text-primary-600"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(clinic.id)}
                    className="p-1 text-gray-600 hover:text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mt-1 mr-2" />
                  <span className="text-gray-600">{clinic.address}</span>
                </div>
                {clinic.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">{clinic.phone}</span>
                  </div>
                )}
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-400 mt-1 mr-2" />
                  <div className="text-sm text-gray-600">
                    {Object.entries(clinic.schedule).map(([day, hours]) => (
                      hours && (
                        <div key={day} className="capitalize">
                          {day}: {hours.open} - {hours.close}
                        </div>
                      )
                    ))}
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    clinic.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {clinic.status.charAt(0).toUpperCase() + clinic.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showAddModal || !!editingClinic}
        onClose={closeModal}
        title={editingClinic ? 'Edit Clinic' : 'Add New Clinic'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Clinic Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone (Optional)
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule
            </label>
            <div className="space-y-4">
              {Object.entries(formData.schedule).map(([day, hours]) => (
                <div key={day} className="flex items-center space-x-4">
                  <div className="w-28">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={!!hours}
                        onChange={() => toggleDayEnabled(day)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 capitalize">{day}</span>
                    </label>
                  </div>
                  {hours && (
                    <>
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => handleScheduleChange(day, 'open', e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => handleScheduleChange(day, 'close', e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:ring-primary-500"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <div className="mt-2 space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="active"
                  checked={formData.status === 'active'}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                  className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2">Active</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="inactive"
                  checked={formData.status === 'inactive'}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                  className="rounded-full border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2">Inactive</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              {editingClinic ? 'Update' : 'Add'} Clinic
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ClinicManagement;