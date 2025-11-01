import React, { useState } from 'react';
import { Building, Clock, Phone, MapPin, Plus, Edit, Trash2 } from 'lucide-react';
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
  sunday: null,
};

const initialClinics: Clinic[] = [
  {
    id: 'c1',
    name: 'Central Clinic',
    address: '123 Main St, City',
    phone: '021-1234567',
    schedule: defaultSchedule,
    status: 'active',
  },
  {
    id: 'c2',
    name: 'Northside Health',
    address: '45 North Ave',
    phone: null,
    schedule: {
      ...defaultSchedule,
      saturday: { open: '10:00', close: '14:00' },
    },
    status: 'active',
  },
  {
    id: 'c3',
    name: 'Evening Care',
    address: '9 Sunset Blvd',
    phone: '021-7654321',
    schedule: {
      monday: { open: '16:00', close: '21:00' },
      tuesday: { open: '16:00', close: '21:00' },
      wednesday: { open: '16:00', close: '21:00' },
      thursday: { open: '16:00', close: '21:00' },
      friday: { open: '16:00', close: '21:00' },
      saturday: null,
      sunday: null,
    },
    status: 'inactive',
  },
];

const ClinicManagement: React.FC = () => {
  const [clinics, setClinics] = useState<Clinic[]>(initialClinics);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);
  const [formData, setFormData] = useState<ClinicFormData>({
    name: '',
    address: '',
    phone: '',
    schedule: defaultSchedule,
    status: 'active',
  });

  const openAddModal = () => {
    setEditingClinic(null);
    setFormData({
      name: '',
      address: '',
      phone: '',
      schedule: defaultSchedule,
      status: 'active',
    });
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingClinic(null);
    setFormData({
      name: '',
      address: '',
      phone: '',
      schedule: defaultSchedule,
      status: 'active',
    });
  };

  const openEditModal = (clinic: Clinic) => {
    setEditingClinic(clinic);
    setFormData({
      name: clinic.name,
      address: clinic.address,
      phone: clinic.phone || '',
      schedule: clinic.schedule,
      status: clinic.status,
    });
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClinic) {
      setClinics((prev) =>
        prev.map((c) =>
          c.id === editingClinic.id
            ? {
                ...c,
                name: formData.name,
                address: formData.address,
                phone: formData.phone || null,
                schedule: formData.schedule,
                status: formData.status,
              }
            : c
        )
      );
    } else {
      const newClinic: Clinic = {
        id: `c${Date.now()}`,
        name: formData.name,
        address: formData.address,
        phone: formData.phone || null,
        schedule: formData.schedule,
        status: formData.status,
      };
      setClinics((prev) => [newClinic, ...prev]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this clinic?')) return;
    setClinics((prev) => prev.filter((c) => c.id !== id));
  };

  const handleScheduleChange = (day: string, field: 'open' | 'close', value: string) => {
    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: prev.schedule[day]
          ? {
              ...prev.schedule[day]!,
              [field]: value,
            }
          : null,
      },
    }));
  };

  const toggleDayEnabled = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: prev.schedule[day] ? null : { open: '09:00', close: '17:00' },
      },
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Clinic Management</h2>
        <button
          onClick={openAddModal}
          className="flex items-center px-4 py-2 bg-[#3b82f6] text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Clinic
        </button>
      </div>

      {clinics.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No clinics found. Add your first clinic to get started.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clinics.map((clinic) => (
            <div
              key={clinic.id}
              className={`border rounded-lg p-6 ${clinic.status === 'active' ? 'bg-white' : 'bg-gray-50'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{clinic.name}</h3>
                <div className="flex space-x-2">
                  <button onClick={() => openEditModal(clinic)} className="p-1 text-gray-600 hover:text-blue-600">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleDelete(clinic.id)} className="p-1 text-gray-600 hover:text-red-600">
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
                  <div className="text-sm text-gray-600 space-y-1">
                    {Object.entries(clinic.schedule).map(
                      ([day, hours]) =>
                        hours && (
                          <div key={day} className="capitalize">
                            {day}: {hours.open} - {hours.close}
                          </div>
                        )
                    )}
                  </div>
                </div>

                <div className="flex items-center mt-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      clinic.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {clinic.status.charAt(0).toUpperCase() + clinic.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showAddModal || !!editingClinic} onClose={closeModal} title={editingClinic ? 'Edit Clinic' : 'Add New Clinic'}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Clinic Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-400 focus:ring-blue-200"
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
              onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-400 focus:ring-blue-200"
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
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-400 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
            <div className="space-y-4">
              {Object.entries(formData.schedule).map(([day, hours]) => (
                <div key={day} className="flex items-center space-x-4">
                  <div className="w-28">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={!!hours}
                        onChange={() => toggleDayEnabled(day)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-200"
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
                        className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-400 focus:ring-blue-200"
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => handleScheduleChange(day, 'close', e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-2 focus:border-blue-400 focus:ring-blue-200"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <div className="mt-2 space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="active"
                  checked={formData.status === 'active'}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                  className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-200"
                />
                <span className="ml-2">Active</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="inactive"
                  checked={formData.status === 'inactive'}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                  className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-200"
                />
                <span className="ml-2">Inactive</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-[#e53935] text-white rounded-md hover:opacity-95">
              {editingClinic ? 'Update' : 'Add'} Clinic
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ClinicManagement;