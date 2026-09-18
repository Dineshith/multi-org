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
  return JSON.parse(localStorage.getItem(DB_KEY));
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

  const newEventsPage = {
    id: generateId(db.pages) + 2,
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
export const getNotices = (orgId) => getDB().notices.filter(n => n.organizationId === parseInt(orgId));

export const createNotice = (orgId, data) => {
  const db = getDB();
  const newNotice = {
    ...data,
    id: generateId(db.notices),
    organizationId: parseInt(orgId),
    publishedAt: data.published ? new Date().toISOString() : null,
  };
  db.notices.push(newNotice);
  saveDB(db);
  return newNotice;
};

export const deleteNotice = (id) => {
  const db = getDB();
  db.notices = db.notices.filter(n => n.id !== parseInt(id));
  saveDB(db);
};

// --- Events ---
export const getEvents = (orgId) => getDB().events.filter(e => e.organizationId === parseInt(orgId));

export const createEvent = (orgId, data) => {
  const db = getDB();
  const newEvent = {
    ...data,
    id: generateId(db.events),
    organizationId: parseInt(orgId),
  };
  db.events.push(newEvent);
  saveDB(db);
  return newEvent;
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
