import { organizations, users, notices, events, pages } from '../mockData/db';

const DB_KEY = 'educms_db';

// Initialize DB if not exists
export const initDB = () => {
  if (!localStorage.getItem(DB_KEY)) {
    localStorage.setItem(DB_KEY, JSON.stringify({
      organizations,
      users,
      notices,
      events,
      pages,
    }));
  }
};

const getDB = () => {
  initDB();
  const db = JSON.parse(localStorage.getItem(DB_KEY));
  
  // Auto-migration: If Super Admin has null organizationId, fix it
  let needsSave = false;
  const superAdmin = db.users.find(u => u.role === 'SUPER_ADMIN');
  if (superAdmin && superAdmin.organizationId === null) {
    superAdmin.organizationId = 0;
    needsSave = true;
  }
  
  // Auto-migration: Ensure main-portal organization exists
  if (!db.organizations.find(o => o.id === 0)) {
    db.organizations.push({
      id: 0,
      name: 'EduCMS Platform',
      type: 'platform',
      slug: 'main-portal',
      email: 'contact@educms.com',
      phone: '+1-800-EDUCMS',
      address: 'Global',
      status: 'active',
      branding: {
        logo: 'https://placehold.co/150x150/0f172a/ffffff?text=EduCMS',
        primaryColor: '#0f172a',
        secondaryColor: '#f8fafc', 
      },
      statsBanner: [
        { value: '27', label: 'INSTITUTIONS', subLabel: 'संस्थानहरु' },
        { value: '05', label: 'DISCIPLINES', subLabel: 'विभिन्न क्षेत्र' },
        { value: '6.4k+', label: 'STUDENTS', subLabel: 'विद्यार्थी भर्ना' },
        { value: '140+', label: 'FACULTY', subLabel: 'शिक्षक एवं कर्मचारी' }
      ],
      footer: {
        logo: 'https://placehold.co/150x50/0f172a/ffffff?text=EduCMS',
        description: 'Empowering higher education and excellence.',
        facultyTitle: 'Faculty',
        facultyDetails: '',
        contactTitle: 'Contact Us',
        contactInfo: '',
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.8142900902094!2d85.31694677617478!3d27.69213407619131!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19b19295555f%3A0xabfe5f4b310f97de!2sThe%20British%20College%2C%20Kathmandu!5e0!3m2!1sen!2snp!4v1709623862218!5m2!1sen!2snp',
        copyrightText: `© ${new Date().getFullYear()} EduCMS Platform. All rights reserved.`
      },
      sisterOrganizations: [],
    });
    needsSave = true;
  }

  // Auto-migration: Fix any pages that were accidentally created with NaN or null organizationId
  db.pages.forEach(p => {
    if (p.organizationId === null || isNaN(p.organizationId)) {
      p.organizationId = 0;
      needsSave = true;
    }
  });

  // Auto-migration: Ensure main-portal has a home page
  if (!db.pages.find(p => p.organizationId === 0 && p.slug === 'home')) {
    db.pages.push({
      id: 0,
      organizationId: 0,
      title: 'Home',
      slug: 'home',
      sections: [
        {
          id: 100,
          type: 'hero',
          background: 'dark',
          data: {
            title: 'Welcome to EDU<span class="text-blue-500">CMS</span> Platform',
            subtitle: 'A Multi-Tenant Content Management System for Educational Institutions.',
            image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          },
        }
      ],
    });
    needsSave = true;
  }

  // Auto-migration: Ensure all organizations have a footer object with facultyDetails and contactInfo
  db.organizations.forEach(org => {
    // Clear dummy values if they exist
    if (org.footer?.contactInfo === 'contact@educms.com\n+1-800-EDUCMS' || org.footer?.contactInfo === `${org.email}\n${org.phone}`) {
      org.footer.contactInfo = '';
      needsSave = true;
    }

    if (!org.footer || org.footer.facultyDetails === undefined) {
      org.footer = {
        logo: org.footer?.logo || '',
        description: org.footer?.description || (org.type === 'college' ? 'Empowering higher education and excellence.' : 'Nurturing young minds for a brighter tomorrow.'),
        facultyTitle: org.footer?.facultyTitle || org.footer?.quickLinksTitle || 'Faculty',
        facultyDetails: org.footer?.facultyDetails || '',
        contactTitle: org.footer?.contactTitle || 'Contact Us',
        contactInfo: org.footer?.contactInfo || '',
        mapUrl: org.footer?.mapUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.8142900902094!2d85.31694677617478!3d27.69213407619131!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19b19295555f%3A0xabfe5f4b310f97de!2sThe%20British%20College%2C%20Kathmandu!5e0!3m2!1sen!2snp!4v1709623862218!5m2!1sen!2snp',
        copyrightText: org.footer?.copyrightText || `© ${new Date().getFullYear()} ${org.name}. Powered by EDU CMS Platform.`
      };
      // Clean up old quickLinks data
      if (org.footer.quickLinks) delete org.footer.quickLinks;
      if (org.footer.quickLinksTitle) delete org.footer.quickLinksTitle;
      needsSave = true;
    }
  });

  // Auto-migration: Ensure statsBanner exists
  db.organizations.forEach(org => {
    if (!org.statsBanner) {
      if (org.slug === 'main-portal') {
        org.statsBanner = [
          { value: '27', label: 'INSTITUTIONS', subLabel: 'संस्थानहरु' },
          { value: '05', label: 'DISCIPLINES', subLabel: 'विभिन्न क्षेत्र' },
          { value: '6.4k+', label: 'STUDENTS', subLabel: 'विद्यार्थी भर्ना' },
          { value: '140+', label: 'FACULTY', subLabel: 'शिक्षक एवं कर्मचारी' }
        ];
      } else {
        org.statsBanner = [];
      }
      needsSave = true;
    }
    
    if (!org.sisterOrganizations) {
      org.sisterOrganizations = [];
      needsSave = true;
    }
  });

  // Auto-migration: Upgrade home pages to include the new combined block
  db.pages.forEach(p => {
    if (p.slug === 'home') {
      if (!p.sections.some(s => s.type === 'combined_events_notices')) {
        p.sections.push({
          id: Date.now() + Math.random(),
          type: 'combined_events_notices',
          background: 'gray',
          data: {
            title: 'Upcoming events & Recent Notices',
            subtitle: 'Notice Boards',
          }
        });
        needsSave = true;
      }
      
      // Remove any standalone notice_list or event_list from the home page to prevent duplicates
      const originalLength = p.sections.length;
      p.sections = p.sections.filter(s => s.type !== 'notice_list' && s.type !== 'event_list');
      if (p.sections.length !== originalLength) {
        needsSave = true;
      }
    }
  });

  if (needsSave) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }

  return db;
};

