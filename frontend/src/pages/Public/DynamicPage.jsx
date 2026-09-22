import React, { useState, useEffect } from 'react';
import { useTenant } from '../../context/TenantContext';
import { getPages, getNotices, getEvents, getAllNotices, getAllEvents } from '../../services/mockDbService';
import { useParams, Link } from 'react-router-dom';
import { LayoutTemplate, ArrowRight, MapPin, Mail, Phone, Users, Info, CheckCircle, Star } from 'lucide-react';

const DynamicPage = () => {
  const { tenant } = useTenant();
  // If no pageSlug is provided (e.g. root /org/:slug), default to 'home'
  let { pageSlug } = useParams();
  if (!pageSlug) pageSlug = 'home';

  const [page, setPage] = useState(null);
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [clientNews, setClientNews] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (tenant) {
      const orgPages = getPages(tenant.id);
      let foundPage = orgPages.find(p => p.slug === pageSlug);

      const reservedSlugs = ['events', 'news', 'notice', 'notices'];

      // Smart Feature: If a page exists but is empty (no sections), OR doesn't exist,
      // try to find a section on the Home page that matches this page's slug/name.
      let injectedSections = null;
      if ((!foundPage || !foundPage.sections || foundPage.sections.length === 0) && pageSlug !== 'home') {
        if (!reservedSlugs.includes(pageSlug)) {
          const homePage = orgPages.find(p => p.slug === 'home');
          if (homePage && homePage.sections) {
            const searchSlug = pageSlug.replace(/-/g, ' ');
            const matchingSections = homePage.sections.filter(s => {
              if (!s.data || !s.data.title) return false;
              const titleLower = s.data.title.toLowerCase();
              return titleLower.includes(searchSlug) || (searchSlug.endsWith('s') && titleLower.includes(searchSlug.slice(0, -1)));
            });

            if (matchingSections.length > 0) {
              injectedSections = matchingSections;
            }
          }
        }
      }

      // Fallback: If STILL no page/sections found, check if it's a dropdown item of a parent page.
      if (!foundPage && !injectedSections) {
        if (!reservedSlugs.includes(pageSlug)) {
          foundPage = orgPages.find(p => {
            const subItems = p.dropdownItems || p.menuGroups || [];
            const subSlugs = subItems.filter(i => i && i.trim() !== '').map(sub => sub.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
            return subSlugs.includes(pageSlug);
          });
        }
      }

      if (injectedSections) {
        setPage({
          id: foundPage ? foundPage.id : `virtual-${pageSlug}`,
          organizationId: tenant.id,
          slug: pageSlug,
          title: foundPage ? foundPage.title : pageSlug,
          sections: injectedSections
        });
      } else {
        setPage(foundPage || null);
      }

      // Fetch Tenant specific notices and events
      let tenantNotices = [];
      let tenantEvents = [];

      if (tenant.id === 0) {
        // Main portal: fetch its own notices + global notices
        tenantNotices = getAllNotices().filter(n => (n.organizationId === 0 && n.published !== false) || n.publishOnMainPortal);
        tenantEvents = getAllEvents().filter(e => e.organizationId === 0 || e.publishOnMainPortal);
      } else {
        // Org portal: fetch its own notices unconditionally
        tenantNotices = getNotices(tenant.id).filter(n => n.published !== false);
        tenantEvents = getEvents(tenant.id);
      }

      // Fetch Super Admin (Platform) specific, if current tenant is not super admin
      let platformNotices = [];
      let platformEvents = [];
      if (tenant.id !== 0) {
        platformNotices = getNotices(0).filter(n => n.published !== false);
        platformEvents = getEvents(0);
      }

      // Combine and sort
      const combinedNotices = [...tenantNotices, ...platformNotices].sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
      const combinedEvents = [...tenantEvents, ...platformEvents].sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));

      setNotices(combinedNotices);
      setEvents(combinedEvents);

      // Fetch News from localStorage for demo purposes
      try {
        const storedNews = JSON.parse(localStorage.getItem('orgNews') || '[]');
        setClientNews(storedNews.filter(n => n.status === 'published' && n.organizationId === tenant.id));
      } catch (e) {
        setClientNews([]);
      }
    }
  }, [tenant, pageSlug]);

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedItem]);

  const getBackgroundColor = (bgType) => {
    switch (bgType) {
      case 'gray': return 'bg-gray-50 text-gray-900';
      case 'dark': return 'bg-gray-900 text-white';
      case 'primary': return 'bg-[var(--theme-primary)] text-white';
      case 'default':
      default: return 'bg-white text-gray-900';
    }
  };

  const getTextColorClass = (color) => {
    switch (color) {
      case 'primary': return 'text-[var(--theme-primary)]';
      case 'red': return 'text-red-600';
      case 'green': return 'text-green-600';
      case 'blue': return 'text-blue-600';
      case 'purple': return 'text-purple-600';
      case 'orange': return 'text-orange-600';
      default: return '';
    }
  };

  const getButtonColorClass = (color, bgClass) => {
    switch (color) {
      case 'primary': return 'bg-[var(--theme-primary)] text-white';
      case 'red': return 'bg-red-600 text-white hover:bg-red-700';
      case 'green': return 'bg-green-600 text-white hover:bg-green-700';
      case 'blue': return 'bg-blue-600 text-white hover:bg-blue-700';
      case 'purple': return 'bg-purple-600 text-white hover:bg-purple-700';
      case 'orange': return 'bg-orange-500 text-white hover:bg-orange-600';
      default:
        return bgClass === 'primary' || bgClass === 'dark'
          ? 'bg-white text-[var(--theme-primary)] hover:bg-gray-50'
          : 'bg-[var(--theme-primary)] text-white hover:opacity-90';
    }
  };

  const renderIcon = (iconName, className) => {
    switch (iconName) {
      case 'MapPin': return <MapPin className={className} />;
      case 'Mail': return <Mail className={className} />;
      case 'Phone': return <Phone className={className} />;
      case 'Users': return <Users className={className} />;
      case 'Info': return <Info className={className} />;
      case 'CheckCircle': return <CheckCircle className={className} />;
      case 'Star': return <Star className={className} />;
      default: return null;
    }
  };

  const renderSection = (section, index) => {
    const bgClass = getBackgroundColor(section.background);

    switch (section.type) {
      case 'hero': {
        const allUpdates = [];
        if (tenant.id === 0) {
          events.forEach(e => allUpdates.push({ ...e, _type: 'event', _date: new Date(e.date || 0) }));
          notices.forEach(n => allUpdates.push({ ...n, _type: 'notice', _date: new Date(n.publishedAt || 0) }));
          allUpdates.sort((a, b) => b._date - a._date);
        }
        const latestUpdate = allUpdates[0];

        return (
          <React.Fragment key={index}>
            <section className={`relative min-h-[70vh] flex items-center ${bgClass}`}>
              {section.data.image && (
                <div className="absolute inset-0 overflow-hidden">
                  <img src={section.data.image} alt="Hero" className="w-full h-full object-cover object-top" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>
                </div>
              )}
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full z-10 text-white">
                <div className={`grid grid-cols-1 ${tenant.id === 0 ? 'lg:grid-cols-12 gap-12' : ''}`}>
                  <div className={`flex flex-col justify-center ${tenant.id === 0 ? 'lg:col-span-7' : ''}`}>
                    {section.data.title && (
                      <div
                        className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-4 ${tenant.id !== 0 ? 'max-w-3xl' : ''} ${section.data.titleColor && section.data.titleColor !== 'default' ? getTextColorClass(section.data.titleColor) : ''}`}
                        dangerouslySetInnerHTML={{ __html: section.data.title }}
                      />
                    )}
                    <div
                      className={`text-xl text-gray-300 ${tenant.id !== 0 ? 'max-w-2xl' : ''}`}
                      dangerouslySetInnerHTML={{ __html: section.data.subtitle }}
                    />
                  </div>

                  {/* Global Updates Section for Main Portal */}
                  {tenant.id === 0 && (
                    <div className="hidden lg:flex flex-col lg:col-span-5 bg-white/20 backdrop-blur-md rounded-2xl border border-white/40 shadow-xl overflow-hidden self-center min-h-[300px]">
                      {/* Header */}
                      <div className="text-center py-4 border-b border-white/40 bg-white/10 shrink-0">
                        <h3 className="text-3xl font-bold text-white tracking-wide">Notice</h3>
                      </div>
                      
                      {/* Single Latest Content Area */}
                      {latestUpdate ? (
                        <div className="p-8 flex flex-col justify-center flex-1 cursor-pointer hover:bg-white/10 transition-colors"
                             onClick={() => setSelectedItem({ type: latestUpdate._type, data: latestUpdate })}>
                          <div className="flex justify-between items-start mb-6">
                            <span className="text-sm font-bold text-white/90 uppercase tracking-widest">{latestUpdate._type}</span>
                            <span className="text-sm text-white/90 font-medium">
                              {latestUpdate._date.toLocaleString('default', { month: 'short' })} {latestUpdate._date.getDate()}
                            </span>
                          </div>
                          <h4 className="text-2xl font-bold text-white mb-4 line-clamp-2 leading-tight">{latestUpdate.title}</h4>
                          <p className="text-base text-white/90 line-clamp-4 leading-relaxed">
                            {latestUpdate._type === 'notice' ? latestUpdate.content : latestUpdate.description}
                          </p>
                        </div>
                      ) : (
                        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center opacity-70">
                          <p className="text-white text-lg font-medium">No recent updates.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Stats Banner Below Hero */}
            {tenant.statsBanner && tenant.statsBanner.length > 0 && (
              <section className="bg-white border-b border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200 text-center">
                    {tenant.statsBanner.map((stat, i) => (
                      <div key={i} className="px-4">
                        <div className="text-4xl font-extrabold text-gray-900 mb-2">{stat.value}</div>
                        <div className="text-sm font-bold text-gray-600 tracking-widest mb-1 uppercase">{stat.label}</div>
                        <div className="text-xs text-gray-500">{stat.subLabel}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </React.Fragment>
        );
      }

      case 'text':
        return (
          <section key={index} className={`py-20 ${bgClass}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              {section.data.title && (
                <div
                  className={`text-3xl font-bold mb-6 text-center ${section.data.titleColor && section.data.titleColor !== 'default' ? getTextColorClass(section.data.titleColor) : ''}`}
                  dangerouslySetInnerHTML={{ __html: section.data.title }}
                />
              )}
              {section.data.subtitle && (
                <div
                  className="mt-2 mb-6 text-lg text-gray-600 max-w-3xl mx-auto text-center"
                  dangerouslySetInnerHTML={{ __html: section.data.subtitle }}
                />
              )}
              <div
                className="text-lg opacity-80 leading-relaxed text-justify whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: section.data.content }}
              />
            </div>
          </section>
        );

      case 'image':
        return (
          <section key={index} className={`py-12 ${bgClass}`}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="rounded-2xl overflow-hidden shadow-sm bg-white border border-gray-100 p-2">
                <img src={section.data.url} alt={section.data.caption || 'Image'} className="w-full h-auto rounded-xl object-contain" style={{ maxHeight: '600px' }} />
              </div>
              {section.data.caption && (
                <p className="text-center opacity-60 mt-4 text-sm font-medium">{section.data.caption}</p>
              )}
            </div>
          </section>
        );

      case 'notice_list':
        if (tenant.id === 0 || notices.length === 0) return null;
        return (
          <section key={index} className={`py-16 ${bgClass}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              {section.data.title && (
                <div
                  className={`text-3xl font-bold mb-8 text-center ${section.data.titleColor && section.data.titleColor !== 'default' ? getTextColorClass(section.data.titleColor) : ''}`}
                  dangerouslySetInnerHTML={{ __html: section.data.title }}
                />
              )}
              <div className="space-y-4">
                {notices.length > 0 ? (
                  notices.map(notice => (
                    <div key={notice.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 cursor-pointer"
                      onClick={() => setSelectedItem({ type: 'notice', data: notice })}>
                      {notice.image && (
                        <div className="w-full md:w-48 h-32 flex-shrink-0">
                          <img src={notice.image} alt={notice.title} className="w-full h-full object-cover rounded-lg border border-gray-100" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{notice.title}</h3>
                          <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">
                            {new Date(notice.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600 whitespace-pre-wrap line-clamp-3 text-justify">{notice.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 opacity-60">No notices available.</div>
                )}
              </div>
            </div>
          </section>
        );

      case 'news_list':
        if (tenant.id === 0 || clientNews.length === 0) return null;
        return (
          <section key={index} className={`py-16 ${bgClass}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              {section.data.title && (
                <div
                  className={`text-3xl font-bold mb-8 text-center ${section.data.titleColor && section.data.titleColor !== 'default' ? getTextColorClass(section.data.titleColor) : ''}`}
                  dangerouslySetInnerHTML={{ __html: section.data.title }}
                />
              )}
              <div className="space-y-4">
                {clientNews.length > 0 ? (
                  clientNews.map(news => (
                    <div key={news.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 cursor-pointer"
                      onClick={() => setSelectedItem({ type: 'news', data: news })}>
                      {news.image && (
                        <div className="w-full md:w-48 h-32 flex-shrink-0">
                          <img src={news.image} alt={news.title} className="w-full h-full object-cover rounded-lg border border-gray-100" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{news.title}</h3>
                          <span className="text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded">
                            {new Date(news.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600 whitespace-pre-wrap line-clamp-3 text-justify">{news.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 opacity-60">No news available.</div>
                )}
              </div>
            </div>
          </section>
        );

      case 'event_list':
        if (tenant.id === 0 || events.length === 0) return null;
        return (
          <section key={index} className={`py-16 ${bgClass}`}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              {section.data.title && (
                <div
                  className={`text-3xl font-bold mb-8 text-center ${section.data.titleColor && section.data.titleColor !== 'default' ? getTextColorClass(section.data.titleColor) : ''}`}
                  dangerouslySetInnerHTML={{ __html: section.data.title }}
                />
              )}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.length > 0 ? (
                  events.map(event => {
                    const eventDate = new Date(event.date);
                    return (
                      <div key={event.id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                        onClick={() => setSelectedItem({ type: 'event', data: event })}>
                        {event.image ? (
                          <div className="relative h-48 w-full overflow-hidden">
                            <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur shadow-lg rounded-xl text-center min-w-[3.5rem] overflow-hidden border border-white/20">
                              <div className="bg-[var(--theme-primary)] text-white text-xs font-bold uppercase py-1 px-2">{eventDate.toLocaleString('default', { month: 'short' })}</div>
                              <div className="text-xl font-black text-gray-900 py-1.5">{eventDate.getDate()}</div>
                            </div>
                          </div>
                        ) : (
                          <div className="p-6 pb-0 flex items-start">
                            <div className="bg-gray-50 shadow-sm rounded-xl text-center min-w-[4rem] overflow-hidden border border-gray-100 mr-4 flex-shrink-0">
                              <div className="bg-[var(--theme-primary)] text-white text-xs font-bold uppercase py-1 px-2">{eventDate.toLocaleString('default', { month: 'short' })}</div>
                              <div className="text-2xl font-black text-gray-900 py-1">{eventDate.getDate()}</div>
                            </div>
                          </div>
                        )}
                        <div className={`p-6 flex-grow ${!event.image ? 'pt-4' : ''}`}>
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[var(--theme-primary)] transition-colors">{event.title}</h3>
                          <p className="text-gray-600 line-clamp-3 leading-relaxed text-justify whitespace-pre-wrap">{event.description}</p>
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
              {(section.data.title || section.data.content) && (
                <div className="text-center mb-12">
                  {section.data.title && (
                    <div
                      className={`text-3xl font-bold ${section.data.titleColor && section.data.titleColor !== 'default' ? getTextColorClass(section.data.titleColor) : 'text-gray-900'} ${section.data.content ? 'mb-4' : ''}`}
                      dangerouslySetInnerHTML={{ __html: section.data.title }}
                    />
                  )}
                  {section.data.content && (
                    <div
                      className="text-lg opacity-80 max-w-3xl mx-auto whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: section.data.content }}
                    />
                  )}
                </div>
              )}
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {section.data.items?.map((item, iIndex) => (
                  <div key={iIndex} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md transition-shadow flex flex-col items-center">
                    {item.icon && item.icon !== 'none' && (
                      <div className={`mb-4 ${item.titleColor && item.titleColor !== 'default' ? getTextColorClass(item.titleColor) : 'text-[var(--theme-primary)]'}`}>
                        {renderIcon(item.icon, "w-10 h-10")}
                      </div>
                    )}
                    <div
                      className={`text-xl font-bold ${item.titleColor && item.titleColor !== 'default' ? getTextColorClass(item.titleColor) : 'text-gray-900'} mb-4`}
                      dangerouslySetInnerHTML={{ __html: item.title }}
                    />
                    <div
                      className="text-gray-600 whitespace-pre-wrap text-center leading-relaxed flex-grow"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'table':
        return (
          <section key={index} className={`py-16 ${bgClass}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {section.data.title && (
                <div
                  className={`text-2xl font-bold mb-8 ${section.data.titleColor && section.data.titleColor !== 'default' ? getTextColorClass(section.data.titleColor) : 'text-gray-900'}`}
                  dangerouslySetInnerHTML={{ __html: section.data.title }}
                />
              )}
              {section.data.subtitle && (
                <div
                  className="mt-2 mb-8 text-lg text-gray-600 text-center"
                  dangerouslySetInnerHTML={{ __html: section.data.subtitle }}
                />
              )}
              <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/50">
                    <tr>
                      {section.data.headers?.map((header, hIndex) => (
                        <th key={hIndex} scope="col" className="px-6 py-4 text-left text-sm font-bold text-gray-900 tracking-wide border-b border-gray-200">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {section.data.rows?.map((row, rIndex) => (
                      <tr key={rIndex} className="hover:bg-gray-50/50 transition-colors">
                        {row.map((cell, cIndex) => (
                          <td key={cIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        );

      case 'cta':
        return (
          <section key={index} className={`py-20 ${bgClass}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              {section.data.title && (
                <div
                  className={`text-3xl md:text-4xl font-bold mb-4 ${section.data.titleColor && section.data.titleColor !== 'default' ? getTextColorClass(section.data.titleColor) : ''}`}
                  dangerouslySetInnerHTML={{ __html: section.data.title }}
                />
              )}
              {section.data.subtitle && (
                <div
                  className="text-xl opacity-90 mb-8 max-w-2xl mx-auto whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: section.data.subtitle }}
                />
              )}
              {section.data.description && (
                <div
                  className="text-xl opacity-90 mb-8 max-w-2xl mx-auto whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: section.data.description }}
                />
              )}
              
              {section.data.fields && section.data.fields.length > 0 && (
                <form className="mt-8 mb-8 text-left max-w-2xl mx-auto" onSubmit={(e) => { e.preventDefault(); alert('Form submitted!'); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {section.data.fields.map((field, fIdx) => (
                      <div key={fIdx} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                        {field.type === 'textarea' ? (
                          <textarea
                            placeholder={field.placeholder || ''}
                            required
                            rows={4}
                            className="w-full bg-gray-200/70 border-0 rounded-lg p-4 text-sm focus:ring-2 focus:ring-[var(--theme-primary)] transition-all outline-none placeholder-gray-500 text-gray-700 resize-y"
                          />
                        ) : (
                          <input
                            type={field.type || 'text'}
                            placeholder={field.placeholder || ''}
                            required
                            className="w-full bg-gray-200/70 border-0 rounded-lg p-4 text-sm focus:ring-2 focus:ring-[var(--theme-primary)] transition-all outline-none placeholder-gray-500 text-gray-700"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    {section.data.buttonText && (
                      <button type="submit" className={`inline-flex items-center space-x-2 px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 ${getButtonColorClass(section.data.buttonColor, section.background)}`}>
                        <span>{section.data.buttonText}</span>
                        <ArrowRight size={20} />
                      </button>
                    )}
                  </div>
                </form>
              )}

              {(!section.data.fields || section.data.fields.length === 0) && section.data.buttonText && (
                <Link to={section.data.buttonLink || '#'} className={`inline-flex items-center space-x-2 px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 ${getButtonColorClass(section.data.buttonColor, section.background)}`}>
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
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

              {section.data.title && (
                <div className="text-center mb-16">
                  <div
                    className={`text-4xl font-bold uppercase tracking-wider ${section.data.titleColor && section.data.titleColor !== 'default' ? getTextColorClass(section.data.titleColor) : 'text-[var(--theme-primary)]'}`}
                    dangerouslySetInnerHTML={{ __html: section.data.title }}
                  />
                  {section.data.subtitle && section.data.subtitle !== '<p><br></p>' && (
                    <div
                      className="mt-4 text-lg opacity-80"
                      dangerouslySetInnerHTML={{ __html: section.data.subtitle }}
                    />
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Left Column: Contact Info & Map */}
                <div className="space-y-8">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wider">Get In Touch</h3>
                    {section.data.contactInfo && (
                      <div
                        className="text-gray-600 space-y-4 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: section.data.contactInfo }}
                      />
                    )}
                  </div>

                  {section.data.mapUrl && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 overflow-hidden h-[300px]">
                      <iframe
                        src={section.data.mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0, borderRadius: '0.5rem' }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  )}
                </div>

                {/* Right Column: Form */}
                <div>
                  <div className={`p-8 rounded-2xl shadow-sm border border-gray-100 ${section.background === 'default' ? 'bg-white' : 'bg-white text-gray-900'}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wider">Send Us A Message</h3>
                    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert(`Message sent to ${section.data.email}!`); }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                          <input type="text" placeholder="Name" required className="w-full bg-gray-200/70 border-0 rounded-lg p-4 text-sm focus:ring-2 focus:ring-[var(--theme-primary)] transition-all outline-none placeholder-gray-400 text-gray-700" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                          <input type="email" placeholder="E-mail" required className="w-full bg-gray-200/70 border-0 rounded-lg p-4 text-sm focus:ring-2 focus:ring-[var(--theme-primary)] transition-all outline-none placeholder-gray-400 text-gray-700" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                          <input type="text" placeholder="Phone Number" className="w-full bg-gray-200/70 border-0 rounded-lg p-4 text-sm focus:ring-2 focus:ring-[var(--theme-primary)] transition-all outline-none placeholder-gray-400 text-gray-700" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                          <input type="text" placeholder="Your Subject" required className="w-full bg-gray-200/70 border-0 rounded-lg p-4 text-sm focus:ring-2 focus:ring-[var(--theme-primary)] transition-all outline-none placeholder-gray-400 text-gray-700" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                        <textarea rows="6" placeholder="Your Message Here" required className="w-full bg-gray-200/70 border-0 rounded-lg p-4 text-sm focus:ring-2 focus:ring-[var(--theme-primary)] transition-all outline-none placeholder-gray-400 text-gray-700"></textarea>
                      </div>
                      <div className="flex justify-start pt-2">
                        <button type="submit" className="bg-[#ff0000] hover:bg-[#cc0000] text-white py-4 px-10 rounded-lg font-bold text-lg transition-all shadow-md">
                          Submit Now
                        </button>
                      </div>
                    </form>
                    <p className="text-xs text-gray-500 mt-6 leading-relaxed">
                      Alternatively, reach out via email directly or visit us during office hours. We look forward to hearing from you!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'image_text': {
        const images = section.data.images || (section.data.image ? [section.data.image] : []);
        const isOddTotal = images.length % 2 !== 0;

        return (
          <section key={index} className={`py-24 ${bgClass}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`flex flex-col md:flex-row gap-12 lg:gap-20 ${section.data.imagePosition === 'right' ? 'md:flex-row-reverse' : ''}`}>

                {/* Images Column */}
                <div className="w-full md:w-1/2">
                  {images.length === 1 ? (
                    <div className="rounded-3xl overflow-hidden shadow-xl ring-1 ring-gray-900/5 group">
                      <img src={images[0]} alt={section.data.title} className="w-full h-auto object-cover max-h-[600px] transform group-hover:scale-105 transition-transform duration-700 ease-out" />
                    </div>
                  ) : images.length > 1 ? (
                    <div className="grid grid-cols-2 gap-4 sm:gap-6">
                      {images.map((img, i) => {
                        const isFeatured = isOddTotal && i === 0;
                        return (
                          <div key={i} className={`rounded-2xl overflow-hidden shadow-md ring-1 ring-gray-900/5 group ${isFeatured ? 'col-span-2' : 'col-span-1'}`}>
                            <img
                              src={img}
                              alt={`${section.data.title} ${i}`}
                              className={`w-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out ${isFeatured ? 'h-64 sm:h-80 md:h-[400px]' : 'h-48 sm:h-56'}`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>

                {/* Text Column with Sticky behavior */}
                <div className="w-full md:w-1/2 relative">
                  <div className="sticky top-32 space-y-8">
                    {section.data.title && (
                      <div className="space-y-4">
                        <div
                          className={`text-3xl md:text-4xl font-bold tracking-tight leading-tight ${section.data.titleColor && section.data.titleColor !== 'default' ? getTextColorClass(section.data.titleColor) : 'text-gray-900'}`}
                          dangerouslySetInnerHTML={{ __html: section.data.title }}
                        />
                      </div>
                    )}
                    {section.data.subtitle && (
                      <div
                        className="mt-2 text-lg text-gray-600 leading-relaxed max-w-prose text-justify whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: section.data.subtitle }}
                      />
                    )}
                    <div
                      className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-prose text-justify whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: section.data.content }}
                    />
                  </div>
                </div>

              </div>
            </div>
          </section>
        );
      }

      case 'map_text': {
        const position = section.data.mapPosition || 'left';
        let layoutClass = 'mx-auto w-full';
        if (position === 'left') {
          layoutClass = 'mr-auto w-full md:w-1/2';
        } else if (position === 'right') {
          layoutClass = 'ml-auto w-full md:w-1/2';
        }

        return (
          <section key={index} className={`py-16 ${bgClass}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className={`${layoutClass} rounded-3xl overflow-hidden shadow-xl ring-1 ring-gray-900/5 h-[400px] md:h-[600px] flex items-center justify-center bg-gray-100`}>
                 {section.data.mapIframe ? (
                    <div 
                      className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full" 
                      dangerouslySetInnerHTML={{ __html: section.data.mapIframe }} 
                    />
                 ) : (
                    <div className="text-gray-400">Map not provided</div>
                 )}
               </div>
            </div>
          </section>
        );
      }

      case 'combined_events_notices':
        if (tenant.id === 0 || (events.length === 0 && notices.length === 0)) return null;
        return (
          <section key={index} className={`py-16 ${bgClass}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

              {/* Header */}
              <div className="text-center mb-12">
                {section.data.subtitle && (
                  <h4 className="text-red-600 font-bold text-sm tracking-wider uppercase mb-2">
                    {section.data.subtitle}
                  </h4>
                )}
                {section.data.title && (
                  <h2 className={`text-3xl md:text-4xl font-extrabold ${section.data.titleColor && section.data.titleColor !== 'default' ? getTextColorClass(section.data.titleColor) : 'text-gray-900'}`} dangerouslySetInnerHTML={{ __html: section.data.title }} />
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Events Column (Left) */}
                <div className="lg:col-span-7 space-y-4">
                  {events.length > 0 ? (
                    events.map(event => {
                      const eventDate = new Date(event.date);
                      const month = eventDate.toLocaleString('default', { month: 'short' });
                      const day = eventDate.getDate();

                      return (
                        <div key={event.id}
                          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center space-x-6 hover:shadow-md transition-all duration-300 cursor-pointer group"
                          onClick={() => setSelectedItem({ type: 'event', data: event })}>
                          {/* Date Box */}
                          <div className="flex-shrink-0 bg-gray-50 rounded-xl text-center min-w-[4rem] overflow-hidden border border-gray-200 shadow-sm group-hover:border-[var(--theme-primary)] transition-colors">
                            <div className="bg-[var(--theme-primary)] text-white text-xs font-bold uppercase py-1.5">{month}</div>
                            <div className="text-2xl font-black text-gray-900 py-1.5">{day}</div>
                          </div>
                          {/* Content */}
                          <div className="flex-1 flex gap-5 items-center">
                            {event.image && (
                              <img src={event.image} alt={event.title} className="w-20 h-20 object-cover rounded-lg shadow-sm border border-gray-100 hidden sm:block" />
                            )}
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-1.5 group-hover:text-[var(--theme-primary)] transition-colors">{event.title}</h3>
                              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed text-justify whitespace-pre-wrap">{event.description}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8 opacity-60 text-gray-500 bg-white rounded-lg border border-gray-100">No upcoming events.</div>
                  )}
                </div>

                {/* Notices Column (Right) */}
                <div className="lg:col-span-5">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-[#cc0000] px-6 py-4">
                      <h3 className="text-white text-xl font-bold">Notice Boards</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {notices.length > 0 ? (
                        notices.map(notice => {
                          const noticeDate = new Date(notice.publishedAt);
                          const dateStr = `${noticeDate.toLocaleString('default', { month: 'short' })}-${noticeDate.getDate()}-${noticeDate.getFullYear()}`;

                          return (
                            <div key={notice.id}
                              className="px-6 py-4 hover:bg-gray-50 transition-colors flex items-center gap-4 cursor-pointer"
                              onClick={() => setSelectedItem({ type: 'notice', data: notice })}>
                              {notice.image && (
                                <img src={notice.image} alt={notice.title} className="w-12 h-12 object-cover rounded flex-shrink-0" />
                              )}
                              <div>
                                <p className="text-xs text-gray-500 mb-1">{dateStr}</p>
                                <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{notice.title}</h4>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <div className="px-6 py-8 text-center opacity-60 text-gray-500">No notices available.</div>
                      )}
                    </div>
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

  const renderModal = () => {
    if (!selectedItem) return null;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60" onClick={() => setSelectedItem(null)}>
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative" onClick={e => e.stopPropagation()}>
          <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
            <h3 className="text-xl font-bold text-gray-900 pr-8">{selectedItem.data.title}</h3>
            <button onClick={() => setSelectedItem(null)} className="text-gray-500 hover:text-gray-900 text-xl font-bold absolute right-6 top-6">
              &times;
            </button>
          </div>
          <div className="p-6">
            {selectedItem.data.image && (
              <img src={selectedItem.data.image} alt="" className="w-full h-auto max-h-96 object-contain rounded-lg mb-6 border border-gray-100" />
            )}
            {selectedItem.type === 'event' && (
              <p className="mb-6 text-sm font-bold text-indigo-600 bg-indigo-50 inline-block px-3 py-1 rounded">
                Date: {new Date(selectedItem.data.date).toLocaleDateString()}
              </p>
            )}
            {selectedItem.type === 'notice' && (
              <p className="mb-6 text-sm font-bold text-gray-600 bg-gray-50 inline-block px-3 py-1 rounded">
                Published: {new Date(selectedItem.data.publishedAt).toLocaleDateString()}
              </p>
            )}
            {selectedItem.type === 'news' && (
              <p className="mb-6 text-sm font-bold text-gray-600 bg-gray-50 inline-block px-3 py-1 rounded">
                Published: {new Date(selectedItem.data.createdAt).toLocaleDateString()}
              </p>
            )}
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">
              {selectedItem.type === 'notice' ? selectedItem.data.content : selectedItem.type === 'news' ? selectedItem.data.content : selectedItem.data.description}
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (!page) {
    if (pageSlug === 'events') {
      return (
        <div className="min-h-screen bg-white pb-20 pt-8">
          {renderSection({ type: 'event_list', data: { title: 'Upcoming Events' }, background: 'default' }, 'standalone-events')}
          {renderModal()}
        </div>
      );
    }
    if (pageSlug === 'notice' || pageSlug === 'notices') {
      return (
        <div className="min-h-screen bg-white pb-20 pt-8">
          {renderSection({ type: 'notice_list', data: { title: 'Notices' }, background: 'default' }, 'standalone-notices')}
          {renderModal()}
        </div>
      );
    }
    if (pageSlug === 'news') {
      return (
        <div className="min-h-screen bg-white pb-20 pt-8">
          {renderSection({ type: 'news_list', data: { title: 'Latest News' }, background: 'default' }, 'standalone-news')}
          {renderModal()}
        </div>
      );
    }

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
    <div className="min-h-screen bg-white relative">
      {page.sections?.length > 0 ? (
        page.sections.map((section, index) => renderSection(section, index))
      ) : (
        <div className="py-20 text-center text-gray-500">
          This page has no content yet.
        </div>
      )}
      {renderModal()}
    </div>
  );
};

export default DynamicPage;
