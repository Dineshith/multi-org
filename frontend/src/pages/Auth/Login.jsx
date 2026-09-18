import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123'); // Default password for testing
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        if (result.user.role === 'SUPER_ADMIN') {
          navigate('/platform-admin');
        } else {
          navigate('/admin');
        }
      } else {
        setError(result.message);
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          EDU<span className="text-indigo-600">CMS</span> Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to manage your organization
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
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
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                  placeholder="admin@abccollege.edu.np"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'} transition-colors`}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Test Credentials</h4>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => { setEmail('super@admin.com'); setPassword('password123'); }}>
                <div>
                  <span className="font-semibold text-gray-900 block">Super Admin</span>
                  <span>super@admin.com</span>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Platform</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => { setEmail('ram@abc.edu.np'); setPassword('password123'); }}>
                <div>
                  <span className="font-semibold text-gray-900 block">ABC College Admin</span>
                  <span>ram@abc.edu.np</span>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Org 1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
