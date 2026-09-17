import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  GraduationCap,
  BookOpen,
  Bell,
  TrendingUp,
  Plus,
  ClipboardList,
  ArrowRight,
  Building2
} from 'lucide-react';

const STORAGE_KEY = 'multi_org_students';

function loadStudents() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const students = useMemo(() => loadStudents(), []);

  const stats = useMemo(() => {
    const total = students.length;
    const active = students.filter(s => s.status === 'Active').length;
    const school = students.filter(s => s.wing === 'School').length;
    const plus2 = students.filter(s => s.wing === 'Plus2').length;
    const bachelors = students.filter(s => s.wing === 'Bachelors').length;
    return { total, active, school, plus2, bachelors };
  }, [students]);

  const statCards = [
    {
      label: 'Total Students',
      value: stats.total,
      icon: Users,
      color: 'blue',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'border-blue-100',
      shadow: 'shadow-blue-500/10',
    },
    {
      label: 'Active Students',
      value: stats.active,
      icon: TrendingUp,
      color: 'emerald',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      shadow: 'shadow-emerald-500/10',
    },
    {
      label: 'School Wing',
      value: stats.school,
      icon: School,
      color: 'amber',
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      shadow: 'shadow-amber-500/10',
    },
    {
      label: 'Plus2 Wing',
      value: stats.plus2,
      icon: BookOpen,
      color: 'violet',
      bg: 'bg-violet-50',
      text: 'text-violet-600',
      border: 'border-violet-100',
      shadow: 'shadow-violet-500/10',
    },
    {
      label: 'Bachelors Wing',
      value: stats.bachelors,
      icon: GraduationCap,
      color: 'rose',
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100',
      shadow: 'shadow-rose-500/10',
    },
  ];

  const quickActions = [
    { label: 'Add Student', icon: Plus, path: '/admin/students', color: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' },
    { label: 'Post Notice', icon: Bell, path: '/admin/notice', color: 'bg-violet-600 hover:bg-violet-700 shadow-violet-600/20' },
    { label: 'Manage Results', icon: ClipboardList, path: '/admin/results', color: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20' },
    { label: 'Organization Setup', icon: Building2, path: '/admin/organization', color: 'bg-slate-700 hover:bg-slate-800 shadow-slate-700/20' },
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
    <div className="flex flex-col gap-8 p-4 sm:p-8 max-w-7xl mx-auto min-h-screen">
      {/* Welcome Header */}
      <div>
        <h3 className="text-2xl font-bold text-slate-800">Welcome back, Super Admin 👋</h3>
        <p className="text-slate-500 mt-1">
          Here's an overview of your multi-organization education platform.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`bg-white rounded-2xl border ${card.border} p-5 shadow-sm hover:shadow-md transition-all cursor-default`}
            >
              <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${card.text}`} />
              </div>
              <div className={`text-3xl font-extrabold ${card.text}`}>{card.value}</div>
              <div className="text-sm text-slate-500 font-medium mt-1">{card.label}</div>
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
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h4 className="text-base font-bold text-slate-700 mb-4">Quick Actions</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-white text-sm font-semibold shadow-lg transition-all active:scale-95 ${action.color}`}
                  >
                    <Icon className="w-4 h-4" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div>
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

      {/* Platform Modules Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {[
          {
            title: 'School Website',
            path: '/school/home',
            desc: 'Public school site with notices, gallery, teachers, events & scholarships.',
            color: 'from-emerald-500 to-teal-600',
            icon: School,
          },
          {
            title: 'Bachelor / College',
            path: '/bachelor',
            desc: 'College site with programs, faculty, notice board, results & contact.',
            color: 'from-blue-500 to-indigo-600',
            icon: GraduationCap,
          },
          {
            title: 'Admin Panel',
            path: '/admin',
            desc: 'Centralized management: students, notices, results, gallery & org setup.',
            color: 'from-slate-600 to-slate-800',
            icon: Building2,
          },
        ].map((module) => {
          const Icon = module.icon;
          return (
            <div
              key={module.title}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group"
            >
              <div className={`bg-gradient-to-r ${module.color} p-5 flex items-center gap-3`}>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h5 className="text-white font-bold text-base">{module.title}</h5>
              </div>
              <div className="p-5">
                <p className="text-slate-500 text-sm leading-relaxed">{module.desc}</p>
                <a
                  href={module.path}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Visit Site <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