const saveDB = (db) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

const generateId = (collection) => {
  if (collection.length === 0) return 1;
  return Math.max(...collection.map(item => item.id)) + 1;
};

// --- Organizations ---
export const getOrganizations = () => getDB().organizations;

export const getOrganization = (id) => getDB().organizations.find(o => o.id === parseInt(id));

export const getOrganizationBySlug = (slug) => getDB().organizations.find(o => o.slug === slug);

export const createOrganization = (data) => {
  const db = getDB();
  const newOrg = {
    ...data,
    id: generateId(db.organizations),
    status: 'active',
    sisterOrganizations: data.sisterOrganizations || [],
    footer: data.footer || {
      logo: '',
      description: data.type === 'college' ? 'Empowering higher education and excellence.' : 'Nurturing young minds for a brighter tomorrow.',
      facultyTitle: 'Faculty',
      facultyDetails: '',
      contactTitle: 'Contact Us',
      contactInfo: '',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.8142900902094!2d85.31694677617478!3d27.69213407619131!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19b19295555f%3A0xabfe5f4b310f97de!2sThe%20British%20College%2C%20Kathmandu!5e0!3m2!1sen!2snp!4v1709623862218!5m2!1sen!2snp',
      copyrightText: `© ${new Date().getFullYear()} ${data.name}. Powered by EDU CMS Platform.`
    },
    statsBanner: [],
    sisterOrganizations: []
  };
  db.organizations.push(newOrg);
  
  // Create default pages for the new organization
  const newHomePage = {
    id: generateId(db.pages),
    organizationId: newOrg.id,
    title: 'Home',
    slug: 'home',
    sections: [
      {
        id: Date.now(),
        type: 'hero',
        background: 'default',
        data: {
          title: `Welcome to ${newOrg.name}`,
          subtitle: 'A place for excellence and growth.',
          image: 'https://placehold.co/1200x600/374151/ffffff?text=Welcome',
        },
      }
    ]
  };
  db.pages.push(newHomePage);

  const newNoticesPage = {
    id: generateId(db.pages) + 1,
    organizationId: newOrg.id,
    title: 'Notices',
    slug: 'notices',
    sections: [
      {
        id: Date.now() + 1,
        type: 'hero',
        background: 'primary',
        data: {
          title: `Official Notices`,
          subtitle: 'Stay updated with our latest announcements.',
          image: 'https://placehold.co/1200x400/4f46e5/ffffff?text=Notices',
        },
      },
      {
        id: Date.now() + 2,
        type: 'notice_list',
        background: 'gray',
        data: {
          title: 'Recent Announcements',
        },
      }
    ]
  };
  db.pages.push(newNoticesPage);

  // 4. Default Contact Page
  const newContactPage = {
    id: generateId(db.pages) + 2,
    organizationId: newOrg.id,
    title: 'Contact',
    slug: 'contact',
    sections: [
      {
        id: Date.now() + 3,
        type: 'contact_form',
        background: 'default',
        data: {
          title: 'CONTACT US',
          subtitle: '',
          email: 'admin@organization.com',
          contactInfo: '<p><strong>📍 ADDRESS:</strong><br/>123 Education Lane, City, Country</p><p><strong>📞 PHONE:</strong><br/>+1 234 567 8900</p><p><strong>✉️ EMAIL:</strong><br/>info@school.edu</p><p><strong>🕒 SCHOOL HOURS:</strong><br/>Mon-Fri: 8:00 AM - 4:00 PM</p>',
          mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.8142900902094!2d85.31694677617478!3d27.69213407619131!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19b19295555f%3A0xabfe5f4b310f97de!2sThe%20British%20College%2C%20Kathmandu!5e0!3m2!1sen!2snp!4v1709623862218!5m2!1sen!2snp'
        }
      }
    ]
  };
  db.pages.push(newContactPage);

  const newEventsPage = {
    id: generateId(db.pages) + 3,
    organizationId: newOrg.id,
    title: 'Events',
    slug: 'events',
    sections: [
      {
        id: Date.now() + 3,
        type: 'text',
        background: 'default',
        data: {
          title: `Upcoming Events`,
          content: 'Join us at our upcoming academic and cultural events.',
        },
      },
      {
        id: Date.now() + 4,
        type: 'event_list',
        background: 'default',
        data: {
          title: '',
        },
      }
    ]
  };
  db.pages.push(newEventsPage);
  
  saveDB(db);
  return newOrg;
};

