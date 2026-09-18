import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { getPages, getNotices, getEvents } from '../../services/mockDbService';
import { useParams, Link } from 'react-router-dom';
import { LayoutTemplate, ArrowRight } from 'lucide-react';

const DynamicPage = () => {
  const { tenant } = useTenant();
  // If no pageSlug is provided (e.g. root /org/:slug), default to 'home'
  let { pageSlug } = useParams();
  if (!pageSlug) pageSlug = 'home';
  
  const [page, setPage] = useState(null);
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (tenant) {
      const orgPages = getPages(tenant.id);
      const foundPage = orgPages.find(p => p.slug === pageSlug);
      setPage(foundPage || null);

      // Fetch dynamic data just in case this page uses dynamic blocks
      if (foundPage) {
        setNotices(getNotices(tenant.id).filter(n => n.published).sort((a,b) => new Date(b.publishedAt) - new Date(a.publishedAt)));
        setEvents(getEvents(tenant.id).sort((a,b) => new Date(a.date) - new Date(b.date)));
      }
    }
  }, [tenant, pageSlug]);

  const getBackgroundColor = (bgType) => {
    switch(bgType) {
      case 'gray': return 'bg-gray-50 text-gray-900';
      case 'dark': return 'bg-gray-900 text-white';
      case 'primary': return 'bg-[var(--theme-primary)] text-white';
      case 'default':
      default: return 'bg-white text-gray-900';
    }
  };

  const renderSection = (section, index) => {
    const bgClass = getBackgroundColor(section.background);
    
    switch (section.type) {
      case 'hero':
        return (
          <section key={index} className={`relative min-h-[50vh] flex items-center ${bgClass}`}>
            {section.data.image && (
              <div className="absolute inset-0 overflow-hidden">
                <img src={section.data.image} alt="Hero" className="w-full h-full object-cover opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/60 to-transparent"></div>
              </div>
            )}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full z-10 text-white">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
                {section.data.title}
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl">
                {section.data.subtitle}
              </p>
            </div>
          </section>
        );
      
      case 'text':
        return (
          <section key={index} className={`py-20 ${bgClass}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              {section.data.title && <h2 className="text-3xl font-bold mb-6">{section.data.title}</h2>}
              <p className="text-lg opacity-80 leading-relaxed whitespace-pre-wrap">
                {section.data.content}
              </p>
            </div>
          </section>
        );

      case 'image':
        return (
          <section key={index} className={`py-12 ${bgClass}`}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="rounded-2xl overflow-hidden shadow-sm bg-white border border-gray-100 p-2">
                <img src={section.data.url} alt={section.data.caption || 'Image'} className="w-full h-auto rounded-xl object-contain" style={{maxHeight: '600px'}} />
              </div>
              {section.data.caption && (
                <p className="text-center opacity-60 mt-4 text-sm font-medium">{section.data.caption}</p>
              )}
            </div>
          </section>
        );

      case 'notice_list':
        return (
          <section key={index} className={`py-16 ${bgClass}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              {section.data.title && <h2 className="text-3xl font-bold mb-8 text-center">{section.data.title}</h2>}
              <div className="space-y-4">
                {notices.length > 0 ? (
                  notices.map(notice => (
                    <div key={notice.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{notice.title}</h3>
                        <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">
                          {new Date(notice.publishedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 whitespace-pre-wrap">{notice.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 opacity-60">No notices available.</div>
                )}
              </div>
            </div>
          </section>
        );

      case 'event_list':
        return (
          <section key={index} className={`py-16 ${bgClass}`}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              {section.data.title && <h2 className="text-3xl font-bold mb-8 text-center">{section.data.title}</h2>}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.length > 0 ? (
                  events.map(event => {
                    const eventDate = new Date(event.date);
                    return (
                      <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex items-center justify-between">
                          <span className="font-bold text-indigo-700 text-lg">{eventDate.getDate()}</span>
                          <span className="text-sm font-medium text-indigo-600 uppercase">{eventDate.toLocaleString('default', { month: 'short' })}</span>
                        </div>
                        <div className="p-6 flex-grow">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                          <p className="text-gray-600 line-clamp-3">{event.description}</p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="col-span-full text-center py-8 opacity-60">No upcoming events.</div>
                )}
              </div>
            </div>
          </section>
        );

      case 'grid':
        return (
          <section key={index} className={`py-20 ${bgClass}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {section.data.title && <h2 className="text-3xl font-bold mb-12 text-center">{section.data.title}</h2>}
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {section.data.items?.map((item, iIndex) => (
                  <div key={iIndex} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'cta':
        return (
          <section key={index} className={`py-20 ${bgClass}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{section.data.title}</h2>
              {section.data.description && <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">{section.data.description}</p>}
              {section.data.buttonText && (
                <Link to={section.data.buttonLink || '#'} className={`inline-flex items-center space-x-2 px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 ${
                  section.background === 'primary' || section.background === 'dark' 
                    ? 'bg-white text-[var(--theme-primary)]' 
                    : 'bg-[var(--theme-primary)] text-white'
                }`}>
                  <span>{section.data.buttonText}</span>
                  <ArrowRight size={20} />
                </Link>
              )}
            </div>
          </section>
        );

      case 'contact_form':
        return (
          <section key={index} className={`py-20 ${bgClass}`}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-4">{section.data.title}</h2>
                <p className="text-lg opacity-80">{section.data.subtitle}</p>
              </div>
              <div className={`p-8 rounded-2xl shadow-sm border border-gray-100 ${section.background === 'default' ? 'bg-gray-50' : 'bg-white text-gray-900'}`}>
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert(`Message sent to ${section.data.email}!`); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input type="text" required className="w-full border-gray-300 rounded-lg p-3 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" required className="w-full border-gray-300 rounded-lg p-3 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea rows="4" required className="w-full border-gray-300 rounded-lg p-3 focus:ring-[var(--theme-primary)] focus:border-[var(--theme-primary)]"></textarea>
                  </div>
                  <button type="submit" className="w-full bg-[var(--theme-primary)] text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </section>
        );

      case 'image_text':
        return (
          <section key={index} className={`py-20 ${bgClass}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`flex flex-col md:flex-row items-center gap-12 ${section.data.imagePosition === 'right' ? 'md:flex-row-reverse' : ''}`}>
                <div className="w-full md:w-1/2">
                  <div className="rounded-2xl overflow-hidden shadow-md">
                    <img src={section.data.image} alt={section.data.title} className="w-full h-auto object-cover max-h-[500px]" />
                  </div>
                </div>
                <div className="w-full md:w-1/2 space-y-6">
                  {section.data.title && <h2 className="text-3xl md:text-4xl font-bold leading-tight">{section.data.title}</h2>}
                  <div className="text-lg opacity-80 leading-relaxed whitespace-pre-wrap">
                    {section.data.content}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  if (!page) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <LayoutTemplate className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-6">The page "{pageSlug}" does not exist.</p>
        <Link to={`/org/${tenant?.slug}`} className="px-6 py-2 bg-[var(--theme-primary)] text-white rounded-lg hover:opacity-90 transition-opacity">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {page.sections?.length > 0 ? (
        page.sections.map((section, index) => renderSection(section, index))
      ) : (
        <div className="py-20 text-center text-gray-500">
          This page has no content yet.
        </div>
      )}
    </div>
  );
};

export default DynamicPage;
