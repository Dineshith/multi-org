import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getNotices, createNotice, updateNotice, deleteNotice } from '../../services/mockDbService';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import Modal from '../../components/shared/Modal';

const Notices = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: '', content: '', image: '', published: true, publishOnMainPortal: false });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadNotices();
  }, [user.organizationId]);

  const loadNotices = () => {
    setNotices(getNotices(user.organizationId));
  };

  const handleCreateNotice = (e) => {
    e.preventDefault();
    if (editingId) {
      updateNotice(editingId, newNotice);
    } else {
      createNotice(user.organizationId, newNotice);
    }
    loadNotices();
    setIsModalOpen(false);
    setNewNotice({ title: '', content: '', image: '', published: true, publishOnMainPortal: false });
    setEditingId(null);
  };

  const handleEdit = (notice) => {
    setNewNotice({ title: notice.title, content: notice.content, image: notice.image || '', published: notice.published, publishOnMainPortal: !!notice.publishOnMainPortal });
    setEditingId(notice.id);
    setIsModalOpen(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit for local storage
        alert('Image is too large. Please select an image under 1MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewNotice({ ...newNotice, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      deleteNotice(id);
      loadNotices();
    }
  };
  
  const filteredNotices = notices.filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search notices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setNewNotice({ title: '', content: '', image: '', published: true, publishOnMainPortal: false });
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>New Notice</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published Date</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredNotices.map((notice) => (
              <tr key={notice.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{notice.title}</div>
                  <div className="text-sm text-gray-500 line-clamp-1 mt-1">{notice.content}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    notice.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {notice.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {notice.publishedAt ? new Date(notice.publishedAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-3">
                    <button onClick={() => handleEdit(notice)} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(notice.id)} className="text-red-600 hover:text-red-900" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredNotices.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                  No notices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Notice" : "Create New Notice"}>
        <form onSubmit={handleCreateNotice} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Notice Title</label>
            <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                   value={newNotice.title} onChange={e => setNewNotice({...newNotice, title: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Notice Image (Optional)</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
            {newNotice.image && (
              <div className="mt-2 relative inline-block">
                <img src={newNotice.image} alt="Preview" className="h-20 w-auto rounded border border-gray-200" />
                <button type="button" onClick={() => setNewNotice({...newNotice, image: ''})} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea required rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                   value={newNotice.content} onChange={e => setNewNotice({...newNotice, content: e.target.value})} />
          </div>
          <div className="flex items-center">
            <input id="publishOnMainPortal" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
                   checked={newNotice.publishOnMainPortal} onChange={e => setNewNotice({...newNotice, publishOnMainPortal: e.target.checked})} />
            <label htmlFor="publishOnMainPortal" className="ml-2 block text-sm text-gray-900">
              Publish on Main portal
            </label>
          </div>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button type="submit" className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:col-start-2">
              {editingId ? "Update Notice" : "Create Notice"}
            </button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Notices;
