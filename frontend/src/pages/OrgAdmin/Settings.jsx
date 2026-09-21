import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getOrganization, updateOrganization } from '../../services/mockDbService';

const Settings = () => {
  const { user } = useAuth();
  const [organization, setOrganization] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user && user.organizationId) {
      const org = getOrganization(user.organizationId);
      if (org) {
        setOrganization({
          ...org,

          branding: org.branding || { primaryColor: '#4f46e5', secondaryColor: '#f3f4f6', logo: '' },
          footer: org.footer || { logo: '', description: '', facultyTitle: 'Faculty', facultyDetails: '', contactTitle: 'Contact Us', contactInfo: '', mapUrl: '', copyrightText: '' }
        });
      }
    }
  }, [user]);


  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      updateOrganization(organization.id, organization);
      setIsSaving(false);
      setSuccessMsg('Settings updated successfully!');
      
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 500);
  };

  if (!organization) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Organization Settings</h1>
        <p className="text-gray-500">Manage your organization's general details and footer branding.</p>
      </div>

      {successMsg && (
        <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        
        {/* General Details */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">General Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Organization Name</label>
              <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                     value={organization.name} onChange={e => setOrganization({...organization, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                     value={organization.phone} onChange={e => setOrganization({...organization, phone: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                     value={organization.email} onChange={e => setOrganization({...organization, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Navbar Logo URL</label>
              <input type="url" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                     value={organization.branding?.logo || ''} onChange={e => setOrganization({...organization, branding: {...organization.branding, logo: e.target.value}})} 
                     placeholder="https://example.com/nav-logo.png" />
              <p className="mt-1 text-xs text-gray-500">Provide an absolute URL to an image. Leave blank to use organization name.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Physical Address</label>
              <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                     value={organization.address} onChange={e => setOrganization({...organization, address: e.target.value})} />
            </div>
          </div>
        </div>


        {/* Footer Settings */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Footer Settings (Public Layout)</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Footer Logo URL</label>
              <input type="url" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                     value={organization.footer.logo} onChange={e => setOrganization({...organization, footer: {...organization.footer, logo: e.target.value}})} placeholder="https://example.com/logo.png" />
              <p className="mt-1 text-xs text-gray-500">Provide an absolute URL to an image. Leave blank to use organization name.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Footer Description</label>
              <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                        rows="3" value={organization.footer.description} onChange={e => setOrganization({...organization, footer: {...organization.footer, description: e.target.value}})}
                        placeholder="E.g. Empowering higher education and excellence."></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-medium text-gray-700">Faculty Section Title</label>
                  <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                         value={organization.footer.facultyTitle} onChange={e => setOrganization({...organization, footer: {...organization.footer, facultyTitle: e.target.value}})} />
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Faculty Details (One per line)</label>
                    <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                              rows="4" value={organization.footer.facultyDetails} onChange={e => setOrganization({...organization, footer: {...organization.footer, facultyDetails: e.target.value}})}
                              placeholder="Science&#10;IT&#10;Management"></textarea>
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Section Title</label>
                  <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                         value={organization.footer.contactTitle} onChange={e => setOrganization({...organization, footer: {...organization.footer, contactTitle: e.target.value}})} />
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Contact Details (One per line)</label>
                    <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                              rows="4" value={organization.footer.contactInfo} onChange={e => setOrganization({...organization, footer: {...organization.footer, contactInfo: e.target.value}})}
                              placeholder="contact@educms.com&#10;+1-800-EDUCMS"></textarea>
                  </div>
               </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Map Embed URL</label>
              <input type="url" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                     value={organization.footer.mapUrl || ''} onChange={e => setOrganization({...organization, footer: {...organization.footer, mapUrl: e.target.value}})} 
                     placeholder="https://www.google.com/maps/embed?..." />
              <p className="mt-1 text-xs text-gray-500">Provide a valid Google Maps embed URL.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Copyright Text</label>
              <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                     value={organization.footer.copyrightText} onChange={e => setOrganization({...organization, footer: {...organization.footer, copyrightText: e.target.value}})} 
                     placeholder="© 2026 EduCMS Platform. All rights reserved." />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
