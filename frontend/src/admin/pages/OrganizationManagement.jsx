import React, { useState } from 'react';
import { Building2, School, GraduationCap, CalendarDays, Users, Save, Plus, Edit, Trash2, CheckCircle2 } from 'lucide-react';

export default function OrganizationManagement() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Organization Profile', icon: Building2, desc: 'Name, Logo, Contact' },
    { id: 'wings', label: 'Wings / Branches', icon: School, desc: 'School, Plus2, Bachelors' },
    { id: 'programs', label: 'Programs & Faculties', icon: GraduationCap, desc: 'Science, BBS, BCA' },
    { id: 'sessions', label: 'Academic Sessions', icon: CalendarDays, desc: 'Active academic years' },
    { id: 'departments', label: 'Departments & Roles', icon: Users, desc: 'IT, Examination, Admin' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-2xl font-bold text-slate-800">Organization Setup</h3>
        <p className="text-slate-500 mt-1">Manage institutional profile, wings, programs, and academic sessions.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col lg:flex-row min-h-[700px]">
        
        {/* Vertical Sidebar Tabs */}
        <div className="w-full lg:w-72 bg-slate-50 border-r border-slate-100 p-4 flex flex-col gap-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-start gap-3 p-3 rounded-xl transition-all text-left border ${
                  isActive 
                    ? 'bg-white border-blue-100 shadow-sm shadow-blue-500/5' 
                    : 'border-transparent hover:bg-slate-100/50 hover:border-slate-200'
                }`}
              >
                <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className={`font-bold text-[0.95rem] ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>{tab.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{tab.desc}</div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 lg:p-10 bg-white">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'wings' && <WingsTab />}
          {activeTab === 'programs' && <ProgramsTab />}
          {activeTab === 'sessions' && <SessionsTab />}
          {activeTab === 'departments' && <DepartmentsTab />}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 1. Profile Tab Component
// -------------------------------------------------------------
function ProfileTab() {
  return (
    <div className="max-w-2xl animate-fade-in">
      <h4 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4">Organization Profile</h4>
      
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-6 mb-4">
          <div className="w-24 h-24 bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 hover:border-blue-400 transition-colors">
            <Building2 className="w-8 h-8 mb-1" />
            <span className="text-xs font-semibold">Upload Logo</span>
          </div>
          <div>
            <h5 className="font-bold text-slate-700">Institution Logo</h5>
            <p className="text-sm text-slate-500 mb-2">Recommended size: 512x512px. PNG or JPG.</p>
            <button className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold border border-blue-100 hover:bg-blue-100 transition-colors">Choose File</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Institution Name</label>
            <input type="text"  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
            <input type="number"  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
            <input type="email"  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Full Address</label>
            <input type="text"  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="mt-4">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors shadow-md shadow-blue-600/20">
            <Save className="w-4 h-4" /> Save Profile
          </button>
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// 2. Wings / Branches Tab Component
// -------------------------------------------------------------
function WingsTab() {
  const wings = [
    { id: 1, name: 'School', code: 'SCH', status: 'Active' },
    { id: 2, name: 'Plus2', code: 'P2', status: 'Active' },
    { id: 3, name: 'Bachelors', code: 'BACH', status: 'Active' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <h4 className="text-xl font-bold text-slate-800">Wings / Branches</h4>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Wing
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wings.map(w => (
          <div key={w.id} className="border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-blue-300 transition-colors bg-slate-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg">
                {w.code}
              </div>
              <div>
                <h5 className="font-bold text-slate-800 text-lg">{w.name}</h5>
                <span className="inline-flex items-center text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full mt-1">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> {w.status}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-slate-400 hover:text-blue-600 bg-white rounded-lg border border-slate-200 shadow-sm"><Edit className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// 3. Programs Tab Component
// -------------------------------------------------------------
function ProgramsTab() {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <h4 className="text-xl font-bold text-slate-800">Programs & Faculties</h4>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Program
        </button>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-500 text-xs uppercase tracking-wider font-bold">
              <th className="p-4">Program Name</th>
              <th className="p-4">Wing</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { n: 'Science Faculty', w: 'Plus2', d: '2 Years', s: 'Active' },
              { n: 'Management Faculty', w: 'Plus2', d: '2 Years', s: 'Active' },
              { n: 'BCA (Computer App)', w: 'Bachelors', d: '8 Semesters', s: 'Active' },
              { n: 'BBS (Business Studies)', w: 'Bachelors', d: '4 Years', s: 'Active' },
              { n: 'CSIT (Computer Science and Information Technology)', w: 'Bachelors', d: '8 Semesters', s: 'Active' },
              { n: 'BIT (Bachelors of Information Technology)', w: 'Bachelors', d: '8 Semesters', s: 'Active' },
              { n: 'BSc (Bachelors of Science)', w: 'Bachelors', d: '8 Semesters', s: 'Active' },
            ].map((p, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-700">{p.n}</td>
                <td className="p-4"><span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-semibold border border-purple-100">{p.w}</span></td>
                <td className="p-4 text-sm text-slate-600 font-medium">{p.d}</td>
                <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-semibold">{p.s}</span></td>
                <td className="p-4 text-right">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600"><Edit className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// 4. Sessions Tab Component
// -------------------------------------------------------------
function SessionsTab() {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <h4 className="text-xl font-bold text-slate-800">Academic Sessions</h4>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> New Session
        </button>
      </div>

      <div className="grid gap-4">
        <div className="border-2 border-green-500 bg-green-50/30 rounded-xl p-5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wide">Current Active</div>
          <div>
            <h5 className="font-bold text-green-800 text-xl">2081 / 2082</h5>
            <p className="text-sm text-green-600/80 font-medium mt-1">Started on: Baisakh 2081</p>
          </div>
          <button className="px-4 py-2 bg-white text-green-700 font-bold border border-green-200 rounded-lg hover:bg-green-100 transition-colors">Edit Settings</button>
        </div>

        <div className="border border-slate-200 bg-slate-50/50 rounded-xl p-5 flex items-center justify-between grayscale-[50%] opacity-80">
          <div>
            <h5 className="font-bold text-slate-700 text-xl">2080 / 2081</h5>
            <p className="text-sm text-slate-500 font-medium mt-1">Ended on: Chaitra 2080</p>
          </div>
          <button className="px-4 py-2 bg-white text-slate-600 font-bold border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors">View Archive</button>
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// 5. Departments Tab Component
// -------------------------------------------------------------
function DepartmentsTab() {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <h4 className="text-xl font-bold text-slate-800">Departments & Roles</h4>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[
          { n: 'Examination Dept.', h: 'Ram Prasad Sharma', e: '4 Staffs' },
          { n: 'Account Section', h: 'Sita Gurung', e: '3 Staffs' },
          { n: 'IT & Administration', h: 'Hari Bahadur', e: '2 Staffs' },
          { n: 'Library', h: 'Gita Thapa', e: '2 Staffs' }
        ].map((d, i) => (
          <div key={i} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white">
            <h5 className="font-bold text-slate-800 text-lg">{d.n}</h5>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Head:</span>
                <span className="font-semibold text-slate-700">{d.h}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Members:</span>
                <span className="font-semibold text-slate-700">{d.e}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
              <button className="flex-1 py-1.5 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">Manage</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
