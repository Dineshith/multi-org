import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import { getPages } from '../services/mockDbService';
import { Loader2 } from 'lucide-react';

const PublicLayout = () => {
  const { tenant, loading, error } = useTenant();
  const [pages, setPages] = useState([]);
  const location = useLocation();
  const currentPath = location.pathname;

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

  // Process navigation items
  const navItems = [];

  // First, gather all slugs that are used as sub-items in any dropdown
  const allSubSlugs = new Set();
  pages.forEach(p => {
    const subItems = p.dropdownItems || p.menuGroups || [];
    subItems.forEach(sub => {
      if (sub && sub.trim() !== '') {
        allSubSlugs.add(sub.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
      }
    });
  });
  
  pages.forEach(p => {
    // Support new dropdownItems and migrate old menuGroups
    const subItems = p.dropdownItems || p.menuGroups || [];
    const validSubItems = subItems.filter(i => i && i.trim() !== '');

    const pageLink = p.slug === 'home' ? `/org/${tenant.slug}` : `/org/${tenant.slug}/${p.slug}`;

    if (validSubItems.length > 0) {
      navItems.push({
        type: 'dropdown',
        id: `page-${p.id}`,
        label: p.title,
        link: pageLink,
        children: validSubItems.map((sub, i) => ({
          id: `sub-${p.id}-${i}`,
          label: sub,
          link: `/org/${tenant.slug}/${sub.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
        }))
      });
    } else {
      // Only add to standalone pages if this page is NOT a sub-item of another dropdown
      if (!allSubSlugs.has(p.slug)) {
        navItems.push({
          type: 'standalone',
          id: `page-${p.id}`,
          label: p.title,
          link: pageLink
        });
      }
    }
  });

  const standaloneSisterOrgs = [];
  if (tenant?.slug === 'main-portal' && tenant?.sisterOrganizations) {
    tenant.sisterOrganizations.forEach((s, idx) => {
      standaloneSisterOrgs.push({ id: `sister-${idx}`, label: s.name, link: s.link || '#', isExternal: true });
    });
  }

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ '--theme-primary': tenant.branding?.primaryColor || '#4f46e5' }}>
      {/* Dynamic Navbar based on tenant */}
      <header className="sticky top-0 z-50 bg-[#111860] shadow-md">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className="flex justify-between items-center h-16">
            
            {/* Left: Logo/Name */}
            <Link to={`/org/${tenant.slug}`} className="flex items-center flex-shrink-0 space-x-3">
              {tenant.branding?.logo ? (
                <img src={tenant.branding.logo} alt={tenant.name} className="h-10 w-10 object-contain rounded-full bg-white p-0.5 shadow-sm" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 font-bold text-xl shadow-sm">
                  {tenant.name.charAt(0)}
                </div>
              )}
              <div className="text-2xl font-extrabold text-white tracking-tight">{tenant.name}</div>
            </Link>
            
            {/* Middle: Navigation Links */}
            <nav className="hidden md:flex flex-1 justify-center space-x-2 lg:space-x-6">
              {navItems.map(item => {
                if (item.type === 'standalone') {
                  const isActive = currentPath === item.link;
                  return (
                    <Link 
                      key={item.id} 
                      to={item.link} 
                      className={`text-white font-medium text-sm transition-all border-b-2 py-5 px-2 ${isActive ? 'opacity-100 border-white' : 'opacity-90 border-transparent hover:opacity-100 hover:border-white'}`}
                    >
                      {item.label}
                    </Link>
                  );
                } else {
                  const isActive = item.children.some(c => currentPath === c.link);
                  return (
                    <div key={item.id} className="relative group flex items-center">
                      <button type="button" onClick={(e) => e.preventDefault()} className={`text-white font-medium text-sm transition-all border-b-2 py-5 px-2 flex items-center space-x-1 cursor-pointer ${isActive ? 'opacity-100 border-white' : 'opacity-90 border-transparent hover:opacity-100 hover:border-white'}`}>
                      <span>{item.label}</span>
                      <span className="font-bold text-lg leading-none w-3 text-center inline-block">
                        <span className="group-hover:hidden">+</span>
                        <span className="hidden group-hover:inline">-</span>
                      </span>
                    </button>
                    <div className="absolute top-full left-0 mt-0 w-56 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 rounded-b-md overflow-hidden">
                      <div className="py-2 flex flex-col">
                        {item.children.map(child => (
                          <Link key={child.id} to={child.link} className="px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors border-l-4 border-transparent hover:border-indigo-600">
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  );
                }
              })}
            </nav>
            
            {/* Right: Sister Organizations */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {standaloneSisterOrgs.map((sister) => (
                <a 
                  key={sister.id} 
                  href={sister.link} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 bg-[#d32f2f] hover:bg-[#b71c1c] text-white text-sm font-bold rounded shadow-sm transition-colors uppercase tracking-wider"
                >
                  {sister.label}
                </a>
              ))}
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#000066] text-white pt-12 pb-6">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12 items-start">
            
            {/* Column 1: Logo and Name */}
            <div className="lg:col-span-5 flex items-center space-x-4">
              {tenant.footer?.logo ? (
                <img src={tenant.footer.logo} alt={tenant.name} className="w-20 h-20 rounded-full object-contain bg-white shadow-md p-1" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 font-bold text-2xl shadow-md">
                  {tenant.name.charAt(0)}
                </div>
              )}
              <div className="flex flex-col">
                <h3 className="text-3xl font-bold tracking-wide font-serif leading-tight">{tenant.name}</h3>
                <p className="text-gray-300 text-sm mt-1">
                  {tenant.footer?.description || tenant.address || 'Empowering education.'}
                </p>
              </div>
            </div>

            {/* Column 2: Faculty */}
            <div className="lg:col-span-2 flex flex-col items-start lg:items-center">
              <div className="text-left md:text-center">
                <h4 className="text-base font-semibold mb-4 tracking-wide">{tenant.footer?.facultyTitle || 'Faculty'}</h4>
                <ul className="space-y-2 text-sm text-gray-300 font-medium">
                  {tenant.footer?.facultyDetails && (
                    tenant.footer.facultyDetails.split('\n').map((line, index) => (
                      line.trim() && <li key={index}>{line}</li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            {/* Column 3: Contact Us */}
            <div className="lg:col-span-2 flex flex-col items-start lg:items-start">
              <div>
                <h4 className="text-base font-semibold mb-4 tracking-wide">{tenant.footer?.contactTitle || 'Contact Us'}</h4>
                <ul className="space-y-2 text-sm text-gray-300 font-medium break-all">
                  {tenant.footer?.contactInfo && (
                    tenant.footer.contactInfo.split('\n').map((line, index) => (
                      line.trim() && <li key={index}>{line}</li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            {/* Column 4: Location Map */}
            <div className="lg:col-span-3 flex flex-col items-start lg:items-center">
              <div>
                <h4 className="text-base font-semibold mb-4 tracking-wide text-left lg:text-center">Location</h4>
                {tenant.footer?.mapUrl ? (
                  <iframe 
                    src={tenant.footer.mapUrl}
                    title="Location Map"
                    className="w-48 h-32 border-2 border-green-600 rounded-sm shadow-sm bg-gray-200"
                    loading="lazy"
                  ></iframe>
                ) : (
                  <div className="w-48 h-32 bg-[#0a0f3d] rounded flex items-center justify-center text-xs text-gray-500 border border-gray-700">
                    Map not configured
                  </div>
                )}
              </div>
            </div>

          </div>
          {tenant.footer?.copyrightText && (
            <div className="border-t border-white/20 pt-6 text-center text-gray-400 text-sm">
              <p>{tenant.footer.copyrightText}</p>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
