import React, { useState } from 'react';
import { PlusCircle, Search, Calendar, Bell, Trash2, Edit } from 'lucide-react';

export default function NoticeManagement() {
  const [notices, setNotices] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Event',
    audience: 'Global',
    subAudience: '',
    semesterOrYear: '',
    expiry: '',
    content: '',
    isPinned: false,
    sendNotification: true,
    file: null
  });

  const [submitType, setSubmitType] = useState('Active');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newNotice = {
      id: Date.now(),
      title: formData.title,
      category: formData.category,
      audience: formData.audience,
      subAudience: formData.subAudience,
      semesterOrYear: formData.semesterOrYear,
      expiry: formData.expiry,
      isPinned: formData.isPinned,
      status: submitType,
      date: new Date().toISOString().split('T')[0]
    };
    setNotices([newNotice, ...notices]);
    setFormData({ 
      title: '', category: 'Event', audience: 'Global', subAudience: '', semesterOrYear: '', 
      expiry: '', content: '', isPinned: false, sendNotification: true, file: null 
    });
  };

  const deleteNotice = (id) => {
    setNotices(notices.filter(n => n.id !== id));
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <div>
        <h3 className="text-2xl font-bold text-slate-800">Notice Management</h3>
        <p className="text-slate-500 mt-1">Create and manage announcements across all organizations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Create Notice Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            <h4 className="text-lg font-bold text-slate-800">Create New Notice</h4>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Notice Title <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter title here"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Category <span className="text-red-500">*</span></label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              >
                <option value="Event">Event</option>
                <option value="Exam">Exam / Academics</option>
                <option value="Holiday">Holiday</option>
                <option value="Urgent Alert">Urgent Alert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Target Audience</label>
              <select 
                value={formData.audience}
                onChange={(e) => setFormData({...formData, audience: e.target.value, subAudience: '', semesterOrYear: ''})}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              >
                <option value="Global">Global (All Orgs)</option>
                <option value="School">School Only</option>
                <option value="Plus2">Plus2 Only</option>
                <option value="Bachelors">Bachelors Only</option>
              </select>
            </div>

            {formData.audience !== 'Global' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Specific Class / Program (Optional)</label>
                <select 
                  value={formData.subAudience}
                  onChange={(e) => setFormData({...formData, subAudience: e.target.value, semesterOrYear: ''})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                >
                  <option value="">All in {formData.audience}</option>
                  {formData.audience === 'School' && (
                    <>
                      <option value="Primary">Primary (1-5)</option>
                      <option value="Secondary">Secondary (6-10)</option>
                      <option value="Grade 10">Grade 10 (SEE)</option>
                    </>
                  )}
                  {formData.audience === 'Plus2' && (
                    <>
                      <option value="Science">Science Faculty</option>
                      <option value="Management">Management Faculty</option>
                      <option value="Grade 11">Grade 11 All</option>
                      <option value="Grade 12">Grade 12 All</option>
                    </>
                  )}
                  {formData.audience === 'Bachelors' && (
                    <>
                      <option value="BCA">BCA Program</option>
                      <option value="BBS">BBS Program</option>
                      <option value="CSIT">CSIT</option>
                      <option value="BIT">BIT</option>
                      <option value="BSc">BSc</option>
                    </>
                  )}
                </select>
              </div>
            )}

            {formData.audience === 'Bachelors' && formData.subAudience && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  {['BBS', 'BSc'].includes(formData.subAudience) ? 'Year' : 'Semester'} (Optional)
                </label>
                <select 
                  value={formData.semesterOrYear}
                  onChange={(e) => setFormData({...formData, semesterOrYear: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                >
                  <option value="">All Years/Semesters</option>
                  {['BBS', 'BSc'].includes(formData.subAudience) ? (
                    <>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </>
                  ) : (
                    <>
                      <option value="1st Semester">1st Semester</option>
                      <option value="2nd Semester">2nd Semester</option>
                      <option value="3rd Semester">3rd Semester</option>
                      <option value="4th Semester">4th Semester</option>
                      <option value="5th Semester">5th Semester</option>
                      <option value="6th Semester">6th Semester</option>
                      <option value="7th Semester">7th Semester</option>
                      <option value="8th Semester">8th Semester</option>
                    </>
                  )}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Expiry Date <span className="text-red-500">*</span></label>
              <input 
                type="date" 
                required
                value={formData.expiry}
                onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Message Body <span className="text-red-500">*</span></label>
              <textarea 
                rows="4"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Type your notice content..."
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-y"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Attachment (Optional)</label>
              <input 
                type="file" 
                onChange={(e) => setFormData({...formData, file: e.target.files[0]})}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer p-2 bg-red-50 border border-red-100 rounded-lg transition-colors hover:bg-red-100/50">
                <input 
                  type="checkbox" 
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({...formData, isPinned: e.target.checked})}
                  className="w-4 h-4 text-red-600 rounded border-red-300 focus:ring-red-500"
                />
                <span className="font-semibold text-red-700">📌 Pin to Top (High Priority)</span>
              </label>

              <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer p-2 bg-blue-50 border border-blue-100 rounded-lg transition-colors hover:bg-blue-100/50">
                <input 
                  type="checkbox" 
                  checked={formData.sendNotification}
                  onChange={(e) => setFormData({...formData, sendNotification: e.target.checked})}
                  className="w-4 h-4 text-blue-600 rounded border-blue-300 focus:ring-blue-500"
                />
                <span className="font-semibold text-blue-700">🔔 Send Email/SMS Notification</span>
              </label>
            </div>

            <div className="flex gap-3 mt-4">
              <button 
                type="submit"
                onClick={() => setSubmitType('Draft')}
                className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-lg transition-colors"
              >
                Save Draft
              </button>
              <button 
                type="submit"
                onClick={() => setSubmitType('Active')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-md shadow-blue-600/20"
              >
                Publish Now
              </button>
            </div>
          </form>
        </div>

        {/* Notice List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-lg font-bold text-slate-800">Recent Notices</h4>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search notices..." 
                className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Title & Details</th>
                  <th className="p-4 font-semibold">Audience</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {notices.map((notice) => (
                  <tr key={notice.id} className={`hover:bg-slate-50 transition-colors ${notice.isPinned ? 'bg-red-50/30' : ''}`}>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800 text-sm mb-1 flex items-center gap-2">
                        {notice.isPinned && <span className="text-red-500" title="Pinned to top">📌</span>}
                        {notice.title}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Bell className="w-3 h-3" /> {notice.category}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Ends: {notice.expiry}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="inline-block px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-md text-xs font-semibold">
                          {notice.audience}
                        </span>
                        {notice.subAudience && (
                          <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                            {notice.subAudience}
                          </span>
                        )}
                        {notice.semesterOrYear && (
                          <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                            {notice.semesterOrYear}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        notice.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${notice.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                        {notice.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors mr-1">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteNotice(notice.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {notices.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-slate-500">
                      No notices found. Create one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
