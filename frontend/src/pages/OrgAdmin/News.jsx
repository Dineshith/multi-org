import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Calendar, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const News = () => {
  const { user } = useAuth();
  
  const [newsList, setNewsList] = useState(() => {
    try {
      const allNews = JSON.parse(localStorage.getItem('orgNews') || '[]');
      return allNews.filter(n => n.organizationId === user.organizationId);
    } catch (e) {
      return [];
    }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState('published');
  const [searchQuery, setSearchQuery] = useState('');

  // Save to localStorage whenever newsList changes
  useEffect(() => {
    try {
      const allNews = JSON.parse(localStorage.getItem('orgNews') || '[]');
      const otherOrgsNews = allNews.filter(n => n.organizationId !== user.organizationId);
      localStorage.setItem('orgNews', JSON.stringify([...otherOrgsNews, ...newsList]));
    } catch (e) {
      console.error("Error saving news", e);
    }
  }, [newsList, user.organizationId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingNews) {
      // Update
      const updatedNews = newsList.map(n => 
        n.id === editingNews.id ? { ...n, title, content, image, status, updatedAt: new Date().toISOString() } : n
      );
      setNewsList(updatedNews);
    } else {
      // Create
      const newNews = {
        id: Date.now().toString(),
        organizationId: user.organizationId,
        title,
        content,
        image,
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNewsList([newNews, ...newsList]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      setNewsList(newsList.filter(n => n.id !== id));
    }
  };

  const openModal = (news = null) => {
    if (news) {
      setEditingNews(news);
      setTitle(news.title);
      setContent(news.content);
      setImage(news.image || '');
      setStatus(news.status);
    } else {
      setEditingNews(null);
      setTitle('');
      setContent('');
      setImage('');
      setStatus('published');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNews(null);
  };

  const filteredNews = newsList.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News Management</h1>
          <p className="text-gray-500 mt-1">Create and manage news articles for your organization.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>Add News</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-3">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search news by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 outline-none text-gray-700"
        />
      </div>

      {/* News List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredNews.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <FileText size={48} className="text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">No news found</p>
            <p className="mb-6">Get started by creating a new news article.</p>
            <button
              onClick={() => openModal()}
              type="button"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus size={20} />
              <span>Add News</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNews.map((news) => (
              <div key={news.id} className="p-6 flex items-start justify-between hover:bg-gray-50 transition-colors">
                <div className="flex-1 pr-6 flex gap-4">
                  {news.image && (
                    <img src={news.image} alt={news.title} className="w-24 h-24 object-cover rounded-lg border border-gray-100 flex-shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{news.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        news.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {news.status}
                      </span>
                    </div>
                    <p className="text-gray-600 line-clamp-2 mb-3">{news.content}</p>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{new Date(news.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal(news)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(news.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          {/* Background overlay */}
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>

          {/* Modal panel container */}
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              
              {/* Actual modal panel */}
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                    {editingNews ? 'Edit News' : 'Add New News'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        id="title"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter news title"
                      />
                    </div>
                    <div>
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
                      <input
                        type="url"
                        id="image"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                      <textarea
                        id="content"
                        required
                        rows={5}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Write your news content here..."
                      />
                    </div>
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editingNews ? 'Save Changes' : 'Publish News'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
