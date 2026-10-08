import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStaff, createStaff, deleteStaff, updateStaff } from '../../services/apiService';
import { Plus, Search, MoreVertical, Trash2, Mail, Phone, MapPin, X, Upload, GraduationCap, Briefcase, Pencil } from 'lucide-react';
import Modal from '../../components/shared/Modal';
import { toast } from 'react-toastify';

const Staff = () => {
  const { user } = useAuth();
  const [staffList, setStaffList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    designation: '',
    department: '',
    qualification: '',
    photo_url: ''
  });

  useEffect(() => {
    loadStaff();
  }, [user.organizationId]);

  const loadStaff = async () => {
    const data = await getStaff(user.organizationId);
    setStaffList(data);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewStaff({ ...newStaff, photo_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setNewStaff({ ...newStaff, photo_url: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Map address to bio since DB expects bio
    const payload = {
      ...newStaff,
      bio: newStaff.address
    };

    let res;
    if (newStaff.id) {
      res = await updateStaff(newStaff.id, payload);
      if (res) toast.success("Staff updated successfully!");
      else toast.error("Failed to update staff");
    } else {
      res = await createStaff(user.organizationId, payload);
      if (res) toast.success("Staff added successfully!");
      else toast.error("Failed to add staff");
    }

    if (res) {
      setIsModalOpen(false);
      setNewStaff({ name: '', email: '', phone: '', address: '', designation: '', department: '', qualification: '', photo_url: '' });
      await loadStaff();
    }
    setIsLoading(false);
  };

  const handleEdit = (staff) => {
    setNewStaff({
      ...staff,
      address: staff.bio || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      const res = await deleteStaff(id);
      if (res) {
        toast.success("Staff deleted successfully!");
        await loadStaff();
      } else {
        toast.error("Failed to delete staff");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Staff Management</h2>
        <button
          onClick={() => {
            setNewStaff({ name: '', email: '', phone: '', address: '', designation: '', department: '', qualification: '', photo_url: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>Add Staff</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {staffList.map((staff) => (
          <div key={staff.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="h-24 bg-indigo-50 flex justify-end p-2 space-x-2">
               <button 
                  onClick={() => handleEdit(staff)}
                  className="h-8 w-8 bg-white/80 hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 rounded-full flex items-center justify-center transition-colors"
                  title="Edit Staff"
               >
                 <Pencil size={16} />
               </button>
               <button 
                  onClick={() => handleDelete(staff.id)}
                  className="h-8 w-8 bg-white/80 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-full flex items-center justify-center transition-colors"
                  title="Delete Staff"
               >
                 <Trash2 size={16} />
               </button>
            </div>
            <div className="px-6 flex flex-col items-center -mt-12 flex-grow">
              <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-100 shadow-sm flex items-center justify-center">
                {staff.photo_url ? (
                  <img src={staff.photo_url} alt={staff.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl text-gray-400 font-semibold">{staff.name.charAt(0)}</span>
                )}
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900 text-center">{staff.name}</h3>
              <p className="text-sm font-medium text-indigo-600 mb-4">{staff.designation}</p>
              
              <div className="w-full space-y-2 mb-6">
                {staff.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{staff.email}</span>
                  </div>
                )}
                {staff.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                    <span>{staff.phone}</span>
                  </div>
                )}
                {staff.department && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Briefcase size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{staff.department}</span>
                  </div>
                )}
                {staff.qualification && (
                  <div className="flex items-center text-sm text-gray-600">
                    <GraduationCap size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{staff.qualification}</span>
                  </div>
                )}
                {staff.bio && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{staff.bio}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {staffList.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-gray-100 border-dashed">
            <p className="text-gray-500">No staff members found. Click "Add Staff" to create one.</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={newStaff.id ? "Edit Staff" : "Add New Staff"}>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto px-1 pb-4">
          
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 overflow-hidden bg-gray-50 flex items-center justify-center">
                {newStaff.photo_url ? (
                  <img src={newStaff.photo_url} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <Upload size={24} />
                    <span className="text-xs mt-1">Photo</span>
                  </div>
                )}
              </div>
              
              {newStaff.photo_url ? (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200 transition-colors shadow-sm"
                  title="Remove Image"
                >
                  <X size={16} />
                </button>
              ) : (
                <label className="absolute -bottom-2 -right-2 bg-indigo-100 text-indigo-600 rounded-full p-2 cursor-pointer hover:bg-indigo-200 transition-colors shadow-sm" title="Upload Image">
                  <Plus size={16} />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name *</label>
            <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              value={newStaff.name} onChange={e => setNewStaff({ ...newStaff, name: e.target.value })} placeholder="John Doe" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Post / Designation *</label>
              <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={newStaff.designation} onChange={e => setNewStaff({ ...newStaff, designation: e.target.value })} placeholder="e.g. Teacher, Principal" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone No</label>
              <input type="tel" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={newStaff.phone} onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })} placeholder="98XXXXXXXX" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              value={newStaff.email} onChange={e => setNewStaff({ ...newStaff, email: e.target.value })} placeholder="john@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              value={newStaff.address} onChange={e => setNewStaff({ ...newStaff, address: e.target.value })} placeholder="City, Region" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={newStaff.department} onChange={e => setNewStaff({ ...newStaff, department: e.target.value })} placeholder="e.g. Science, Administration" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Qualification</label>
              <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                value={newStaff.qualification} onChange={e => setNewStaff({ ...newStaff, qualification: e.target.value })} placeholder="e.g. MSc, PhD" />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
              {isLoading ? 'Saving...' : 'Save Staff'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Staff;