export const updateOrganization = (id, data) => {
  const db = getDB();
  const index = db.organizations.findIndex(o => o.id === parseInt(id));
  if (index !== -1) {
    db.organizations[index] = { ...db.organizations[index], ...data };
    saveDB(db);
    return db.organizations[index];
  }
  return null;
};

export const deleteOrganization = (id) => {
  const db = getDB();
  const org = db.organizations.find(o => o.id === parseInt(id));
  if (!org || org.slug === 'main-portal') return false;
  
  db.organizations = db.organizations.filter(o => o.id !== parseInt(id));
  db.pages = db.pages.filter(p => p.organizationId !== parseInt(id));
  db.notices = db.notices.filter(n => n.organizationId !== parseInt(id));
  db.events = db.events.filter(e => e.organizationId !== parseInt(id));
  
  saveDB(db);
  return true;
};

// --- Users ---
export const getUsers = () => getDB().users;

export const getUserByEmail = (email) => getDB().users.find(u => u.email === email);

export const createUser = (data) => {
  const db = getDB();
  const newUser = {
    ...data,
    id: generateId(db.users),
  };
  db.users.push(newUser);
  saveDB(db);
  return newUser;
};

// --- Notices ---
export const getAllNotices = () => getDB().notices;
export const getNotices = (orgId) => getDB().notices.filter(n => n.organizationId === parseInt(orgId));

