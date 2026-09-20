import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPages, createPage, updatePage, deletePage } from '../../services/mockDbService';
import { Plus, Search, Edit2, Trash2, LayoutTemplate, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import Modal from '../../components/shared/Modal';

const Pages = () => {
  const { user } = useAuth();
  const [pages, setPages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPage, setNewPage] = useState({ title: '', slug: '', dropdownItems: [] });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadPages();
  }, [user.organizationId]);

  const loadPages = () => {
    setPages(getPages(user.organizationId));
  };

  const handleCreatePage = (e) => {
    e.preventDefault();
    if (editingId) {
      updatePage(editingId, {
        title: newPage.title,
        slug: newPage.slug,
        dropdownItems: newPage.dropdownItems.filter(g => g.trim() !== '')
      });
    } else {
      createPage(user.organizationId, {
        ...newPage,
        dropdownItems: newPage.dropdownItems.filter(g => g.trim() !== ''),
        sections: []
      });
    }
    loadPages();
    setIsModalOpen(false);
    setNewPage({ title: '', slug: '', dropdownItems: [] });
    setEditingId(null);
  };

  const handleEditMeta = (page) => {
    let dItems = [];
    if (Array.isArray(page.dropdownItems)) {
      dItems = page.dropdownItems;
    } else if (Array.isArray(page.menuGroups)) {
      dItems = page.menuGroups; // migrate old data
    } else if (page.menuGroup) {
      dItems = [page.menuGroup];
    }
    setNewPage({ title: page.title, slug: page.slug, dropdownItems: dItems });
    setEditingId(page.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this page? This cannot be undone.')) {
      deletePage(id);
      loadPages();
    }
  };
  
  const filteredPages = pages.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

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
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setNewPage({ title: '', slug: '', dropdownItems: [] });
            setIsModalOpen(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>New Page</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPages.map(page => (
          <div key={page.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="p-6 flex-grow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                  <LayoutTemplate size={24} />
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEditMeta(page)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit details">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(page.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{page.title}</h3>
              <p className="text-sm text-gray-500">/{page.slug}</p>
              
              {page.dropdownItems && page.dropdownItems.length > 0 ? (
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                  <span className="text-gray-500 italic flex items-center"><List size={14} className="mr-1" /> Dropdown Menu</span>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                  <span className="text-gray-500">{page.sections?.length || 0} Sections</span>
                  <Link to={user.role === 'SUPER_ADMIN' ? `/platform-admin/pages/${page.id}` : `/admin/dashboard/pages/${page.id}`} className="text-indigo-600 font-medium hover:text-indigo-800">
                    Open Builder &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredPages.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-gray-200 border-dashed">
            <LayoutTemplate className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No pages found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new page.</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Edit Page Details" : "Create New Page"}>
        <form onSubmit={handleCreatePage} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Page Title</label>
            <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                   value={newPage.title} onChange={e => setNewPage({...newPage, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">URL Slug</label>
            <input required type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                   value={newPage.slug} onChange={e => setNewPage({...newPage, slug: e.target.value})} />
            <p className="mt-1 text-xs text-gray-500">Will be accessible at /org/your-org/{newPage.slug || 'slug'}</p>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Dropdown Sub-menus (Optional)</label>
              <button 
                type="button" 
                onClick={() => setNewPage({...newPage, dropdownItems: [...newPage.dropdownItems, '']})}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
              >
                <Plus size={14} className="mr-1" /> Add Sub-menu
              </button>
            </div>
            
            {newPage.dropdownItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <input type="text" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                       value={item} 
                       onChange={e => {
                         const updated = [...newPage.dropdownItems];
                         updated[index] = e.target.value;
                         setNewPage({...newPage, dropdownItems: updated});
                       }} 
                       placeholder="e.g. Teachers" />
                <button 
                  type="button" 
                  onClick={() => {
                    const updated = [...newPage.dropdownItems];
                    updated.splice(index, 1);
                    setNewPage({...newPage, dropdownItems: updated});
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            
            {newPage.dropdownItems.length === 0 && (
              <button 
                type="button" 
                onClick={() => setNewPage({...newPage, dropdownItems: ['']})}
                className="mt-1 w-full p-2 border border-dashed border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
              >
                + Add a Sub-menu Item
              </button>
            )}
            
            <p className="mt-2 text-xs text-gray-500">Adding sub-menus will turn this page into a dropdown menu in the navbar (e.g. {newPage.title || 'About Us'} +).</p>
          </div>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button type="submit" className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:col-start-2">
              {editingId ? "Save Changes" : "Create Page"}
            </button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Pages;
