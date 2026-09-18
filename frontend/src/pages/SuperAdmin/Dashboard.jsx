import React, { useState, useEffect } from 'react';
import { getOrganizations, getUsers } from '../../services/mockDbService';
import { Building2, Users as UsersIcon, Activity } from 'lucide-react';

const Dashboard = () => {
  const [organizations, setOrganizations] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setOrganizations(getOrganizations());
    setUsers(getUsers());
  }, []);

  const activeOrgs = organizations.filter(o => o.status === 'active').length;
  const totalUsers = users.length;
  const orgAdmins = users.filter(u => u.role === 'ORG_ADMIN').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Organizations</p>
            <p className="text-2xl font-bold text-gray-900">{activeOrgs}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <UsersIcon size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Organization Admins</p>
            <p className="text-2xl font-bold text-gray-900">{orgAdmins}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Recent Organizations</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {organizations.map(org => (
            <div key={org.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                {org.branding?.logo ? (
                  <img src={org.branding.logo} alt="" className="w-12 h-12 rounded object-cover" />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center font-bold text-gray-500">
                    {org.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-gray-900">{org.name}</h4>
                  <p className="text-sm text-gray-500">{org.type} • {org.slug}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${org.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {org.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
