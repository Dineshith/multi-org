import React, { useState, useEffect } from 'react';
import { getOrganizations, createOrganization, createUser } from '../../services/mockDbService';
import { Plus, Search, MoreVertical, Shield } from 'lucide-react';
import Modal from '../../components/shared/Modal';

const Organizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState(null);

  // New Org Form State
  const [newOrg, setNewOrg] = useState({
    name: '', type: 'college', slug: '', email: '', phone: '', address: '',
    branding: { primaryColor: '#4f46e5', secondaryColor: '#f3f4f6', logo: '' }
  });

  // New Admin Form State
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: 'password123' });

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = () => {
    setOrganizations(getOrganizations());
  };

  const handleCreateOrg = (e) => {
    e.preventDefault();
    createOrganization(newOrg);
    loadOrganizations();
    setIsOrgModalOpen(false);
    setNewOrg({ name: '', type: 'college', slug: '', email: '', phone: '', address: '', branding: { primaryColor: '#4f46e5', secondaryColor: '#f3f4f6', logo: '' } });
  };

  const handleCreateAdmin = (e) => {
    e.preventDefault();
    createUser({
      ...newAdmin,
      role: 'ORG_ADMIN',
      organizationId: selectedOrgId
    });
    setIsAdminModalOpen(false);
    setNewAdmin({ name: '', email: '', password: 'password123' });
    alert('Admin created successfully! They can log in with password: password123');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search organizations..."
          />
        </div>
        <button 
          onClick={() => setIsOrgModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>New Organization</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {organizations.map((org) => (
              <tr key={org.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {org.branding?.logo ? (
                        <img className="h-10 w-10 rounded object-cover" src={org.branding.logo} alt="" />
                      ) : (
                        <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {org.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{org.name}</div>
                      <div className="text-sm text-gray-500">/{org.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="capitalize text-sm text-gray-900">{org.type}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{org.address.split(',')[0]}</div>
                  <div className="text-sm text-gray-500">{org.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    org.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {org.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => { setSelectedOrgId(org.id); setIsAdminModalOpen(true); }}
                    className="text-blue-600 hover:text-blue-900 flex items-center space-x-1 ml-auto"
                    title="Assign Admin"
                  >
                    <Shield size={16} /> <span>Assign Admin</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Org Modal */}
      <Modal isOpen={isOrgModalOpen} onClose={() => setIsOrgModalOpen(false)} title="Create New Organization">
        <form onSubmit={handleCreateOrg} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Organization Name</label>
            <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
                   value={newOrg.name} onChange={e => setNewOrg({...newOrg, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      value={newOrg.type} onChange={e => setNewOrg({...newOrg, type: e.target.value})}>
                <option value="school">School</option>
                <option value="college">College</option>
                <option value="institute">Institute</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">URL Slug</label>
              <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
                     value={newOrg.slug} onChange={e => setNewOrg({...newOrg, slug: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input required type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
                     value={newOrg.email} onChange={e => setNewOrg({...newOrg, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
                     value={newOrg.phone} onChange={e => setNewOrg({...newOrg, phone: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
                   value={newOrg.address} onChange={e => setNewOrg({...newOrg, address: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Theme Color (Hex)</label>
            <div className="flex space-x-2 mt-1">
               <input type="color" className="h-9 w-9 rounded border border-gray-300" 
                      value={newOrg.branding.primaryColor} onChange={e => setNewOrg({...newOrg, branding: {...newOrg.branding, primaryColor: e.target.value}})} />
               <input type="text" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
                      value={newOrg.branding.primaryColor} onChange={e => setNewOrg({...newOrg, branding: {...newOrg.branding, primaryColor: e.target.value}})} />
            </div>
          </div>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button type="submit" className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:col-start-2">Create</button>
            <button type="button" onClick={() => setIsOrgModalOpen(false)} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0">Cancel</button>
          </div>
        </form>
      </Modal>

      {/* Assign Admin Modal */}
      <Modal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} title="Assign Organization Admin">
        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Admin Name</label>
            <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
                   value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Admin Email</label>
            <input required type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
                   value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} />
          </div>
          <div>
            <p className="text-sm text-gray-500 mt-2">Default Password will be set to: <strong>password123</strong></p>
          </div>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button type="submit" className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:col-start-2">Assign Admin</button>
            <button type="button" onClick={() => setIsAdminModalOpen(false)} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Organizations;
