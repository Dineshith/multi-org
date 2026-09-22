import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Building, ArrowLeft, Send } from 'lucide-react';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save to localStorage to mock backend behavior
    const existingRequests = JSON.parse(localStorage.getItem('passwordRequests') || '[]');
    const newRequest = {
      id: Date.now(),
      orgName: orgName,
      adminEmail: email,
      adminName: 'Organization Admin', // Name isn't in form, so we use a placeholder
      requestDate: new Date().toLocaleString(),
      status: 'pending'
    };
    localStorage.setItem('passwordRequests', JSON.stringify([newRequest, ...existingRequests]));

    setTimeout(() => {
      setIsSubmitted(true);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          EDU<span className="text-indigo-600">CMS</span> Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Reset your password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100">
          {!isSubmitted ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <p className="text-sm text-gray-600 mb-6 text-center">
                  Enter your registered email address and organization name to request a password reset link.
                </p>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                    placeholder="admin@abccollege.edu.np"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="orgName" className="block text-sm font-medium text-gray-700">
                  Organization Name / Slug
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="orgName"
                    name="orgName"
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                    placeholder="e.g. ABC College"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Request Password Reset
                </button>
              </div>

              <div className="mt-4 text-center">
                <Link to="/admin" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center justify-center">
                  <ArrowLeft className="h-4 w-4 mr-1" /> Back to sign in
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <Send className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Request Submitted</h3>
              <p className="text-sm text-gray-500">
                If an account matches the email and organization you provided, we've sent a password reset link to <span className="font-medium text-gray-900">{email}</span>.
              </p>
              <div className="pt-4">
                <Link
                  to="/admin"
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Return to sign in
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
