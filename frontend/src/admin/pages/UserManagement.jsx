import React, { useState } from 'react';
import { Users, UserPlus, Search, Edit, Trash2, Shield, CheckCircle2, XCircle, MoreVertical } from 'lucide-react';

export default function UserManagement() {
  // Using empty array to avoid hardcoded static data.
  // When API is ready, fetch users and update this state.
  const [users, setUsers] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState('');

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            User Management
          </h3>
          <p className="text-slate-500 mt-1">Manage system administrators, staff, and organization roles.</p>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all shadow-sm shadow-blue-600/20 active:scale-[0.98]"
        >
          <UserPlus className="w-5 h-5" /> 
          Add New User
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search users by name, email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 font-medium w-full sm:w-auto">
            <option value="">All Roles</option>
            <option value="superadmin">Super Admin</option>
            <option value="orgadmin">Org Admin</option>
            <option value="staff">Staff</option>
          </select>
          <select className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600 font-medium w-full sm:w-auto">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table / Empty State */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px] flex flex-col">
        {users.length > 0 ? (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr className="text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4 pl-6">User Info</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Organization</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Data will be mapped here once fetched */}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-20 h-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <h4 className="text-lg font-bold text-slate-700 mb-1">No users found</h4>
            <p className="text-slate-500 max-w-sm mb-6 text-sm">There are currently no users matching your criteria, or you haven't fetched any users yet.</p>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 text-blue-600 font-semibold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors border border-blue-100"
            >
              <UserPlus className="w-4 h-4" /> 
              Add First User
            </button>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                Add New User
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                <input type="text" placeholder="e.g. Ram Bahadur" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                <input type="email" placeholder="e.g. ram@example.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Role</label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600">
                    <option value="">Select Role</option>
                    <option value="staff">Staff</option>
                    <option value="orgadmin">Organization Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Organization</label>
                  <select 
                    value={selectedOrg}
                    onChange={(e) => setSelectedOrg(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600"
                  >
                    <option value="">Select Org</option>
                    <option value="school">School</option>
                    <option value="plus2">Plus Two</option>
                    <option value="bachelors">Bachelors</option>
                    <option value="all">All</option>
                    {/* Organization list will be mapped here dynamically later */}
                  </select>
                </div>
              </div>

              {/* Conditional Faculty/Program Dropdown */}
              {(selectedOrg === 'plus2' || selectedOrg === 'school' || selectedOrg === 'bachelors') && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Faculty / Program</label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-600">
                    <option value="">Select Program</option>
                    {selectedOrg === 'school' && (
                      <>
                        <option value="class1">Class 1</option>
                        <option value="class2">Class 2</option>
                        <option value="class3">Class 3</option>
                        <option value="class4">Class 4</option>
                        <option value="class5">Class 5</option>
                        <option value="class6">Class 6</option>
                        <option value="class7">Class 7</option>
                        <option value="class8">Class 8</option>
                        <option value="class9">Class 9</option>
                        <option value="class10">Class 10</option>
                      </>
                    )}
                    {selectedOrg === 'plus2' && (
                      <>
                        <option value="science">Science</option>
                        <option value="management">Management</option>
                      </>
                    )}
                    {selectedOrg === 'bachelors' && (
                      <>
                        <option value="csit">CSIT</option>
                        <option value="bit">BIT</option>
                        <option value="bbs">BBS</option>
                        <option value="bca">BCA</option>
                        <option value="bsc">BSc</option>
                        <option value="bba">BBA</option>
                      </>
                    )}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Temporary Password</label>
                <input type="password" placeholder="Min 8 characters" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <p className="text-xs text-slate-500 mt-1">User will be prompted to change this upon first login.</p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20">
                Create User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
