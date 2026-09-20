import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPage, updatePage, getOrganization } from '../../services/mockDbService';
import { Save, ArrowLeft, Plus, Image as ImageIcon, Type, LayoutTemplate, Trash2, ArrowUp, ArrowDown, List, Calendar, LayoutGrid, Megaphone, Eye, Table, MapPin } from 'lucide-react';

const PageBuilder = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [org, setOrg] = useState(null);
  const [sections, setSections] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadedPage = getPage(pageId);
    if (loadedPage) {
      setPage(loadedPage);
      setSections(loadedPage.sections || []);
      setOrg(getOrganization(loadedPage.organizationId));
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
    switch (type) {
      case 'hero':
        newSection.data = { title: 'New Hero Title', subtitle: 'Hero Subtitle', image: 'https://placehold.co/1200x600/374151/ffffff?text=Hero+Image' };
        break;
      case 'text':
        newSection.data = { title: '', content: '' };
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
      case 'combined_events_notices':
        newSection.data = { title: 'Upcoming events & Recent Notices', subtitle: 'Notice Boards' };
        newSection.background = 'gray';
        break;
      case 'cta':
        newSection.data = { title: 'Ready to join?', description: 'Sign up today and get started.', buttonText: 'Click Here', buttonLink: '#', fields: [] };
        break;
      case 'contact_form':
        newSection.data = { 
          title: 'Contact Us', 
          subtitle: '', 
          email: 'admin@organization.com',
          contactInfo: '<p><strong>📍 ADDRESS:</strong><br/>123 Education Lane, City, Country</p><p><strong>📞 PHONE:</strong><br/>+1 234 567 8900</p><p><strong>✉️ EMAIL:</strong><br/>info@school.edu</p><p><strong>🕒 SCHOOL HOURS:</strong><br/>Mon-Fri: 8:00 AM - 4:00 PM</p>',
          mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.8142900902094!2d85.31694677617478!3d27.69213407619131!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19b19295555f%3A0xabfe5f4b310f97de!2sThe%20British%20College%2C%20Kathmandu!5e0!3m2!1sen!2snp!4v1709623862218!5m2!1sen!2snp'
        };
        break;
      case 'image_text':
        newSection.data = { title: '', content: '', images: [''], imagePosition: 'left' };
        break;
      case 'map_text':
        newSection.data = { title: '', content: '', mapIframe: '', mapPosition: 'left' };
        break;
      case 'table':
        newSection.data = {
          title: 'Teachers List',
          headers: ['S.N', 'Teacher Name', "Teacher's Phone", 'Subject'],
          rows: [
            ['1', 'Anmol Dhakal', '9876543213', 'Statistical Methods'],
            ['2', 'Madhab Kumar', '9876543213', 'Market Management'],
          ]
        };
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

  const addGridItem = (sectionIndex) => {
    const newSections = [...sections];
    if (!newSections[sectionIndex].data.items) newSections[sectionIndex].data.items = [];
    newSections[sectionIndex].data.items.push({ title: 'New Feature', description: 'Description' });
    setSections(newSections);
  };

  const removeGridItem = (sectionIndex, itemIndex) => {
    const newSections = [...sections];
    newSections[sectionIndex].data.items.splice(itemIndex, 1);
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
          <button onClick={() => navigate(page.organizationId === 0 ? '/platform-admin/pages' : '/admin/dashboard/pages')} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{page.title}</h2>
            <p className="text-sm text-gray-500">/{page.slug}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              if (org) {
                const url = page.slug === 'home' ? `/org/${org.slug}` : `/org/${org.slug}/${page.slug}`;
                window.open(url, '_blank');
              }
            }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-lg text-indigo-700 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 font-medium transition-all"
            title="Preview on live site"
          >
            <Eye size={18} />
            <span>View Live</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg text-white font-medium transition-all ${isSaving ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 shadow-sm'
              }`}
          >
            <Save size={18} />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Title</label>
                          <input type="text" className="w-full text-2xl font-bold border-0 border-b border-gray-200 focus:ring-0 focus:border-indigo-600 px-0 py-2" value={section.data.title} onChange={e => updateSection(index, 'title', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Title Color</label>
                          <select className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" value={section.data.titleColor || 'default'} onChange={e => updateSection(index, 'titleColor', e.target.value)}>
                            <option value="default">Default</option>
                            <option value="primary">Primary</option>
                            <option value="red">Red</option>
                            <option value="green">Green</option>
                            <option value="blue">Blue</option>
                            <option value="purple">Purple</option>
                            <option value="orange">Orange</option>
                          </select>
                        </div>
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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Section Title</label>
                          <input type="text" className="w-full text-xl font-bold border-0 border-b border-gray-200 focus:ring-0 focus:border-indigo-600 px-0 py-2" value={section.data.title || ''} onChange={e => updateSection(index, 'title', e.target.value)} placeholder="Section Title" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Title Color</label>
                          <select className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" value={section.data.titleColor || 'default'} onChange={e => updateSection(index, 'titleColor', e.target.value)}>
                            <option value="default">Default</option>
                            <option value="primary">Primary</option>
                            <option value="red">Red</option>
                            <option value="green">Green</option>
                            <option value="blue">Blue</option>
                            <option value="purple">Purple</option>
                            <option value="orange">Orange</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Content</label>
                        <textarea rows={5} className="w-full border border-gray-300 rounded p-3 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700" value={section.data.content || ''} onChange={e => updateSection(index, 'content', e.target.value)} placeholder="Type your paragraph here..." />
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

                  {(section.type === 'notice_list' || section.type === 'event_list' || section.type === 'combined_events_notices') && (
                    <>
                      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex items-start space-x-3">
                        <div className="text-indigo-500 mt-0.5">
                          {section.type === 'notice_list' ? <List size={20} /> : section.type === 'event_list' ? <Calendar size={20} /> : <LayoutGrid size={20} />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-indigo-900">Dynamic Block</p>
                          <p className="text-xs text-indigo-700 mt-1">This block will automatically fetch and display {section.type === 'combined_events_notices' ? 'both notices and events' : `the latest ${section.type === 'notice_list' ? 'notices' : 'events'}`} on the public website.</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Section Title (Optional)</label>
                          <input type="text" className="w-full text-lg font-bold border-0 border-b border-gray-200 focus:ring-0 focus:border-indigo-600 px-0 py-2" value={section.data.title || ''} onChange={e => updateSection(index, 'title', e.target.value)} placeholder="e.g. Recent Announcements" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Title Color</label>
                          <select className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" value={section.data.titleColor || 'default'} onChange={e => updateSection(index, 'titleColor', e.target.value)}>
                            <option value="default">Default</option>
                            <option value="primary">Primary</option>
                            <option value="red">Red</option>
                            <option value="green">Green</option>
                            <option value="blue">Blue</option>
                            <option value="purple">Purple</option>
                            <option value="orange">Orange</option>
                          </select>
                        </div>
                      </div>
                      {section.type === 'combined_events_notices' && (
                        <div>
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-1 mt-4">Subtitle (Optional)</label>
                          <input type="text" className="w-full text-md font-medium border-0 border-b border-gray-200 focus:ring-0 focus:border-indigo-600 px-0 py-2" value={section.data.subtitle || ''} onChange={e => updateSection(index, 'subtitle', e.target.value)} placeholder="e.g. Notice Boards" />
                        </div>
                      )}
                    </>
                  )}

                  {section.type === 'grid' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Grid Title (Optional)</label>
                          <input type="text" className="w-full text-xl font-bold border-0 border-b border-gray-200 focus:ring-0 focus:border-indigo-600 px-0 py-2" value={section.data.title} onChange={e => updateSection(index, 'title', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Title Color</label>
                          <select className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" value={section.data.titleColor || 'default'} onChange={e => updateSection(index, 'titleColor', e.target.value)}>
                            <option value="default">Default</option>
                            <option value="primary">Primary</option>
                            <option value="red">Red</option>
                            <option value="green">Green</option>
                            <option value="blue">Blue</option>
                            <option value="purple">Purple</option>
                            <option value="orange">Orange</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Grid Content / Description (Optional)</label>
                        <textarea rows={2} className="w-full border border-gray-300 rounded p-3 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700" value={section.data.content || ''} onChange={e => updateSection(index, 'content', e.target.value)} placeholder="Add a description below the grid title..." />
                      </div>
                      <div className="mt-4 space-y-4">
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-xs font-medium text-gray-700 uppercase">Grid Items</label>
                          <button onClick={() => addGridItem(index)} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                            <Plus size={14} className="mr-1" /> Add Item
                          </button>
                        </div>
                        {section.data.items?.map((item, iIndex) => (
                          <div key={iIndex} className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex flex-col space-y-2 relative group">
                            <div className="flex items-center space-x-2">
                              <input type="text" className="w-full text-sm font-semibold border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 p-2" value={item.title} onChange={e => updateGridItem(index, iIndex, 'title', e.target.value)} placeholder="Item Title" />
                              <select className="w-24 text-xs border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" value={item.titleColor || 'default'} onChange={e => updateGridItem(index, iIndex, 'titleColor', e.target.value)}>
                                <option value="default">Default</option>
                                <option value="primary">Primary</option>
                                <option value="red">Red</option>
                                <option value="green">Green</option>
                                <option value="blue">Blue</option>
                                <option value="purple">Purple</option>
                                <option value="orange">Orange</option>
                              </select>
                              <select className="w-28 text-xs border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" value={item.icon || 'none'} onChange={e => updateGridItem(index, iIndex, 'icon', e.target.value)}>
                                <option value="none">No Icon</option>
                                <option value="MapPin">Map Pin</option>
                                <option value="Mail">Mail</option>
                                <option value="Phone">Phone</option>
                                <option value="Users">Users</option>
                                <option value="Info">Info</option>
                                <option value="CheckCircle">Check</option>
                                <option value="Star">Star</option>
                              </select>
                              <button onClick={() => removeGridItem(index, iIndex)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Remove Item">
                                <Trash2 size={18} />
                              </button>
                            </div>
                            <textarea rows={2} className="w-full text-sm border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 p-2" value={item.description} onChange={e => updateGridItem(index, iIndex, 'description', e.target.value)} placeholder="Item Description" />
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {section.type === 'cta' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-1">CTA Title</label>
                          <input type="text" className="w-full text-xl font-bold border-2 border-gray-900 rounded p-3 focus:ring-indigo-500 focus:border-indigo-500" value={section.data.title} onChange={e => updateSection(index, 'title', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Title Color</label>
                          <select className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" value={section.data.titleColor || 'default'} onChange={e => updateSection(index, 'titleColor', e.target.value)}>
                            <option value="default">Default</option>
                            <option value="primary">Primary</option>
                            <option value="red">Red</option>
                            <option value="green">Green</option>
                            <option value="blue">Blue</option>
                            <option value="purple">Purple</option>
                            <option value="orange">Orange</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase mb-1 mt-2">Description</label>
                        <input type="text" className="w-full text-md border-0 border-b border-gray-200 focus:ring-0 focus:border-indigo-600 px-0 py-2 text-gray-600" value={section.data.description} onChange={e => updateSection(index, 'description', e.target.value)} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Button Text</label>
                          <input type="text" className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" value={section.data.buttonText} onChange={e => updateSection(index, 'buttonText', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Button Link</label>
                          <input type="text" className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" value={section.data.buttonLink} onChange={e => updateSection(index, 'buttonLink', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Button Color</label>
                          <select className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" value={section.data.buttonColor || 'default'} onChange={e => updateSection(index, 'buttonColor', e.target.value)}>
                            <option value="default">Default</option>
                            <option value="primary">Primary</option>
                            <option value="red">Red</option>
                            <option value="green">Green</option>
                            <option value="blue">Blue</option>
                            <option value="purple">Purple</option>
                            <option value="orange">Orange</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="mt-6 space-y-4">
                         <div className="flex justify-between items-center mb-2 border-b pb-2">
                           <label className="block text-xs font-medium text-gray-700 uppercase">Form Fields (Optional)</label>
                           <button onClick={() => {
                             const fields = [...(section.data.fields || [])];
                             fields.push({ placeholder: 'New Field', type: 'text' });
                             updateSection(index, 'fields', fields);
                           }} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center bg-indigo-50 px-2 py-1 rounded">
                             <Plus size={14} className="mr-1" /> Add Field
                           </button>
                         </div>
                         <div className="space-y-3 max-h-60 overflow-y-auto">
                           {section.data.fields?.map((field, fIndex) => (
                             <div key={fIndex} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                               <input type="text" className="flex-1 text-sm border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 p-2" value={field.placeholder || ''} onChange={e => {
                                 const fields = [...section.data.fields];
                                 fields[fIndex].placeholder = e.target.value;
                                 updateSection(index, 'fields', fields);
                               }} placeholder="Placeholder (e.g. Name)" />
                               <select className="w-28 text-sm border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" value={field.type || 'text'} onChange={e => {
                                 const fields = [...section.data.fields];
                                 fields[fIndex].type = e.target.value;
                                 updateSection(index, 'fields', fields);
                               }}>
                                 <option value="text">Text</option>
                                 <option value="email">Email</option>
                                 <option value="number">Number</option>
                                 <option value="textarea">Long Text</option>
                               </select>
                               <button onClick={() => {
                                 const fields = [...section.data.fields];
                                 fields.splice(fIndex, 1);
                                 updateSection(index, 'fields', fields);
                               }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded bg-white border border-gray-200" title="Remove Field">
                                 <Trash2 size={16} />
                               </button>
                             </div>
                           ))}
                         </div>
                      </div>
                    </>
                  )}

                  {section.type === 'contact_form' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Title</label>
                          <div className="bg-white">
                            <ReactQuill theme="snow" modules={quillModules} value={section.data.title} onChange={(val) => updateSection(index, 'title', val)} className="bg-white text-gray-700" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Title Color</label>
                          <select className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" value={section.data.titleColor || 'default'} onChange={e => updateSection(index, 'titleColor', e.target.value)}>
                            <option value="default">Default</option>
                            <option value="primary">Primary</option>
                            <option value="red">Red</option>
                            <option value="green">Green</option>
                            <option value="blue">Blue</option>
                            <option value="purple">Purple</option>
                            <option value="orange">Orange</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase mb-1 mt-2">Subtitle</label>
                        <div className="bg-white mt-1">
                          <ReactQuill theme="snow" modules={quillModules} value={section.data.subtitle} onChange={(val) => updateSection(index, 'subtitle', val)} className="bg-white text-gray-700" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-sm text-gray-700 border-b pb-2">Left Column (Contact Info)</h4>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Contact Information</label>
                            <div className="bg-white mt-1">
                              <ReactQuill theme="snow" modules={quillModules} value={section.data.contactInfo || ''} onChange={(val) => updateSection(index, 'contactInfo', val)} className="bg-white text-gray-700" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 uppercase mb-1 mt-2">Google Maps Embed URL</label>
                            <input type="text" className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" value={section.data.mapUrl || ''} onChange={e => updateSection(index, 'mapUrl', e.target.value)} placeholder="https://www.google.com/maps/embed?..." />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-semibold text-sm text-gray-700 border-b pb-2">Right Column (Form Setup)</h4>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Destination Email</label>
                            <input type="email" className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" value={section.data.email} onChange={e => updateSection(index, 'email', e.target.value)} placeholder="Where should messages be sent?" />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {section.type === 'image_text' && (() => {
                    const images = section.data.images || (section.data.image ? [section.data.image] : ['']);
                    return (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-2">Images</label>
                          {images.map((img, imgIndex) => (
                            <div key={imgIndex} className="flex items-center space-x-2 mb-2">
                              <input 
                                type="text" 
                                className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" 
                                value={img} 
                                onChange={e => {
                                  const newImages = [...images];
                                  newImages[imgIndex] = e.target.value;
                                  updateSection(index, 'images', newImages);
                                }} 
                                placeholder="Image URL"
                              />
                              <button 
                                type="button"
                                className="p-2 text-red-500 hover:bg-red-50 rounded"
                                onClick={() => {
                                  const newImages = [...images];
                                  newImages.splice(imgIndex, 1);
                                  updateSection(index, 'images', newImages);
                                }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                          <button 
                            type="button"
                            onClick={() => {
                              const newImages = [...images, ''];
                              updateSection(index, 'images', newImages);
                            }}
                            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center mt-1"
                          >
                            <Plus size={14} className="mr-1"/> Add Image
                          </button>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Image Position</label>
                          <select className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" value={section.data.imagePosition} onChange={e => updateSection(index, 'imagePosition', e.target.value)}>
                            <option value="left">Images on Left</option>
                            <option value="right">Images on Right</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Title</label>
                          <input type="text" className="w-full text-xl font-bold border-0 border-b border-gray-200 focus:ring-0 focus:border-indigo-600 px-0 py-2" value={section.data.title || ''} onChange={e => updateSection(index, 'title', e.target.value)} placeholder="Section Title" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Title Color</label>
                          <select className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" value={section.data.titleColor || 'default'} onChange={e => updateSection(index, 'titleColor', e.target.value)}>
                            <option value="default">Default</option>
                            <option value="primary">Primary</option>
                            <option value="red">Red</option>
                            <option value="green">Green</option>
                            <option value="blue">Blue</option>
                            <option value="purple">Purple</option>
                            <option value="orange">Orange</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Subtitle (Optional)</label>
                        <input type="text" className="w-full text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-indigo-600 px-0 py-2" value={section.data.subtitle || ''} onChange={e => updateSection(index, 'subtitle', e.target.value)} placeholder="Add a subtitle..." />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase mb-1 mt-4">Content</label>
                        <textarea rows={5} className="w-full border border-gray-300 rounded p-3 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700" value={section.data.content || ''} onChange={e => updateSection(index, 'content', e.target.value)} placeholder="Type your paragraph here..." />
                      </div>
                    </>
                    );
                  })()}

                  {section.type === 'map_text' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 md:col-span-1">
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-2">Map Embed Iframe</label>
                          <textarea 
                            rows={4}
                            className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" 
                            value={section.data.mapIframe || ''} 
                            onChange={e => updateSection(index, 'mapIframe', e.target.value)} 
                            placeholder='Paste Google Maps <iframe src="..."></iframe> code here...'
                          />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Map Position</label>
                          <select className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" value={section.data.mapPosition || 'left'} onChange={e => updateSection(index, 'mapPosition', e.target.value)}>
                            <option value="left">Map on Left</option>
                            <option value="right">Map on Right</option>
                            <option value="center">Map on Center</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {section.type === 'table' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Section Title (Optional)</label>
                          <input type="text" className="w-full text-xl font-bold border-0 border-b border-gray-200 focus:ring-0 focus:border-indigo-600 px-0 py-2" value={section.data.title || ''} onChange={e => updateSection(index, 'title', e.target.value)} placeholder="Table Title" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Title Color</label>
                          <select className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-indigo-500 focus:border-indigo-500" value={section.data.titleColor || 'default'} onChange={e => updateSection(index, 'titleColor', e.target.value)}>
                            <option value="default">Default</option>
                            <option value="primary">Primary</option>
                            <option value="red">Red</option>
                            <option value="green">Green</option>
                            <option value="blue">Blue</option>
                            <option value="purple">Purple</option>
                            <option value="orange">Orange</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="block text-xs font-medium text-gray-700 uppercase mb-1">Subtitle (Optional)</label>
                        <input type="text" className="w-full text-sm border-0 border-b border-gray-200 focus:ring-0 focus:border-indigo-600 px-0 py-2" value={section.data.subtitle || ''} onChange={e => updateSection(index, 'subtitle', e.target.value)} placeholder="Add a subtitle..." />
                      </div>
                      
                      <div className="mt-6 space-y-4">
                         <div className="flex justify-between items-center mb-2">
                           <label className="block text-xs font-medium text-gray-700 uppercase">Table Columns</label>
                           <button onClick={() => {
                             const headers = [...(section.data.headers || [])];
                             headers.push(`Column ${headers.length + 1}`);
                             const rows = (section.data.rows || []).map(r => [...r, '']);
                             updateSection(index, 'headers', headers);
                             updateSection(index, 'rows', rows);
                           }} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                             <Plus size={14} className="mr-1" /> Add Column
                           </button>
                         </div>
                         <div className="flex gap-2 overflow-x-auto pb-2">
                           {section.data.headers?.map((header, hIndex) => (
                             <div key={`header-${hIndex}`} className="flex-shrink-0 flex items-center bg-gray-100 rounded-lg p-1">
                               <input type="text" className="text-sm font-semibold border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 p-2 w-32 bg-white" value={header} onChange={e => {
                                 const headers = [...section.data.headers];
                                 headers[hIndex] = e.target.value;
                                 updateSection(index, 'headers', headers);
                               }} />
                               <button onClick={() => {
                                 const headers = [...section.data.headers];
                                 headers.splice(hIndex, 1);
                                 const rows = [...(section.data.rows || [])].map(r => {
                                   const newRow = [...r];
                                   newRow.splice(hIndex, 1);
                                   return newRow;
                                 });
                                 updateSection(index, 'headers', headers);
                                 updateSection(index, 'rows', rows);
                               }} className="ml-1 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="Remove Column">
                                 <Trash2 size={16} />
                               </button>
                             </div>
                           ))}
                         </div>

                         <div className="flex justify-between items-center mb-2 mt-4">
                           <label className="block text-xs font-medium text-gray-700 uppercase">Table Rows</label>
                           <button onClick={() => {
                             const rows = [...(section.data.rows || [])];
                             const colsCount = (section.data.headers || []).length;
                             rows.push(new Array(colsCount).fill(''));
                             updateSection(index, 'rows', rows);
                           }} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                             <Plus size={14} className="mr-1" /> Add Row
                           </button>
                         </div>
                         <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                           {section.data.rows?.map((row, rIndex) => (
                             <div key={`row-${rIndex}`} className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg border border-gray-200 overflow-x-auto">
                               <span className="text-xs font-medium text-gray-400 w-6 text-center">{rIndex + 1}</span>
                               {row.map((cell, cIndex) => (
                                 <input key={`cell-${rIndex}-${cIndex}`} type="text" className="text-sm border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500 p-2 w-32 flex-shrink-0" value={cell} onChange={e => {
                                   const rows = [...section.data.rows];
                                   const newRow = [...rows[rIndex]];
                                   newRow[cIndex] = e.target.value;
                                   rows[rIndex] = newRow;
                                   updateSection(index, 'rows', rows);
                                 }} placeholder={`Data`} />
                               ))}
                               <button onClick={() => {
                                 const rows = [...section.data.rows];
                                 rows.splice(rIndex, 1);
                                 updateSection(index, 'rows', rows);
                               }} className="p-2 flex-shrink-0 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded bg-white border border-gray-200" title="Remove Row">
                                 <Trash2 size={16} />
                               </button>
                             </div>
                           ))}
                         </div>
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

            <button onClick={() => addSection('image_text')} className="w-full flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-sm transition-all text-left group mt-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <LayoutTemplate size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Image + Text</h4>
                <p className="text-[10px] text-gray-500">Split layout (Left/Right)</p>
              </div>
            </button>

            <button onClick={() => addSection('map_text')} className="w-full flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-sm transition-all text-left group mt-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Map + Text</h4>
                <p className="text-[10px] text-gray-500">Split layout (Left/Right)</p>
              </div>
            </button>

            <div className="border-t border-gray-100 pt-3 mt-3">
              <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Dynamic</h5>
              
              <button onClick={() => addSection('combined_events_notices')} className="w-full flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-sm transition-all text-left group mb-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <LayoutGrid size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Events & Notices</h4>
                  <p className="text-[10px] text-gray-500">Combined layout</p>
                </div>
              </button>

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
                  <p className="text-[10px] text-gray-500">Multi-column feature grid</p>
                </div>
              </button>

              <button onClick={() => addSection('table')} className="w-full flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-sm transition-all text-left group mb-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Table size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Data Table</h4>
                  <p className="text-[10px] text-gray-500">Rows and columns of data</p>
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
