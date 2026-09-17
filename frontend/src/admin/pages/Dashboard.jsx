import React from 'react';
import { 
  Users, 
  LayoutDashboard, 
  BellRing, 
  UserCheck,
  MessageSquare,
  BarChart3,
  Clock,
  CheckCircle2,
  MailWarning,
  School,
  GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const stats = [
    { label: 'Total Students', value: '3,428', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12% this year' },
    { label: 'Active Portals', value: '4', icon: LayoutDashboard, color: 'text-purple-600', bg: 'bg-purple-50', trend: 'All systems operational' },
    { label: 'Active Notices', value: '12', icon: BellRing, color: 'text-orange-600', bg: 'bg-orange-50', trend: '3 posted today' },
    { label: 'Staff & Faculty', value: '154', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+5 new hires' },
  ];

  const inquiries = [
    { name: 'Sita Ram Poudel', topic: 'Admission Inquiry (BCA)', date: 'Today, 10:30 AM', status: 'Unread' },
    { name: 'Nabin Khadka', topic: 'Fee Structure Issue', date: 'Yesterday', status: 'Replied' },
    { name: 'Rina Thapa', topic: 'School Scholarship Details', date: '2 days ago', status: 'In Progress' },
    { name: 'Ashok Shrestha', topic: 'IT Support / Login Issue', date: 'Oct 12, 2025', status: 'Replied' },
    { name: 'Kopila Magar', topic: 'General Inquiry', date: 'Oct 10, 2025', status: 'Replied' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Unread': return 'bg-red-50 text-red-600 border-red-100';
      case 'In Progress': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'Replied': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Unread': return <MailWarning className="w-3 h-3 mr-1" />;
      case 'In Progress': return <Clock className="w-3 h-3 mr-1" />;
      case 'Replied': return <CheckCircle2 className="w-3 h-3 mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Overview Dashboard</h1>
        <p className="text-sm text-slate-500 mt-2">Welcome back to the admin control panel. Here is what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group hover:border-slate-200 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <div className="mt-4 pt-4 border-t border-slate-50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {stat.trend}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Enrollment Distribution */}
        <div className="lg:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Enrollment Distribution
            </h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="mb-8">
              <span className="text-4xl font-bold text-slate-800">3,428</span>
              <span className="text-sm text-slate-500 ml-2">Total active students</span>
            </div>

            <div className="space-y-6">
              {/* School Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-slate-700 flex items-center gap-2">
                    <School className="w-4 h-4 text-emerald-500" />
                    School (1-10)
                  </span>
                  <span className="font-bold text-slate-800">1,200</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <p className="text-xs text-slate-400 mt-1 text-right">35% of total</p>
              </div>

              {/* +2 Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-slate-700 flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4 text-orange-500" />
                    Plus Two (+2)
                  </span>
                  <span className="font-bold text-slate-800">800</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-orange-400 h-2.5 rounded-full" style={{ width: '23%' }}></div>
                </div>
                <p className="text-xs text-slate-400 mt-1 text-right">23% of total</p>
              </div>

              {/* Bachelor Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-slate-700 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-purple-500" />
                    Bachelor Degree
                  </span>
                  <span className="font-bold text-slate-800">1,428</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                </div>
                <p className="text-xs text-slate-400 mt-1 text-right">42% of total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Website Inquiries */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-500" />
              Recent Website Inquiries
            </h2>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All Messages</button>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sender Name</th>
                    <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Inquiry Topic</th>
                    <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inquiries.map((inquiry, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-800 text-sm">{inquiry.name}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-slate-600 text-sm font-medium">{inquiry.topic}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-slate-500 text-sm">{inquiry.date}</div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(inquiry.status)}`}>
                          {getStatusIcon(inquiry.status)}
                          {inquiry.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {inquiries.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-sm">
                No recent inquiries from the website.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
