import React, { useState } from 'react';
import { Check, X, Clock, Key } from 'lucide-react';

const PasswordRequests = () => {
  // Mock data for password reset requests (Frontend only as requested)
  const [requests, setRequests] = useState(() => {
    return JSON.parse(localStorage.getItem('passwordRequests') || '[]');
  });

  const handleAction = (id, action) => {
    const updatedRequests = requests.map(req => {
      if (req.id === id) {
        return { ...req, status: action };
      }
      return req;
    });
    setRequests(updatedRequests);
    localStorage.setItem('passwordRequests', JSON.stringify(updatedRequests));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Password Reset Requests</h1>
          <p className="text-gray-500 mt-1">Manage password reset requests from organization admins.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-6 text-sm font-semibold text-gray-600">Organization</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600">Admin Details</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600">Requested On</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                <th className="py-4 px-6 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-800">{request.orgName}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-800">{request.adminName}</div>
                    <div className="text-sm text-gray-500">{request.adminEmail}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-600 flex items-center space-x-1">
                      <Clock size={14} className="text-gray-400" />
                      <span>{request.requestDate}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      request.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    {request.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleAction(request.id, 'accepted')}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                        >
                          <Check size={16} />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleAction(request.id, 'rejected')}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium border border-red-200"
                        >
                          <X size={16} />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : request.status === 'accepted' ? (
                      <span className="text-sm text-green-600 font-medium inline-flex items-center space-x-1">
                        <Key size={16} />
                        <span>Link Sent</span>
                      </span>
                    ) : (
                      <span className="text-sm text-red-500 font-medium inline-flex items-center space-x-1">
                        <X size={16} />
                        <span>Rejected</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              
              {requests.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No password reset requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PasswordRequests;
