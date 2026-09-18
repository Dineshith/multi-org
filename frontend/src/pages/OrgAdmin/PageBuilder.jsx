import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPage, updatePage } from '../../services/mockDbService';
import { Save, ArrowLeft, Plus, Image as ImageIcon, Type, LayoutTemplate, Trash2, ArrowUp, ArrowDown, List, Calendar, LayoutGrid, Megaphone } from 'lucide-react';

const PageBuilder = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [sections, setSections] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadedPage = getPage(pageId);
    if (loadedPage) {
      setPage(loadedPage);
      setSections(loadedPage.sections || []);
    }
  }, [pageId]);

  const handleSave = () => {
    setIsSaving(true);
    updatePage(pageId, { sections });
    setTimeout(() => {
      setIsSaving(false);
    }, 500);
  };

  const addSection = (type) => {
    let newSection = { id: Date.now(), type, background: 'default', data: {} };
    switch(type) {
      case 'hero':
        newSection.data = { title: 'New Hero Title', subtitle: 'Hero Subtitle', image: 'https://placehold.co/1200x600/374151/ffffff?text=Hero+Image' };
        break;
      case 'text':
        newSection.data = { title: 'Section Title', content: 'Type your paragraph here...' };
        break;
      case 'image':
        newSection.data = { url: 'https://placehold.co/800x400/e5e7eb/6b7280?text=Image', caption: 'Image caption' };
        break;
      case 'notice_list':
        newSection.data = { title: 'Recent Notices' };
        break;
      case 'event_list':
        newSection.data = { title: 'Upcoming Events' };
        break;
      case 'grid':
        newSection.data = { 
          title: 'Our Features', 
          items: [
            { title: 'Feature 1', description: 'Description 1' },
            { title: 'Feature 2', description: 'Description 2' },
            { title: 'Feature 3', description: 'Description 3' }
          ]
        };
        break;
      case 'cta':
        newSection.data = { title: 'Ready to join?', description: 'Sign up today and get started.', buttonText: 'Click Here', buttonLink: '#' };
        break;
      case 'contact_form':
        newSection.data = { title: 'Contact Us', subtitle: 'Send us a message and we will get back to you.', email: 'admin@organization.com' };
        break;
      case 'image_text':
        newSection.data = { title: 'Section Title', content: 'Type your paragraph here...', image: 'https://placehold.co/800x600/e5e7eb/6b7280?text=Image', imagePosition: 'left' };
        break;
    }
    setSections([...sections, newSection]);
  };

  const updateSection = (index, field, value) => {
    const newSections = [...sections];
    newSections[index].data[field] = value;
    setSections(newSections);
  };

  const updateSectionMeta = (index, field, value) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  const updateGridItem = (sectionIndex, itemIndex, field, value) => {
    const newSections = [...sections];
    newSections[sectionIndex].data.items[itemIndex][field] = value;
    setSections(newSections);
  };

  const removeSection = (index) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
  };

  const moveSection = (index, direction) => {
    if (
      (direction === -1 && index === 0) || 
      (direction === 1 && index === sections.length - 1)
    ) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[index + direction];
    newSections[index + direction] = temp;
    setSections(newSections);
  };

  if (!page) return <div className="p-8 text-center text-gray-500">Loading page builder...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-8">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/admin/pages')} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{page.title}</h2>
            <p className="text-sm text-gray-500">/{page.slug}</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg text-white font-medium transition-all ${
            isSaving ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 shadow-sm'
          }`}
        >
          <Save size={18} />
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
          <div className="max-w-4xl mx-auto space-y-6 pb-32">
            {sections.length === 0 && (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300 shadow-sm">
                <LayoutTemplate className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">This page is empty</h3>
                <p className="text-gray-500 mt-1">Add a block from the sidebar to get started.</p>
              </div>
            )}

            {sections.map((section, index) => (
              <div key={section.id || index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative group">
                <div className="absolute right-0 top-0 h-full w-12 bg-gray-50 border-l border-gray-100 flex flex-col items-center justify-center space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => moveSection(index, -1)} disabled={index === 0} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded disabled:opacity-30"><ArrowUp size={16} /></button>
                  <button onClick={() => removeSection(index)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                  <button onClick={() => moveSection(index, 1)} disabled={index === sections.length - 1} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded disabled:opacity-30"><ArrowDown size={16} /></button>
                </div>

                <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between pr-16">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    {section.type.replace('_', ' ')} Block
                  </span>
                  <div className="flex items-center space-x-2">
                    <label className="text-xs text-gray-500 font-medium">Background:</label>
                    <select 
                      className="text-xs border-gray-300 rounded p-1 focus:ring-indigo-500 focus:border-indigo-500"
                      value={section.background || 'default'}
                      onChange={(e) => updateSectionMeta(index, 'background', e.target.value)}
                    >
                      <option value="default">White</option>
                      <option value="gray">Light Gray</option>
                      <option value="primary">Theme Primary</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                </div>
                
                <div className="p-6 pr-16 space-y-4">
                  {section.type === 'hero' && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Title</label>
                        <input type="text" className="w-full text-2xl font-bold border-0 border-b border-gray-200 focus:ring-0 focus:border-indigo-600 px-0 py-2" value={section.data.title} onChange={e => updateSection(index, 'title', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Subtitle</label>
                        <input type="text" className="w-full text-lg border-0 border-b border-gray-200 focus:ring-0 focus:border-indigo-600 px-0 py-2 text-gray-600" value={section.data.subtitle} onChange={e => updateSection(index, 'subtitle', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Background Image URL</label>
                        <input type="text" className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" value={section.data.image} onChange={e => updateSection(index, 'image', e.target.value)} />
                      </div>
                    </>
                  )}

                  {section.type === 'text' && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Section Title</label>
                        <input type="text" className="w-full text-xl font-bold border-0 border-b border-gray-200 focus:ring-0 focus:border-indigo-600 px-0 py-2" value={section.data.title} onChange={e => updateSection(index, 'title', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Content</label>
                        <textarea rows={5} className="w-full border border-gray-300 rounded p-3 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700" value={section.data.content} onChange={e => updateSection(index, 'content', e.target.value)} />
                      </div>
                    </>
                  )}

                  {section.type === 'image' && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Image URL</label>
                        <input type="text" className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" value={section.data.url} onChange={e => updateSection(index, 'url', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase mb-1 mt-2">Caption (Optional)</label>
                        <input type="text" className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" value={section.data.caption} onChange={e => updateSection(index, 'caption', e.target.value)} />
                      </div>
                    </>
                  )}

                  {(section.type === 'notice_list' || section.type === 'event_list') && (
                    <>
                      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex items-start space-x-3">
                        <div className="text-indigo-500 mt-0.5">
                          {section.type === 'notice_list' ? <List size={20} /> : <Calendar size={20} />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-indigo-900">Dynamic Block</p>
                          <p className="text-xs text-indigo-700 mt-1">This block will automatically fetch and display the latest {section.type === 'notice_list' ? 'notices' : 'events'} on the public website.</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase mb-1 mt-4">Section Title (Optional)</label>
                        <input type="text" className="w-full text-lg font-bold border-0 border-b border-gray-200 focus:ring-0 focus:border-indigo-600 px-0 py-2" value={section.data.title} onChange={e => updateSection(index, 'title', e.target.value)} placeholder="e.g. Recent Announcements" />
                      </div>
                    </>
                  )}

                  {section.type === 'grid' && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Grid Title (Optional)</label>
                        <input type="text" className="w-full text-xl font-bold border-0 border-b border-gray-200 focus:ring-0 focus:border-indigo-600 px-0 py-2" value={section.data.title} onChange={e => updateSection(index, 'title', e.target.value)} />
                      </div>
                      <div className="mt-4 space-y-4">
                        <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Grid Items</label>
                        {section.data.items.map((item, iIndex) => (
                          <div key={iIndex} className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex flex-col space-y-2">
                            <input type="text" className="w-full text-sm font-semibold border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 p-2" value={item.title} onChange={e => updateGridItem(index, iIndex, 'title', e.target.value)} placeholder="Item Title" />
                            <textarea rows={2} className="w-full text-sm border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 p-2" value={item.description} onChange={e => updateGridItem(index, iIndex, 'description', e.target.value)} placeholder="Item Description" />
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {section.type === 'cta' && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase mb-1">CTA Title</label>
                        <input type="text" className="w-full text-xl font-bold border-0 border-b border-gray-200 focus:ring-0 focus:border-indigo-600 px-0 py-2" value={section.data.title} onChange={e => updateSection(index, 'title', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase mb-1 mt-2">Description</label>
                        <input type="text" className="w-full text-md border-0 border-b border-gray-200 focus:ring-0 focus:border-indigo-600 px-0 py-2 text-gray-600" value={section.data.description} onChange={e => updateSection(index, 'description', e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Button Text</label>
                          <input type="text" className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" value={section.data.buttonText} onChange={e => updateSection(index, 'buttonText', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Button Link</label>
                          <input type="text" className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" value={section.data.buttonLink} onChange={e => updateSection(index, 'buttonLink', e.target.value)} />
                        </div>
                      </div>
                    </>
                  )}

                  {section.type === 'contact_form' && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Title</label>
                        <input type="text" className="w-full text-xl font-bold border-0 border-b border-gray-200 focus:ring-0 focus:border-indigo-600 px-0 py-2" value={section.data.title} onChange={e => updateSection(index, 'title', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase mb-1 mt-2">Subtitle</label>
                        <input type="text" className="w-full text-md border-0 border-b border-gray-200 focus:ring-0 focus:border-indigo-600 px-0 py-2 text-gray-600" value={section.data.subtitle} onChange={e => updateSection(index, 'subtitle', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase mb-1 mt-2">Destination Email</label>
                        <input type="email" className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" value={section.data.email} onChange={e => updateSection(index, 'email', e.target.value)} placeholder="Where should messages be sent?" />
                      </div>
                    </>
                  )}

                  {section.type === 'image_text' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Image URL</label>
                          <input type="text" className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" value={section.data.image} onChange={e => updateSection(index, 'image', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Image Position</label>
                          <select className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" value={section.data.imagePosition} onChange={e => updateSection(index, 'imagePosition', e.target.value)}>
                            <option value="left">Image on Left</option>
                            <option value="right">Image on Right</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase mb-1 mt-2">Title</label>
                        <input type="text" className="w-full text-xl font-bold border-0 border-b border-gray-200 focus:ring-0 focus:border-indigo-600 px-0 py-2" value={section.data.title} onChange={e => updateSection(index, 'title', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase mb-1 mt-2">Content</label>
                        <textarea rows={5} className="w-full border border-gray-300 rounded p-3 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700" value={section.data.content} onChange={e => updateSection(index, 'content', e.target.value)} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Blocks Palette */}
        <div className="w-72 bg-white border-l border-gray-200 flex flex-col shadow-lg relative z-10 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
            <h3 className="font-bold text-gray-900 flex items-center space-x-2">
              <Plus size={18} />
              <span>Add Block</span>
            </h3>
          </div>
          <div className="p-4 space-y-3">
            <button onClick={() => addSection('hero')} className="w-full flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-sm transition-all text-left group">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <LayoutTemplate size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Hero Section</h4>
                <p className="text-[10px] text-gray-500">Image with title & subtitle</p>
              </div>
            </button>
            
            <button onClick={() => addSection('text')} className="w-full flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-sm transition-all text-left group">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Type size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Text Block</h4>
                <p className="text-[10px] text-gray-500">Title and paragraph</p>
              </div>
            </button>
            
            <button onClick={() => addSection('image')} className="w-full flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-sm transition-all text-left group">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
                <ImageIcon size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Image Block</h4>
                <p className="text-[10px] text-gray-500">Single image with caption</p>
              </div>
            </button>

            <button onClick={() => addSection('image_text')} className="w-full flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-sm transition-all text-left group">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <LayoutTemplate size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Image + Text</h4>
                <p className="text-[10px] text-gray-500">Split layout (Left/Right)</p>
              </div>
            </button>

            <div className="border-t border-gray-100 pt-3 mt-3">
              <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Dynamic</h5>
              <button onClick={() => addSection('notice_list')} className="w-full flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-sm transition-all text-left group mb-3">
                <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg group-hover:bg-yellow-600 group-hover:text-white transition-colors">
                  <List size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Notice List</h4>
                  <p className="text-[10px] text-gray-500">Auto-fetches published notices</p>
                </div>
              </button>

              <button onClick={() => addSection('event_list')} className="w-full flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-sm transition-all text-left group">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Calendar size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Event List</h4>
                  <p className="text-[10px] text-gray-500">Auto-fetches upcoming events</p>
                </div>
              </button>
            </div>

            <div className="border-t border-gray-100 pt-3 mt-3">
              <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Advanced</h5>
              <button onClick={() => addSection('grid')} className="w-full flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-sm transition-all text-left group mb-3">
                <div className="p-2 bg-pink-50 text-pink-600 rounded-lg group-hover:bg-pink-600 group-hover:text-white transition-colors">
                  <LayoutGrid size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Grid / Cards</h4>
                  <p className="text-[10px] text-gray-500">3-column feature grid</p>
                </div>
              </button>

              <button onClick={() => addSection('cta')} className="w-full flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-sm transition-all text-left group">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <Megaphone size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Call To Action</h4>
                  <p className="text-[10px] text-gray-500">Banner with a button</p>
                </div>
              </button>

              <button onClick={() => addSection('contact_form')} className="w-full flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-sm transition-all text-left group mt-3">
                <div className="p-2 bg-teal-50 text-teal-600 rounded-lg group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Type size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Contact Form</h4>
                  <p className="text-[10px] text-gray-500">Collect user messages</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageBuilder;
