import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getNotices, getEvents } from '../../services/mockDbService';
import { FileText, Calendar, Users as UsersIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [myNotices, setMyNotices] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  
  useEffect(() => {
    setMyNotices(getNotices(user.organizationId));
    setMyEvents(getEvents(user.organizationId));
  }, [user.organizationId]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Notices</p>
            <p className="text-2xl font-bold text-gray-900">{myNotices.length}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Upcoming Events</p>
            <p className="text-2xl font-bold text-gray-900">{myEvents.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
            <UsersIcon size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Staff Members</p>
            <p className="text-2xl font-bold text-gray-900">24</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notices */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Recent Notices</h3>
            <Link to="/admin/notices" className="text-sm text-indigo-600 font-medium hover:text-indigo-800">View All</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {myNotices.slice(0, 5).map(notice => (
              <div key={notice.id} className="p-4 hover:bg-gray-50 transition-colors">
                <h4 className="font-medium text-gray-900 line-clamp-1">{notice.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{new Date(notice.publishedAt).toLocaleDateString()}</p>
              </div>
            ))}
            {myNotices.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-sm">No notices found.</div>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Upcoming Events</h3>
            <Link to="/admin/events" className="text-sm text-indigo-600 font-medium hover:text-indigo-800">View All</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {myEvents.slice(0, 5).map(event => (
              <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors flex items-start space-x-4">
                <div className="bg-indigo-50 text-indigo-600 rounded text-center px-3 py-1 flex-shrink-0">
                  <div className="text-xs font-bold uppercase">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                  <div className="text-xl font-bold leading-none">{new Date(event.date).getDate()}</div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 line-clamp-1">{event.title}</h4>
                  <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">{event.description}</p>
                </div>
              </div>
            ))}
            {myEvents.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-sm">No events found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
