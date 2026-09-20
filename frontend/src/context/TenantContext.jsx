import React, { createContext, useContext, useState, useEffect } from 'react';
import { getOrganizationBySlug, initDB } from '../services/mockDbService';
import { useLocation } from 'react-router-dom';

const TenantContext = createContext();

export const useTenant = () => {
  return useContext(TenantContext);
};

export const TenantProvider = ({ children }) => {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();

  useEffect(() => {
    const checkTenant = () => {
      initDB();
      setLoading(true);
      setError(null);
      
      const pathParts = location.pathname.split('/');
      
      if (pathParts[1] === 'org' && pathParts[2]) {
        const slug = pathParts[2];
        const foundOrg = getOrganizationBySlug(slug);
        
        if (foundOrg) {
          setTenant(foundOrg);
          // Apply branding colors to CSS variables
          if (foundOrg.branding) {
            document.documentElement.style.setProperty('--primary-color', foundOrg.branding.primaryColor);
            document.documentElement.style.setProperty('--secondary-color', foundOrg.branding.secondaryColor);
          }
        } else {
          setTenant(null);
          setError('Organization not found');
        }
      } else {
        setTenant(null);
      }
      setLoading(false);
    };

    checkTenant();
  }, [location.pathname]);

  const value = {
    tenant,
    loading,
    error
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};
