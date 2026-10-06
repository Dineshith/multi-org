import React, { useState, useEffect } from 'react';
import { getOrganizations, getUsers, getAllNotices, getAllEvents } from '../../services/apiService';
import { Building2, Activity, FileText, Calendar, Bell } from 'lucide-react';
import Modal from '../../components/shared/Modal';

const Dashboard = () => {
  const [organizations, setOrganizations] = useState([]);
  const [users, setUsers] = useState([]);
  const [orgStats, setOrgStats] = useState([]);
  const [modalData, setModalData] = useState({ isOpen: false, title: '', items: [] });

  useEffect(() => {
    const loadData = async () => {
      const orgs = await getOrganizations();
      setOrganizations(orgs);
      setUsers(await getUsers());

      const notices = await getAllNotices();
      const events = await getAllEvents();
    let news = [];
    try {
      news = JSON.parse(sessionStorage.getItem('orgNews') || '[]');
    } catch (e) {}

    const stats = orgs.filter(o => o.id !== 0).map(org => {
      const orgNotices = notices.filter(n => n.organizationId === org.id);
      const orgEvents = events.filter(e => e.organizationId === org.id);
      const orgNews = news.filter(n => n.organizationId === org.id);
      
      return {
        id: org.id,
        name: org.name,
        logo: org.logo_url || org.branding?.logo,
        noticeCount: orgNotices.length,
        noticeList: orgNotices.map(n => {
          const d = n.publishedAt ? new Date(n.publishedAt).toLocaleDateString() : 'N/A';
          return `${n.title} (Added: ${d})`;
        }),
        eventCount: orgEvents.length,
        eventList: orgEvents.map(e => {
          const d = e.date ? new Date(e.date).toLocaleDateString() : 'N/A';
          return `${e.title} (Event: ${d})`;
        }),
        newsCount: orgNews.length,
        newsList: orgNews.map(n => {
          const d = n.createdAt ? new Date(n.createdAt).toLocaleDateString() : 'N/A';
          return `${n.title} (Added: ${d})`;
        }),
      };
    });
    setOrgStats(stats);
    };
    loadData();
  }, []);

  const activeOrgs = organizations.filter(o => o.status?.toLowerCase() === 'active').length;
  const orgAdmins = users.filter(u => u.role === 'ORG_ADMIN').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Organizations</p>
            <p className="text-2xl font-bold text-gray-900">{activeOrgs}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Organization Admins</p>
            <p className="text-2xl font-bold text-gray-900">{orgAdmins}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Recent Organizations</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {organizations.map(org => (
            <div key={org.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                {org.logo_url || org.branding?.logo ? (
                  <img src={org.logo_url || org.branding?.logo} alt="" className="w-12 h-12 rounded object-cover bg-white shadow-sm" />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center font-bold text-gray-500">
                    {org.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-gray-900">{org.name}</h4>
                  <p className="text-sm text-gray-500">{org.type} • {org.slug}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${org.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {org.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content Activity Overview Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-semibold text-gray-800">Content Activity Overview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Notices</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">News</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Events</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Content</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orgStats.map(stat => (
                <tr key={stat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      {stat.logo ? (
                        <img src={stat.logo} alt="" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                          {stat.name.charAt(0)}
                        </div>
                      )}
                      <span className="font-medium text-gray-900">{stat.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div 
                      className="flex items-center justify-center space-x-1 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
                      onClick={() => setModalData({ isOpen: true, title: `${stat.name} - Notices`, items: stat.noticeList })}
                    >
                      <Bell size={14} className="text-yellow-500" />
                      <span className="font-medium text-gray-700">{stat.noticeCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div 
                      className="flex items-center justify-center space-x-1 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
                      onClick={() => setModalData({ isOpen: true, title: `${stat.name} - News`, items: stat.newsList })}
                    >
                      <FileText size={14} className="text-blue-500" />
                      <span className="font-medium text-gray-700">{stat.newsCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div 
                      className="flex items-center justify-center space-x-1 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
                      onClick={() => setModalData({ isOpen: true, title: `${stat.name} - Events`, items: stat.eventList })}
                    >
                      <Calendar size={14} className="text-green-500" />
                      <span className="font-medium text-gray-700">{stat.eventCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {stat.noticeCount + stat.newsCount + stat.eventCount}
                    </span>
                  </td>
                </tr>
              ))}
              {orgStats.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No active organizations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalData.isOpen} onClose={() => setModalData({ ...modalData, isOpen: false })} title={modalData.title}>
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {modalData.items.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {modalData.items.map((item, index) => (
                <li key={index} className="text-sm font-medium">{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">No content found.</p>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <button 
            onClick={() => setModalData({ ...modalData, isOpen: false })}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
