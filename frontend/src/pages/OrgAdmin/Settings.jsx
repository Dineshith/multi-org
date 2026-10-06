import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getOrganization, updateOrganization, updateUser } from '../../services/apiService';
import { toast } from 'react-toastify';
import { Building, Lock, Save } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('organization');
  const [organization, setOrganization] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    const fetchOrg = async () => {
      if (user && user.organizationId) {
        try {
          const { default: apiClient } = await import('../../services/apiClient');
          const res = await apiClient.get('/admin/dashboard');
          if (res && res.data && res.data.organization) {
            const org = res.data.organization;
            
            // Merge with local mock data since backend update is restricted
            let localData = {};
            try {
               localData = JSON.parse(localStorage.getItem(`orgSettings_${org.id}`) || '{}');
            } catch(e) {}
            
            setOrganization({
              ...org,
              ...localData,
              branding: localData.branding || org.branding || { primaryColor: '#4f46e5', secondaryColor: '#f3f4f6', logo: org.logo_url || '' },
              footer: localData.footer || org.footer || { logo: '', description: org.footer_description || '', facultyTitle: 'Faculty', facultyDetails: '', contactTitle: 'Contact Us', contactInfo: '', mapUrl: org.map_link || '', copyrightText: org.copyright_text || '' }
            });
          }
        } catch (e) {
          console.error("Failed to fetch organization for org admin", e);
        }
      }
    };
    fetchOrg();
  }, [user]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Backend update endpoint is restricted to SUPER_ADMIN
    try {
        const payload = {
            name: organization.name,
            email: organization.email,
            phone: organization.phone,
            address: organization.address,
            logo_url: organization.branding?.logo || organization.logo_url,
            footer_description: organization.footer?.description || organization.footer_description,
            copyright_text: organization.footer?.copyrightText || organization.copyright_text,
            map_link: organization.footer?.mapUrl || organization.map_link
        };
        const res = await updateOrganization(organization.id, payload);
        
        if (res) {
          toast.success('Settings updated successfully!');
        } else {
          toast.error('Failed to update settings. Access denied.');
        }
        setIsSaving(false);
    } catch (err) {
        setIsSaving(false);
        toast.error('Failed to update settings.');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!user || !user.id) return;
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setIsSavingPassword(true);
    
    // Attempt actual API call
    const res = await updateUser(user.id, { password });
    
    if (res && res.success) {
      toast.success('Password updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } else {
      toast.error(res?.message || 'Failed to update password. Access denied.');
    }
    
    setIsSavingPassword(false);
  };

  if (!organization) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Organization Settings</h1>
        <p className="text-gray-500">Manage your organization's general details and footer branding.</p>
      </div>
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('organization')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'organization'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Building size={16} />
            <span>Organization Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
              activeTab === 'password'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Lock size={16} />
            <span>Change Password</span>
          </button>
        </nav>
      </div>

      {activeTab === 'organization' && (
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
              <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                     value={organization.footer.mapUrl || ''} 
                     onChange={e => {
                       let val = e.target.value;
                       const match = val.match(/src="([^"]+)"/);
                       if (match) val = match[1];
                       setOrganization({...organization, footer: {...organization.footer, mapUrl: val}});
                     }} 
                     placeholder="Paste URL or <iframe> code..." />
              <p className="mt-1 text-xs text-gray-500">Provide a valid Google Maps embed URL or paste the entire iframe code.</p>
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
            <Save size={16} className="mr-2" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
      )}

      {activeTab === 'password' && (
        <form onSubmit={handleUpdatePassword} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
          <div>
            <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input 
                  type="password" 
                  required 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input 
                  type="password" 
                  required 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                />
              </div>
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSavingPassword}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <Save size={16} className="mr-2" />
              {isSavingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Settings;
