import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import { getPages } from '../services/mockDbService';
import { Loader2 } from 'lucide-react';

const PublicLayout = () => {
  const { tenant, loading, error } = useTenant();
  const [pages, setPages] = useState([]);

  useEffect(() => {
    if (tenant) {
      setPages(getPages(tenant.id));
    }
  }, [tenant]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Organization Not Found</h1>
        <p className="text-gray-600 mb-8">The organization you are looking for does not exist or is inactive.</p>
        <Link to="/" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Return to Platform Home
        </Link>
      </div>
    );
  }

  // Filter out the home page from the navbar if you want, or keep it. Let's keep it.
  // Actually, we usually want 'home' to just point to the root /org/:slug.
  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ '--theme-primary': tenant.branding?.primaryColor || '#4f46e5' }}>
      {/* Dynamic Navbar based on tenant */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to={`/org/${tenant.slug}`} className="flex items-center space-x-3">
              {tenant.branding?.logo ? (
                <img src={tenant.branding.logo} alt={tenant.name} className="h-12 w-auto object-contain rounded" />
              ) : (
                <div className="text-2xl font-bold text-gray-900">{tenant.name}</div>
              )}
            </Link>
            <nav className="hidden md:flex space-x-8">
              {pages.map(page => (
                <Link key={page.id} to={page.slug === 'home' ? `/org/${tenant.slug}` : `/org/${tenant.slug}/${page.slug}`} className="text-gray-700 hover:text-[var(--theme-primary)] font-medium transition-colors">
                  {page.title}
                </Link>
              ))}
            </nav>
            <div className="flex items-center">
               <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900">Admin Login</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">{tenant.name}</h3>
              <p className="text-gray-400 max-w-sm">{tenant.type === 'college' ? 'Empowering higher education and excellence.' : 'Nurturing young minds for a brighter tomorrow.'}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to={`/org/${tenant.slug}`} className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to={`/org/${tenant.slug}/notices`} className="hover:text-white transition-colors">Notices</Link></li>
                <li><Link to={`/org/${tenant.slug}/events`} className="hover:text-white transition-colors">Events</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-2 text-gray-400">
                <li>{tenant.address}</li>
                <li>{tenant.phone}</li>
                <li>{tenant.email}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} {tenant.name}. Powered by EDU CMS Platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
