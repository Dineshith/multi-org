import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, BookOpen, Bell, GraduationCap,
  School, TrendingUp, Plus, ClipboardList,
  ArrowRight, Building2
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

function loadNotices() {
  // NoticeManagement uses in-memory state, so we just return 0 here
  // In a real API setup this would fetch from backend
  return 0;
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

  return (
    <div className="flex flex-col gap-8">
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

      {/* Platform Modules Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
