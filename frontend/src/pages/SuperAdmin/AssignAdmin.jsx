import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUsers, deleteUser, createUser } from '../../services/apiService';
import { Search, Trash2, User, Plus, ArrowLeft, Building } from 'lucide-react';
import { toast } from 'react-toastify';

const AssignAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orgId = location.state?.orgId;
  const orgName = location.state?.orgName || 'Organization';

  const [view, setView] = useState('list'); // 'list' | 'add'
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: 'password123' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!orgId) {
      navigate('/platform-admin/organizations');
      return;
    }
    if (view === 'list') {
      loadAdmins();
    }
  }, [view, orgId, navigate]);

  const loadAdmins = async () => {
    setIsLoading(true);
    const users = await getUsers();
    // Filter only ORG_ADMINs for this specific organization
    const orgAdmins = users.filter(user => user.role === 'ORG_ADMIN' && user.organization_id === orgId);
    setAdmins(orgAdmins);
    setIsLoading(false);
  };

  const handleDeleteAdmin = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete admin "${name}"? They will no longer be able to log in.`)) {
      const res = await deleteUser(id);
      if (res && res.success) {
        toast.success(`Admin deleted successfully!`);
        loadAdmins();
      } else {
        toast.error("Failed to delete admin.");
      }
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await createUser({
      ...newAdmin,
      role: 'ORG_ADMIN',
      organization_id: orgId
    });
    setIsSubmitting(false);

    if (res && res.success) {
      setNewAdmin({ name: '', email: '', password: 'password123' });
      toast.success('Admin created successfully!', { autoClose: false });
      setView('list'); // Switch back to the list view
    } else {
      toast.error(res?.message || 'Failed to create Admin. Please try again.');
    }
  };

  const filteredAdmins = admins.filter(admin => 
    (admin.name && admin.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (admin.email && admin.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (view === 'add') {
    return (
      <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <button onClick={() => setView('list')} className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm font-medium">
              <ArrowLeft size={16} /> Back to List
            </button>
            <h3 className="text-lg font-semibold text-gray-900">Assign New Admin</h3>
          </div>
          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Admin Name</label>
              <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                value={newAdmin.name} onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Admin Email</label>
              <input required type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                value={newAdmin.email} onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} />
            </div>
            <div>
              <p className="text-sm text-gray-500 mt-2">Default Password will be set to: <strong>password123</strong></p>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button type="submit" disabled={isSubmitting} className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:col-start-2 disabled:bg-blue-400">
                {isSubmitting ? 'Assigning...' : 'Assign Admin'}
              </button>
              <button type="button" onClick={() => setView('list')} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <div className="relative w-full max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50"
            placeholder="Search admins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setView('add')}
          className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus size={16} /> Add Admin
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 text-sm">Loading admins...</div>
        ) : filteredAdmins.length === 0 ? (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center">
            <User className="h-10 w-10 text-gray-300 mb-2" />
            <p className="text-sm font-medium text-gray-900">No Admins Found</p>
            <p className="text-xs mt-1 text-gray-500">Click 'Add Admin' to assign one.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Admin</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                        {admin.profile_photo_url ? (
                          <img src={admin.profile_photo_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                        ) : (
                          admin.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{admin.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {admin.email}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                      className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded-md transition-colors inline-flex"
                      title="Delete Admin"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="mt-4 flex justify-end pt-4 border-t border-gray-100">
        <button type="button" onClick={() => navigate('/platform-admin/organizations')} className="inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 gap-2 items-center">
          <ArrowLeft size={16} /> Back to Organizations
        </button>
      </div>
      </div>
    </div>
  );
};

export default AssignAdmin;
