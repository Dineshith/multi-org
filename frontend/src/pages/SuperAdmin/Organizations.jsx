import React, { useState, useEffect } from 'react';
import { getOrganizations, createOrganization, updateOrganization, deleteOrganization } from '../../services/apiService';
import { Plus, Search, MoreVertical, Shield, Edit, Trash2, Eye, Minimize2 } from 'lucide-react';
import Modal from '../../components/shared/Modal';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Organizations = () => {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState(null);

  // New Org Form State
  const [newOrg, setNewOrg] = useState({
    name: '', type: 'school', slug: '', email: '', phone: '', address: '',
    branding: { primaryColor: '#4f46e5', secondaryColor: '#f3f4f6', logo: '' },
    statsBanner: [],
    sisterOrganizations: [],
    footer: { logo: '', description: '', facultyTitle: 'Faculty', facultyDetails: '', contactTitle: 'Contact Us', contactInfo: '', mapUrl: '', copyrightText: '' }
  });

  // Edit Org Form State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editOrg, setEditOrg] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // New Admin Form State
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: 'password123' });

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    const data = await getOrganizations();
    setOrganizations(data);
  };

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    const res = await createOrganization(newOrg);
    if (res) {
      toast.success("Congratulations! New organization created successfully. Please assign an Org Admin so they can log in.", { autoClose: false });
      await loadOrganizations();
      setIsOrgModalOpen(false);
      setNewOrg({ name: '', type: 'school', slug: '', email: '', phone: '', address: '', branding: { primaryColor: '#4f46e5', secondaryColor: '#f3f4f6', logo: '' }, statsBanner: [], sisterOrganizations: [], footer: { logo: '', description: '', facultyTitle: 'Faculty', facultyDetails: '', contactTitle: 'Contact Us', contactInfo: '', mapUrl: '', copyrightText: '' } });
    } else {
      toast.error("Failed to create organization.");
    }
  };

  const handleEditClick = (org) => {
    setEditOrg({
      ...org,
      branding: org.branding || { primaryColor: '#4f46e5', secondaryColor: '#f3f4f6', logo: '' },
      statsBanner: org.statsBanner || [],
      sisterOrganizations: org.sisterOrganizations || [],
      footer: {
        ...(org.footer || {}),
        logo: org.footer?.logo || '',
        description: org.footer?.description || org.footer_description || '',
        facultyTitle: org.footer?.facultyTitle || 'Faculty',
        facultyDetails: org.footer?.facultyDetails || '',
        contactTitle: org.footer?.contactTitle || 'Contact Us',
        contactInfo: org.footer?.contactInfo || '',
        mapUrl: org.footer?.mapUrl || org.map_link || '',
        copyrightText: org.footer?.copyrightText || org.copyright_text || ''
      }
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteOrg = async (id, slug) => {
    if (slug === 'main-portal') {
      toast.error("The main portal organization cannot be deleted.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this organization? All its pages, events, and notices will be permanently deleted. This action cannot be undone.")) {
      const success = await deleteOrganization(id);
      if (success) {
        toast.success("Organization deleted successfully!");
        await loadOrganizations();
      } else {
        toast.error("Failed to delete organization.");
      }
    }
  };

  const handleAddStat = () => {
    const newStats = [...(editOrg.statsBanner || []), { value: '', label: '', subLabel: '' }];
    setEditOrg({ ...editOrg, statsBanner: newStats });
  };

  const handleRemoveStat = (index) => {
    const newStats = editOrg.statsBanner.filter((_, i) => i !== index);
    setEditOrg({ ...editOrg, statsBanner: newStats });
  };

  const handleStatChange = (index, field, value) => {
    const newStats = [...editOrg.statsBanner];
    newStats[index][field] = value;
    setEditOrg({ ...editOrg, statsBanner: newStats });
  };

  // Sister Organizations Handlers (New Org)
  const handleAddNewSisterOrg = () => {
    setNewOrg({ ...newOrg, sisterOrganizations: [...(newOrg.sisterOrganizations || []), { name: '', link: '' }] });
  };
  const handleRemoveNewSisterOrg = (index) => {
    setNewOrg({ ...newOrg, sisterOrganizations: newOrg.sisterOrganizations.filter((_, i) => i !== index) });
  };
  const handleNewSisterOrgChange = (index, field, value) => {
    const updated = [...newOrg.sisterOrganizations];
    updated[index][field] = value;
    setNewOrg({ ...newOrg, sisterOrganizations: updated });
  };

  // Sister Organizations Handlers (Edit Org)
  const handleAddEditSisterOrg = () => {
    setEditOrg({ ...editOrg, sisterOrganizations: [...(editOrg.sisterOrganizations || []), { name: '', link: '' }] });
  };
  const handleRemoveEditSisterOrg = (index) => {
    setEditOrg({ ...editOrg, sisterOrganizations: editOrg.sisterOrganizations.filter((_, i) => i !== index) });
  };
  const handleEditSisterOrgChange = (index, field, value) => {
    const updated = [...editOrg.sisterOrganizations];
    updated[index][field] = value;
    setEditOrg({ ...editOrg, sisterOrganizations: updated });
  };

  const handleUpdateOrg = async (e) => {
    e.preventDefault();
    const payload = {
      ...editOrg,
      map_link: editOrg.footer?.mapUrl || editOrg.map_link,
      copyright_text: editOrg.footer?.copyrightText || editOrg.copyright_text
    };
    const res = await updateOrganization(editOrg.id, payload);
    if (res) {
      toast.success("Organization successfully updated!");
      await loadOrganizations();
      setIsEditModalOpen(false);
      setEditOrg(null);
    } else {
      toast.error("Failed to update organization.");
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    const res = await createUser({
      ...newAdmin,
      role: 'ORG_ADMIN',
      organization_id: selectedOrgId
    });
    if (res && res.success) {
      setIsAdminModalOpen(false);
      setNewAdmin({ name: '', email: '', password: 'password123' });
      toast.success('Admin created successfully! They can log in with password: password123', { autoClose: false });
    } else {
      toast.error(res?.message || 'Failed to create Admin. Please try again.');
    }
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
                      {org.logo_url || org.branding?.logo ? (
                        <img className="h-10 w-10 rounded object-contain bg-white shadow-sm p-0.5" src={org.logo_url || org.branding?.logo} alt="" />
                      ) : (
                        <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                          {org.name ? org.name.charAt(0) : '?'}
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
                  <div className="text-sm text-gray-900">{org.address ? org.address.split(',')[0] : 'No address'}</div>
                  <div className="text-sm text-gray-500">{org.phone || 'No phone'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${org.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
                      onClick={() => navigate('/platform-admin/assign-admin', { state: { orgId: org.id, orgName: org.name } })}
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
              value={newOrg.name} onChange={e => setNewOrg({ ...newOrg, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                value={newOrg.type} onChange={e => setNewOrg({ ...newOrg, type: e.target.value })}>
                <option value="school">School</option>
                <option value="plus-two">PlusTwo</option>
                <option value="bachelors">Bachelors</option>
                <option value="institute">Institute</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">URL Slug</label>
              <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                value={newOrg.slug} onChange={e => setNewOrg({ ...newOrg, slug: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input required type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                value={newOrg.email} onChange={e => setNewOrg({ ...newOrg, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                value={newOrg.phone} onChange={e => setNewOrg({ ...newOrg, phone: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              value={newOrg.address} onChange={e => setNewOrg({ ...newOrg, address: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Theme Color (Hex)</label>
            <div className="flex space-x-2 mt-1">
              <input type="color" className="h-9 w-9 rounded border border-gray-300"
                value={newOrg.branding.primaryColor} onChange={e => setNewOrg({ ...newOrg, branding: { ...newOrg.branding, primaryColor: e.target.value } })} />
              <input type="text" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                value={newOrg.branding.primaryColor} onChange={e => setNewOrg({ ...newOrg, branding: { ...newOrg.branding, primaryColor: e.target.value } })} />
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
                value={editOrg.name} onChange={e => setEditOrg({ ...editOrg, name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  value={editOrg.type} onChange={e => setEditOrg({ ...editOrg, type: e.target.value })}>
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
                  value={editOrg.slug} onChange={e => setEditOrg({ ...editOrg, slug: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Logo (Navbar & Footer)</label>
              {!editOrg.logo_url && (
                <input type="file" accept="image/*" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-1.5 border"
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setEditOrg({ 
                          ...editOrg, 
                          logo_url: reader.result,
                          branding: { ...editOrg.branding, logo: reader.result },
                          footer: { ...editOrg.footer, logo: reader.result }
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }} />
              )}
              {editOrg.logo_url && (
                 <div className="mt-3 relative inline-block">
                   <img src={editOrg.logo_url} alt="Logo Preview" className="h-12 object-contain bg-gray-50 border rounded p-1" />
                   <button 
                     type="button"
                     onClick={() => setPreviewImage(editOrg.logo_url)}
                     className="absolute -top-2 -left-2 bg-white text-blue-500 border border-gray-200 rounded-full w-5 h-5 flex items-center justify-center hover:text-blue-700 hover:bg-gray-50 shadow-sm"
                     title="View image"
                   >
                     <Eye size={12} />
                   </button>
                   <button 
                     type="button" 
                     onClick={() => setEditOrg({ 
                       ...editOrg, 
                       logo_url: '',
                       branding: { ...editOrg.branding, logo: '' },
                       footer: { ...editOrg.footer, logo: '' }
                     })} 
                     className="absolute -top-2 -right-2 bg-white text-red-500 border border-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs hover:text-red-700 hover:bg-gray-50 shadow-sm font-bold"
                     title="Remove image"
                   >
                     ✕
                   </button>
                 </div>
              )}
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
              <label className="block text-sm font-medium text-gray-700">Footer Description</label>
              <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                rows="2" value={editOrg.footer_description || ''} onChange={e => setEditOrg({ ...editOrg, footer_description: e.target.value })}></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Faculty Section Title</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  value={editOrg.footer.facultyTitle} onChange={e => setEditOrg({ ...editOrg, footer: { ...editOrg.footer, facultyTitle: e.target.value } })} />

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Faculty Details</label>
                  <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    rows="3" value={editOrg.footer.facultyDetails} onChange={e => setEditOrg({ ...editOrg, footer: { ...editOrg.footer, facultyDetails: e.target.value } })}
                    placeholder="Science&#10;IT&#10;Management"></textarea>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Section Title</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  value={editOrg.footer.contactTitle} onChange={e => setEditOrg({ ...editOrg, footer: { ...editOrg.footer, contactTitle: e.target.value } })} />

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Contact Details</label>
                  <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    rows="3" value={editOrg.footer.contactInfo} onChange={e => setEditOrg({ ...editOrg, footer: { ...editOrg.footer, contactInfo: e.target.value } })}
                    placeholder="contact@educms.com&#10;+1-800-EDUCMS"></textarea>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Map Embed URL</label>
              <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                value={editOrg.footer.mapUrl || ''}
                onChange={e => {
                  let val = e.target.value;
                  const match = val.match(/src="([^"]+)"/);
                  if (match) val = match[1];
                  setEditOrg({ ...editOrg, footer: { ...editOrg.footer, mapUrl: val } });
                }}
                placeholder="Paste URL or <iframe> code..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Copyright Text</label>
              <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                value={editOrg.footer.copyrightText} onChange={e => setEditOrg({ ...editOrg, footer: { ...editOrg.footer, copyrightText: e.target.value } })} />
            </div>

            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button type="submit" className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:col-start-2">Save Changes</button>
              <button type="button" onClick={() => setIsEditModalOpen(false)} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0">Cancel</button>
            </div>
          </form>
        </Modal>
      )}



      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-80 p-4">
          <div className="relative max-w-5xl max-h-full flex flex-col items-center">
            <button 
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 bg-gray-800 bg-opacity-50 hover:bg-opacity-100 rounded-full p-2 transition-all"
              title="Minimize"
            >
              <Minimize2 size={24} />
            </button>
            <img 
              src={previewImage} 
              alt="Full Preview" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl bg-white" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Organizations;
