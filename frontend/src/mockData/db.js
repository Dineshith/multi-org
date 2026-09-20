export const organizations = [
  {
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
      primaryColor: '#0f172a', // slate-900
      secondaryColor: '#f8fafc', 
    },
    sisterOrganizations: [],
  },
  {
    id: 1,
    name: 'ABC College',
    type: 'college',
    slug: 'abc-college',
    email: 'info@abccollege.edu.np',
    phone: '+977-1-1234567',
    address: 'Itahari, Sunsari',
    status: 'active',
    branding: {
      logo: 'https://placehold.co/150x150/1e40af/ffffff?text=ABC+Logo',
      primaryColor: '#111860', // dark blue for new design
      secondaryColor: '#f3f4f6', 
    },
    sisterOrganizations: [
      { name: 'School', link: '#' },
      { name: 'PlusTwo', link: '#' },
      { name: 'Bachelors', link: '#' }
    ],
  },
  {
    id: 2,
    name: 'XYZ School',
    type: 'school',
    slug: 'xyz-school',
    email: 'info@xyzschool.edu.np',
    phone: '+977-1-7654321',
    address: 'Dharan, Sunsari',
    status: 'active',
    branding: {
      logo: 'https://placehold.co/150x150/b91c1c/ffffff?text=XYZ+Logo',
      primaryColor: '#b91c1c', // red-700
      secondaryColor: '#fef2f2', // red-50
    },
  },
];

export const users = [
  {
    id: 1,
    name: 'Super Admin',
    email: 'super@admin.com',
    password: 'password123',
    role: 'SUPER_ADMIN',
    organizationId: 0,
  },
  {
    id: 2,
    name: 'Ram Sharma',
    email: 'ram@abc.edu.np',
    password: 'password123',
    role: 'ORG_ADMIN',
    organizationId: 1,
  },
  {
    id: 3,
    name: 'Sita Karki',
    email: 'sita@xyz.edu.np',
    password: 'password123',
    role: 'ORG_ADMIN',
    organizationId: 2,
  },
];

export const notices = [
  {
    id: 1,
    organizationId: 1,
    title: 'Admission Open for BCA 2026',
    content: 'We are glad to announce that admission for BCA 2026 is now open. Apply before September 30.',
    published: true,
    publishedAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 2,
    organizationId: 1,
    title: 'Semester Final Routine Published',
    content: 'The final examination routine for all semesters has been published. Please check the department notice board.',
    published: true,
    publishedAt: '2026-09-10T14:30:00Z',
  },
  {
    id: 3,
    organizationId: 2,
    title: 'SEE Registration Forms',
    content: 'All Grade 10 students must fill the SEE registration forms by this Friday.',
    published: true,
    publishedAt: '2026-09-05T09:15:00Z',
  },
];

export const events = [
  {
    id: 1,
    organizationId: 1,
    title: 'Annual Sports Meet',
    description: 'Join us for the Annual Sports Meet featuring football, basketball, and track events.',
    date: '2026-10-15T09:00:00Z',
  },
  {
    id: 2,
    organizationId: 2,
    title: 'Parents Day 2026',
    description: 'A special day for parents to interact with teachers and enjoy student performances.',
    date: '2026-11-20T10:00:00Z',
  },
];

export const pages = [
  {
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
      },
      {
        id: 101,
        type: 'cta',
        background: 'default',
        data: {
          title: 'Ready to manage your institution?',
          description: 'Login to access your dedicated portal.',
          buttonText: 'Login to Portal',
          buttonLink: '/admin'
        },
      },
    ],
  },
  {
    id: 1,
    organizationId: 1,
    title: 'Home',
    slug: 'home',
    sections: [
      {
        id: 1,
        type: 'hero',
        background: 'default',
        data: {
          title: 'Welcome to ABC College',
          subtitle: 'Empowering students for a brighter future.',
          image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
        },
      },
      {
        id: 2,
        type: 'text',
        background: 'gray',
        data: {
          title: 'About Our Institution',
          content: 'ABC College has been a center of academic excellence since 1990. We offer a wide range of programs designed to prepare students for the challenges of tomorrow.',
        },
      },
    ],
  },
  {
    id: 2,
    organizationId: 1,
    title: 'Notices',
    slug: 'notices',
    sections: [
      {
        id: 3,
        type: 'hero',
        background: 'primary',
        data: {
          title: 'Official Notices',
          subtitle: 'Stay updated with our latest announcements.',
          image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
        },
      },
      {
        id: 4,
        type: 'notice_list',
        background: 'gray',
        data: {
          title: 'Recent Announcements',
        },
      },
    ],
  },
  {
    id: 3,
    organizationId: 1,
    title: 'Events',
    slug: 'events',
    sections: [
      {
        id: 5,
        type: 'text',
        background: 'default',
        data: {
          title: 'Upcoming Events',
          content: 'Join us at our upcoming academic and cultural events.',
        },
      },
      {
        id: 6,
        type: 'event_list',
        background: 'default',
        data: {
          title: '',
        },
      },
    ],
  },
  {
    id: 2,
    organizationId: 2,
    title: 'Home',
    slug: 'home',
    sections: [
      {
        type: 'hero',
        data: {
          title: 'Welcome to XYZ School',
          subtitle: 'Nurturing young minds for a bright future',
          image: 'https://placehold.co/1200x600/b91c1c/ffffff?text=School+Building',
        },
      },
      {
        type: 'text',
        data: {
          title: 'Our Vision',
          content: 'XYZ School aims to provide holistic education that develops intellectual, emotional, and social intelligence.',
        },
      },
    ],
  },
];