export const createNotice = (orgId, data) => {
  const db = getDB();
  const newNotice = {
    ...data,
    id: generateId(db.notices),
    organizationId: parseInt(orgId),
    publishedAt: new Date().toISOString(), // Always set publishedAt for org site
    publishOnMainPortal: !!data.publishOnMainPortal
  };
  db.notices.push(newNotice);
  saveDB(db);
  return newNotice;
};

export const updateNotice = (id, data) => {
  const db = getDB();
  const index = db.notices.findIndex(n => n.id === parseInt(id));
  if (index !== -1) {
    db.notices[index] = { 
      ...db.notices[index], 
      ...data,
      publishOnMainPortal: !!data.publishOnMainPortal
    };
    saveDB(db);
    return db.notices[index];
  }
  return null;
};

export const deleteNotice = (id) => {
  const db = getDB();
  db.notices = db.notices.filter(n => n.id !== parseInt(id));
  saveDB(db);
};

// --- Events ---
export const getAllEvents = () => getDB().events;
export const getEvents = (orgId) => getDB().events.filter(e => e.organizationId === parseInt(orgId));

export const createEvent = (orgId, data) => {
  const db = getDB();
  const newEvent = {
    ...data,
    id: generateId(db.events),
    organizationId: parseInt(orgId),
    publishOnMainPortal: !!data.publishOnMainPortal
  };
  db.events.push(newEvent);
  saveDB(db);
  return newEvent;
};

export const updateEvent = (id, data) => {
  const db = getDB();
  const index = db.events.findIndex(e => e.id === parseInt(id));
  if (index !== -1) {
    db.events[index] = { 
      ...db.events[index], 
      ...data,
      publishOnMainPortal: !!data.publishOnMainPortal
    };
    saveDB(db);
    return db.events[index];
  }
  return null;
};

export const deleteEvent = (id) => {
  const db = getDB();
  db.events = db.events.filter(e => e.id !== parseInt(id));
  saveDB(db);
};

// --- Pages ---
export const getPages = (orgId) => getDB().pages.filter(p => p.organizationId === parseInt(orgId));

export const getPage = (id) => getDB().pages.find(p => p.id === parseInt(id));

export const createPage = (orgId, data) => {
  const db = getDB();
  const newPage = {
    ...data,
    id: generateId(db.pages),
    organizationId: parseInt(orgId),
    sections: data.sections || [],
  };
  db.pages.push(newPage);
  saveDB(db);
  return newPage;
};

export const updatePage = (id, data) => {
  const db = getDB();
  const index = db.pages.findIndex(p => p.id === parseInt(id));
  if (index !== -1) {
    db.pages[index] = { ...db.pages[index], ...data };
    saveDB(db);
    return db.pages[index];
  }
  return null;
};

export const deletePage = (id) => {
  const db = getDB();
  db.pages = db.pages.filter(p => p.id !== parseInt(id));
  saveDB(db);
};
