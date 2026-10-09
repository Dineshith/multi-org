import apiClient from './apiClient';

// --- Organizations ---
export const getOrganizations = async () => {
    try {
        const res = await apiClient.get('/admin/organizations/get-all-organization');
        const orgs = res.data || [];

        // Merge localStorage data for main-portal
        try {
            const storedMainPortal = JSON.parse(localStorage.getItem('mainPortalData') || '{}');
            const mainPortalIndex = orgs.findIndex(o => o.slug === 'main-portal');
            if (mainPortalIndex !== -1) {
                orgs[mainPortalIndex] = {
                    ...orgs[mainPortalIndex],
                    sisterOrganizations: storedMainPortal.sisterOrganizations || [],
                    statsBanner: storedMainPortal.statsBanner || []
                };
            }
        } catch (e) { }

        return orgs;
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getOrganization = async (id) => {
    // Currently backend uses slug, if needed by ID we'll mock it by finding in all for now
    // Actually the mockDbService uses ID. Let's fetch all and filter for now as a fallback.
    const orgs = await getOrganizations();
    return orgs.find(o => o.id === parseInt(id));
};

export const getOrganizationBySlug = async (slug) => {
    try {
        let orgData = null;
        if (slug === 'main-portal') {
            // Check if we have a mocked main-portal in localStorage
            try {
                const storedMainPortal = JSON.parse(localStorage.getItem('mainPortalData') || '{}');
                orgData = {
                    id: 0,
                    name: storedMainPortal.name || 'EduCMS Platform',
                    type: 'platform',
                    slug: 'main-portal',
                    logo_url: storedMainPortal.logo_url || '',
                    footer_description: storedMainPortal.footer_description || 'Welcome to EduCMS',
                    branding: storedMainPortal.branding || { primaryColor: '#4f46e5', secondaryColor: '#f3f4f6' },
                    sisterOrganizations: storedMainPortal.sisterOrganizations || [],
                    statsBanner: storedMainPortal.statsBanner || []
                };
            } catch (e) { }
        }

        const res = await apiClient.get(`/admin/organizations/get-organization-by-slug/${slug}`);

        let mergedData = res.data;
        if (slug === 'main-portal' && orgData) {
            mergedData = { ...orgData, ...res.data };
            // Explicitly add sisterOrganizations back since backend drops it
            try {
                const storedMainPortal = JSON.parse(localStorage.getItem('mainPortalData') || '{}');
                mergedData.sisterOrganizations = storedMainPortal.sisterOrganizations || [];
                mergedData.statsBanner = storedMainPortal.statsBanner || [];
            } catch (e) { }
        }
        return mergedData;
    } catch (e) {
        if (slug === 'main-portal') {
            try {
                const storedMainPortal = JSON.parse(localStorage.getItem('mainPortalData') || '{}');
                return {
                    id: 0,
                    name: storedMainPortal.name || 'EduCMS Platform',
                    type: 'platform',
                    slug: 'main-portal',
                    logo_url: storedMainPortal.logo_url || '',
                    footer_description: storedMainPortal.footer_description || 'Welcome to EduCMS',
                    branding: storedMainPortal.branding || { primaryColor: '#4f46e5', secondaryColor: '#f3f4f6' },
                    sisterOrganizations: storedMainPortal.sisterOrganizations || [],
                    statsBanner: storedMainPortal.statsBanner || []
                };
            } catch (err) { }
        }
        console.error(e);
        return null;
    }
};

export const createOrganization = async (data) => {
    try {
        const res = await apiClient.post('/admin/organizations/create-organization', data);
        return res.organizationId || res.slug ? res : null;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const updateOrganization = async (id, data) => {
    // Note: mockDbService uses id, backend update uses slug. We may need to adjust frontend to pass slug.
    // For now we'll fetch org to get slug
    const org = await getOrganization(id);
    if (!org) return null;

    try {
        // Since backend doesn't support sisterOrganizations and statsBanner, 
        // we'll save them in localStorage specifically for main-portal.
        if (org.slug === 'main-portal') {
            localStorage.setItem('mainPortalData', JSON.stringify({
                name: data.name,
                logo_url: data.logo_url,
                footer_description: data.footer_description,
                sisterOrganizations: data.sisterOrganizations,
                statsBanner: data.statsBanner
            }));
        }

        const res = await apiClient.put(`/admin/organizations/update-organization/${org.slug}`, data);
        return res.slug ? res : null;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const deleteOrganization = async (id) => {
    const org = await getOrganization(id);
    if (!org) return false;

    try {
        await apiClient.delete(`/admin/organizations/delete-organization/${org.slug}`);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};


// --- Users ---
export const getUsers = async () => {
    try {
        const res = await apiClient.get('/users/get-all-user');
        return res.users || [];
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getUserByEmail = async (email) => {
    // If backend doesn't have a get by email, we filter
    const users = await getUsers();
    return users.find(u => u.email === email);
};

export const createUser = async (data) => {
    try {
        const res = await apiClient.post('/users', data);
        return res.success ? res : null;
    } catch (e) {
        console.error(e);
        return { success: false, message: e.response?.data?.message || 'Failed to create Admin. Please try again.' };
    }
};

export const updateUser = async (id, data) => {
    try {
        const res = await apiClient.put(`/users/${id}`, data);
        return res;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const deleteUser = async (id) => {
    try {
        const res = await apiClient.delete(`/users/${id}`);
        return res;
    } catch (e) {
        console.error(e);
        return false;
    }
};

// --- Notices ---
export const getAllNotices = async () => {
    try {
        const res = await apiClient.get('/notices');
        return res.notices || [];
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getNotices = async (orgId) => {
    const notices = await getAllNotices();
    if (parseInt(orgId) === 0) {
        return notices.filter(n => parseInt(n.organization_id) === 0 || parseInt(n.organizationId) === 0 || n.publish_on_main_portal || n.publishOnMainPortal);
    }
    return notices.filter(n => parseInt(n.organization_id) === parseInt(orgId) || parseInt(n.organizationId) === parseInt(orgId));
};

export const createNotice = async (orgId, data) => {
    try {
        const payload = { ...data, organizationId: orgId, organization_id: orgId, publish_on_main_portal: data.publishOnMainPortal };
        const res = await apiClient.post('/notices', payload);
        return res.notice;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const updateNotice = async (id, data) => {
    try {
        const payload = { ...data, publish_on_main_portal: data.publishOnMainPortal };
        const res = await apiClient.put(`/notices/${id}`, payload);
        return res.notice;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const deleteNotice = async (id) => {
    try {
        await apiClient.delete(`/notices/${id}`);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};

// --- Events ---
export const getAllEvents = async () => {
    try {
        const res = await apiClient.get('/events');
        return res.events || [];
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getEvents = async (orgId) => {
    const events = await getAllEvents();
    if (parseInt(orgId) === 0) {
        return events.filter(e => parseInt(e.organization_id) === 0 || parseInt(e.organizationId) === 0 || e.publish_on_main_portal || e.publishOnMainPortal);
    }
    return events.filter(e => parseInt(e.organization_id) === parseInt(orgId) || parseInt(e.organizationId) === parseInt(orgId));
};

export const createEvent = async (orgId, data) => {
    try {
        const res = await apiClient.post('/events', { ...data, organizationId: orgId, organization_id: orgId, publish_on_main_portal: data.publishOnMainPortal });
        return res.event;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const updateEvent = async (id, data) => {
    try {
        const payload = { ...data, publish_on_main_portal: data.publishOnMainPortal };
        const res = await apiClient.put(`/events/${id}`, payload);
        return res.event;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const deleteEvent = async (id) => {
    try {
        await apiClient.delete(`/events/${id}`);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};

// --- Pages ---
export const getPages = async (orgId) => {
    try {
        const res = await apiClient.get('/pages');
        const pages = res.data || res.pages || [];
        return pages.filter(p => p.organization_id === parseInt(orgId) || p.organizationId === parseInt(orgId));
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getPage = async (id) => {
    try {
        const res = await apiClient.get(`/pages/${id}`);
        return res.page;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const createPage = async (orgId, data) => {
    try {
        const res = await apiClient.post('/pages', { ...data, organizationId: orgId, organization_id: orgId });
        return res.page;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const updatePage = async (id, data) => {
    try {
        const res = await apiClient.put(`/pages/${id}`, data);
        return res.page;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const deletePage = async (id) => {
    try {
        await apiClient.delete(`/pages/${id}`);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};

// --- News ---
export const getNews = async (orgId) => {
    try {
        const res = await apiClient.get('/news');
        const newsList = res.data || res.news || [];
        return newsList.filter(n => n.organization_id === parseInt(orgId) || n.organizationId === parseInt(orgId));
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getSingleNews = async (id) => {
    try {
        const res = await apiClient.get(`/news/${id}`);
        return res.news;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const createNews = async (orgId, data) => {
    try {
        const res = await apiClient.post('/news', { ...data, organizationId: orgId, organization_id: orgId, publish_on_main_portal: data.publishOnMainPortal });
        return res.news;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const updateNews = async (id, data) => {
    try {
        const payload = { ...data, publish_on_main_portal: data.publishOnMainPortal };
        const res = await apiClient.put(`/news/${id}`, payload);
        return res.news;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const deleteNews = async (id) => {
    try {
        await apiClient.delete(`/news/${id}`);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};

// --- Staff ---
export const getStaff = async (orgId) => {
    try {
        const res = await apiClient.get('/staff');
        const staffList = res.data || res.staff || [];
        return staffList.filter(s => s.organization_id === parseInt(orgId) || s.organizationId === parseInt(orgId));
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const createStaff = async (orgId, data) => {
    try {
        const res = await apiClient.post('/staff', { ...data, organizationId: orgId, organization_id: orgId });
        return res.staff;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const updateStaff = async (id, data) => {
    try {
        const res = await apiClient.put(`/staff/${id}`, data);
        return res.staff;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const deleteStaff = async (id) => {
    try {
        await apiClient.delete(`/staff/${id}`);
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};

export const initDB = () => {
    // No-op for actual backend
};
