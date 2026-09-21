import React, { useState, useEffect } from 'react';
import { getOrganizations, createOrganization, createUser, updateOrganization, deleteOrganization } from '../../services/mockDbService';
import { Plus, Search, MoreVertical, Shield, Edit, Trash2 } from 'lucide-react';
import Modal from '../../components/shared/Modal';

const Organizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState(null);

  // New Org Form State
  const [newOrg, setNewOrg] = useState({
    name: '', type: 'college', slug: '', email: '', phone: '', address: '',
    branding: { primaryColor: '#4f46e5', secondaryColor: '#f3f4f6', logo: '' },
    statsBanner: [],
    sisterOrganizations: [],
    footer: { logo: '', description: '', facultyTitle: 'Faculty', facultyDetails: '', contactTitle: 'Contact Us', contactInfo: '', mapUrl: '', copyrightText: '' }
  });

  // Edit Org Form State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editOrg, setEditOrg] = useState(null);

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
    setNewOrg({ name: '', type: 'college', slug: '', email: '', phone: '', address: '', branding: { primaryColor: '#4f46e5', secondaryColor: '#f3f4f6', logo: '' }, statsBanner: [], sisterOrganizations: [], footer: { logo: '', description: '', facultyTitle: 'Faculty', facultyDetails: '', contactTitle: 'Contact Us', contactInfo: '', mapUrl: '', copyrightText: '' } });
  };

  const handleEditClick = (org) => {
    setEditOrg({
      ...org,
      branding: org.branding || { primaryColor: '#4f46e5', secondaryColor: '#f3f4f6', logo: '' },
      statsBanner: org.statsBanner || [],
      sisterOrganizations: org.sisterOrganizations || [],
      footer: org.footer || { logo: '', description: '', facultyTitle: 'Faculty', facultyDetails: '', contactTitle: 'Contact Us', contactInfo: '', mapUrl: '', copyrightText: '' }
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteOrg = (id, slug) => {
    if (slug === 'main-portal') {
      alert("The main portal organization cannot be deleted.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this organization? All its pages, events, and notices will be permanently deleted. This action cannot be undone.")) {
      const success = deleteOrganization(id);
      if (success) {
        loadOrganizations();
      } else {
        alert("Failed to delete organization.");
      }
    }
  };

  const handleAddStat = () => {
    const newStats = [...(editOrg.statsBanner || []), { value: '', label: '', subLabel: '' }];
    setEditOrg({...editOrg, statsBanner: newStats});
  };

  const handleRemoveStat = (index) => {
    const newStats = editOrg.statsBanner.filter((_, i) => i !== index);
    setEditOrg({...editOrg, statsBanner: newStats});
  };

  const handleStatChange = (index, field, value) => {
    const newStats = [...editOrg.statsBanner];
    newStats[index][field] = value;
    setEditOrg({...editOrg, statsBanner: newStats});
  };

  // Sister Organizations Handlers (New Org)
  const handleAddNewSisterOrg = () => {
    setNewOrg({...newOrg, sisterOrganizations: [...(newOrg.sisterOrganizations || []), { name: '', link: '' }]});
  };
  const handleRemoveNewSisterOrg = (index) => {
    setNewOrg({...newOrg, sisterOrganizations: newOrg.sisterOrganizations.filter((_, i) => i !== index)});
  };
  const handleNewSisterOrgChange = (index, field, value) => {
    const updated = [...newOrg.sisterOrganizations];
    updated[index][field] = value;
    setNewOrg({...newOrg, sisterOrganizations: updated});
  };

  // Sister Organizations Handlers (Edit Org)
  const handleAddEditSisterOrg = () => {
    setEditOrg({...editOrg, sisterOrganizations: [...(editOrg.sisterOrganizations || []), { name: '', link: '' }]});
  };
  const handleRemoveEditSisterOrg = (index) => {
    setEditOrg({...editOrg, sisterOrganizations: editOrg.sisterOrganizations.filter((_, i) => i !== index)});
  };
  const handleEditSisterOrgChange = (index, field, value) => {
    const updated = [...editOrg.sisterOrganizations];
    updated[index][field] = value;
    setEditOrg({...editOrg, sisterOrganizations: updated});
  };

  const handleUpdateOrg = (e) => {
    e.preventDefault();
    updateOrganization(editOrg.id, editOrg);
    loadOrganizations();
    setIsEditModalOpen(false);
    setEditOrg(null);
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
                        <img className="h-10 w-10 rounded object-contain bg-white shadow-sm p-0.5" src={org.branding.logo} alt="" />
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
                  <div className="flex items-center justify-end space-x-3">
                    <button 
                      onClick={() => handleEditClick(org)}
                      className="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
                      title="Edit Organization"
                    >
                      <Edit size={16} /> <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => { setSelectedOrgId(org.id); setIsAdminModalOpen(true); }}
                      className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                      title="Assign Admin"
                    >
                      <Shield size={16} /> <span>Assign Admin</span>
                    </button>
                    {org.slug !== 'main-portal' && (
                      <button 
                        onClick={() => handleDeleteOrg(org.id, org.slug)}
                        className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                        title="Delete Organization"
                      >
                        <Trash2 size={16} /> <span>Delete</span>
                      </button>
                    )}
                  </div>
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
                <option value="plus-two">PlusTwo</option>
                <option value="bachelors">Bachelors</option>
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

      {/* Edit Org Modal */}
      {editOrg && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Organization">
          <form onSubmit={handleUpdateOrg} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
            {/* Basic Info */}
            <h4 className="font-medium text-gray-900 border-b pb-2">Basic Info</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700">Organization Name</label>
              <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
                     value={editOrg.name} onChange={e => setEditOrg({...editOrg, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        value={editOrg.type} onChange={e => setEditOrg({...editOrg, type: e.target.value})}>
                  <option value="school">School</option>
                  <option value="plus-two">PlusTwo</option>
                  <option value="bachelors">Bachelors</option>
                  <option value="college">College</option>
                  <option value="institute">Institute</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">URL Slug</label>
                <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
                       value={editOrg.slug} onChange={e => setEditOrg({...editOrg, slug: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Navbar Logo URL</label>
              <input type="url" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
                     value={editOrg.branding?.logo || ''} onChange={e => setEditOrg({...editOrg, branding: {...editOrg.branding, logo: e.target.value}})} 
                     placeholder="https://example.com/nav-logo.png" />
            </div>

            {/* Stats Banner */}
            <h4 className="font-medium text-gray-900 border-b pb-2 mt-6 flex justify-between items-center">
              <span>Stats Banner (Below Hero)</span>
              <button type="button" onClick={handleAddStat} className="text-xs text-blue-600 hover:text-blue-800 font-bold bg-blue-50 px-2 py-1 rounded">+ Add Stat</button>
            </h4>
            <div className="space-y-3">
              {(editOrg.statsBanner || []).map((stat, index) => (
                <div key={index} className="flex space-x-2 items-center bg-gray-50 p-2 rounded-md border border-gray-200">
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    <input type="text" placeholder="Value (e.g. 27)" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs p-1.5 border" 
                           value={stat.value} onChange={e => handleStatChange(index, 'value', e.target.value)} />
                    <input type="text" placeholder="Label (e.g. INSTITUTIONS)" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs p-1.5 border" 
                           value={stat.label} onChange={e => handleStatChange(index, 'label', e.target.value)} />
                    <input type="text" placeholder="Sub-Label (Nepali)" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs p-1.5 border" 
                           value={stat.subLabel} onChange={e => handleStatChange(index, 'subLabel', e.target.value)} />
                  </div>
                  <button type="button" onClick={() => handleRemoveStat(index)} className="text-red-500 hover:text-red-700 px-1 font-bold">✕</button>
                </div>
              ))}
              {(!editOrg.statsBanner || editOrg.statsBanner.length === 0) && (
                <p className="text-xs text-gray-500 italic">No stats added. The banner will not be displayed.</p>
              )}
            </div>
            
            {/* Sister Organizations (Edit Org - Main Portal Only) */}
            {editOrg.slug === 'main-portal' && (
              <>
                <h4 className="font-medium text-gray-900 border-b pb-2 mt-6 flex justify-between items-center">
                  <span>Sister Organizations (Navbar Buttons)</span>
                  <button type="button" onClick={handleAddEditSisterOrg} className="text-xs text-white bg-red-600 hover:bg-red-700 font-bold px-3 py-1 rounded">+ Add Sister Org</button>
                </h4>
                <div className="space-y-3">
                  {(editOrg.sisterOrganizations || []).map((sub, index) => (
                    <div key={index} className="flex space-x-2 items-center bg-gray-50 p-2 rounded-md border border-gray-200">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Name (e.g. Sister org 1 +)" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs p-1.5 border" 
                               value={sub.name} onChange={e => handleEditSisterOrgChange(index, 'name', e.target.value)} />
                        <input type="url" placeholder="Link (e.g. https://...)" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-xs p-1.5 border" 
                               value={sub.link} onChange={e => handleEditSisterOrgChange(index, 'link', e.target.value)} />
                      </div>
                      <button type="button" onClick={() => handleRemoveEditSisterOrg(index)} className="text-red-500 hover:text-red-700 px-1 font-bold">✕</button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Footer Settings */}
            <h4 className="font-medium text-gray-900 border-b pb-2 mt-6">Footer Settings</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700">Footer Logo URL</label>
              <input type="url" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
                     value={editOrg.footer.logo} onChange={e => setEditOrg({...editOrg, footer: {...editOrg.footer, logo: e.target.value}})} placeholder="https://example.com/logo.png" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Footer Description</label>
              <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
                        rows="2" value={editOrg.footer.description} onChange={e => setEditOrg({...editOrg, footer: {...editOrg.footer, description: e.target.value}})}></textarea>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-2">
               <div>
                  <label className="block text-sm font-medium text-gray-700">Faculty Section Title</label>
                  <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
                         value={editOrg.footer.facultyTitle} onChange={e => setEditOrg({...editOrg, footer: {...editOrg.footer, facultyTitle: e.target.value}})} />
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Faculty Details</label>
                    <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
                              rows="3" value={editOrg.footer.facultyDetails} onChange={e => setEditOrg({...editOrg, footer: {...editOrg.footer, facultyDetails: e.target.value}})}
                              placeholder="Science&#10;IT&#10;Management"></textarea>
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Section Title</label>
                  <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
                         value={editOrg.footer.contactTitle} onChange={e => setEditOrg({...editOrg, footer: {...editOrg.footer, contactTitle: e.target.value}})} />
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Contact Details</label>
                    <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
                              rows="3" value={editOrg.footer.contactInfo} onChange={e => setEditOrg({...editOrg, footer: {...editOrg.footer, contactInfo: e.target.value}})}
                              placeholder="contact@educms.com&#10;+1-800-EDUCMS"></textarea>
                  </div>
               </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Map Embed URL</label>
              <input type="url" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
                     value={editOrg.footer.mapUrl || ''} onChange={e => setEditOrg({...editOrg, footer: {...editOrg.footer, mapUrl: e.target.value}})} 
                     placeholder="https://www.google.com/maps/embed?..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Copyright Text</label>
              <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" 
                     value={editOrg.footer.copyrightText} onChange={e => setEditOrg({...editOrg, footer: {...editOrg.footer, copyrightText: e.target.value}})} />
            </div>
            
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button type="submit" className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:col-start-2">Save Changes</button>
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0">Cancel</button>
            </div>
          </form>
        </Modal>
      )}

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
