import React, { useState, useEffect } from 'react';
import { MessageSquare, MailWarning, CheckCircle2, Clock, Eye, Trash2, X, Search, Filter } from 'lucide-react';

export default function Contact() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Reply states
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);

  const mockData = [
    { id: 1, name: 'Sita Ram Poudel', email: 'sita@example.com', phone: '9841234567', topic: 'Admission Inquiry (BCA)', message: 'I would like to know the admission process for the BCA program. What is the deadline for the upcoming session?', date: '2026-09-16 10:30 AM', status: 'Unread', portal: 'Bachelors' },
    { id: 2, name: 'Nabin Khadka', email: 'nabin@example.com', phone: '9851234567', topic: 'Fee Structure Issue', message: 'The online fee payment portal is showing an error for my Grade 10 child. Please help resolve this.', date: '2026-09-15 02:15 PM', status: 'Replied', portal: 'School' },
    { id: 3, name: 'Rina Thapa', email: 'rina.th@example.com', phone: '9861234567', topic: 'School Scholarship Details', message: 'Could you please send me details about the merit-based scholarship for the +2 Science program?', date: '2026-09-14 09:20 AM', status: 'In Progress', portal: 'Plus Two' },
    { id: 4, name: 'Ashok Shrestha', email: 'ashok@example.com', phone: '9811234567', topic: 'General Inquiry', message: 'Where is the main administration building located? Do you have parking facilities for visitors?', date: '2026-09-12 11:45 AM', status: 'Replied', portal: 'Main Portal' },
    { id: 5, name: 'Kopila Magar', email: 'kopila@example.com', phone: '9821234567', topic: 'Job Application', message: 'I saw a vacancy for a primary teacher on your website. I have attached my CV to the email address provided. Just following up.', date: '2026-09-10 03:30 PM', status: 'Unread', portal: 'School' },
  ];

  useEffect(() => {
    // Simulate fetching data from backend
    const stored = localStorage.getItem('admin_contact_messages');
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      setMessages(mockData);
      localStorage.setItem('admin_contact_messages', JSON.stringify(mockData));
    }
  }, []);

  const saveMessages = (newMessages) => {
    setMessages(newMessages);
    localStorage.setItem('admin_contact_messages', JSON.stringify(newMessages));
  };

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
      case 'Unread': return <MailWarning className="w-3.5 h-3.5 mr-1.5" />;
      case 'In Progress': return <Clock className="w-3.5 h-3.5 mr-1.5" />;
      case 'Replied': return <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />;
      default: return null;
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    const updated = messages.map(msg => msg.id === id ? { ...msg, status: newStatus } : msg);
    saveMessages(updated);
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage({ ...selectedMessage, status: newStatus });
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    setIsSending(true);
    // Mock sending email
    setTimeout(() => {
      handleUpdateStatus(selectedMessage.id, 'Replied');
      setIsSending(false);
      setShowReplyBox(false);
      setReplyText('');
    }, 1000);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      const updated = messages.filter(msg => msg.id !== id);
      saveMessages(updated);
      setSelectedMessage(null);
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesStatus = filterStatus === 'All' || msg.status === filterStatus;
    const matchesSearch = msg.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          msg.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          msg.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-blue-500" />
          Contact Inquiries
        </h1>
        <p className="text-sm text-slate-500 mt-2">Manage all contact requests, admissions inquiries, and support messages from the public portals.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, email, or topic..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          {['All', 'Unread', 'In Progress', 'Replied'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors border ${
                filterStatus === status 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Sender</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Topic / Portal</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-500">
                    No inquiries found matching your criteria.
                  </td>
                </tr>
              ) : filteredMessages.map((msg) => (
                <tr 
                  key={msg.id} 
                  className={`hover:bg-blue-50/50 transition-colors cursor-pointer ${msg.status === 'Unread' ? 'bg-slate-50/30' : ''}`}
                  onClick={() => setSelectedMessage(msg)}
                >
                  <td className="py-4 px-6">
                    <div className="font-bold text-slate-800">{msg.name}</div>
                    <div className="text-sm text-slate-500 mt-0.5">{msg.email}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-700">{msg.topic}</div>
                    <div className="text-xs text-blue-600 font-semibold mt-1 px-2 py-0.5 bg-blue-50 inline-block rounded-full">
                      {msg.portal}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-500 font-medium">
                    {msg.date}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(msg.status)}`}>
                      {getStatusIcon(msg.status)}
                      {msg.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedMessage(msg); }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center gap-1 text-sm font-semibold mr-2"
                    >
                      <Eye className="w-4 h-4" /> View
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(selectedMessage.status)}`}>
                  {getStatusIcon(selectedMessage.status)}
                  {selectedMessage.status}
                </span>
                <span className="text-sm font-medium text-slate-500">{selectedMessage.date}</span>
              </div>
              <button 
                onClick={() => setSelectedMessage(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">{selectedMessage.topic}</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">From</label>
                  <p className="font-semibold text-slate-800">{selectedMessage.name}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Email</label>
                  <a href={`mailto:${selectedMessage.email}`} className="font-semibold text-blue-600 hover:underline">{selectedMessage.email}</a>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone</label>
                  <p className="font-semibold text-slate-800">{selectedMessage.phone}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Origin Portal</label>
                  <span className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                    {selectedMessage.portal}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Message Details</label>
                <div className="text-slate-700 leading-relaxed bg-white p-5 rounded-2xl border border-slate-200 shadow-sm whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Reply Box Section */}
              {showReplyBox ? (
                <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 mb-2">
                  <label className="text-xs font-bold text-blue-500 uppercase tracking-wider block mb-2">Draft Reply to {selectedMessage.name}</label>
                  <textarea 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows="4" 
                    placeholder="Type your response here..." 
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none shadow-sm mb-3"
                  ></textarea>
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => setShowReplyBox(false)}
                      className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-200/50 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSendReply}
                      disabled={isSending || !replyText.trim()}
                      className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-sm transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSending ? 'Sending...' : 'Send Reply'}
                    </button>
                  </div>
                </div>
              ) : (
                selectedMessage.status !== 'Replied' && (
                  <button 
                    onClick={() => setShowReplyBox(true)}
                    className="w-full py-3 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-colors border border-blue-100 border-dashed"
                  >
                    + Write a Reply
                  </button>
                )
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
              <button 
                onClick={() => handleDelete(selectedMessage.id)}
                className="px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
              <div className="flex gap-3">
                {selectedMessage.status !== 'Unread' && (
                  <button 
                    onClick={() => handleUpdateStatus(selectedMessage.id, 'Unread')}
                    className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 shadow-sm transition-all text-sm"
                  >
                    Mark Unread
                  </button>
                )}
                {selectedMessage.status !== 'In Progress' && (
                  <button 
                    onClick={() => handleUpdateStatus(selectedMessage.id, 'In Progress')}
                    className="px-5 py-2.5 bg-yellow-50 text-yellow-700 border border-yellow-200 font-semibold rounded-xl hover:bg-yellow-100 shadow-sm transition-all text-sm flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4" /> In Progress
                  </button>
                )}
                {selectedMessage.status !== 'Replied' && (
                  <button 
                    onClick={() => handleUpdateStatus(selectedMessage.id, 'Replied')}
                    className="px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 shadow-sm transition-all text-sm flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Mark Replied (Without Sending)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
