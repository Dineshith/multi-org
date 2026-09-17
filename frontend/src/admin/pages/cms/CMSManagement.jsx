import React, { useState, useEffect } from 'react';
import { Globe, School, GraduationCap, LayoutDashboard, ImagePlus, FlaskConical, Users } from 'lucide-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

export default function CMSManagement() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activePortal, setActivePortal] = useState('main');

    const portals = [
        { id: 'main', label: 'Main Portal', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 'school', label: 'School (1-10)', icon: School, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { id: 'plustwo', label: '+2 School', icon: School, color: 'text-orange-600', bg: 'bg-orange-50' },
        { id: 'bachelor', label: 'Bachelor', icon: GraduationCap, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    // Define sidebar sections based on active portal
    const getSidebarSections = (portalId) => {
        if (portalId === 'main') {
            return [
                { path: 'main-hero', label: 'Home - Hero', icon: LayoutDashboard },
                { path: 'main-gallery', label: 'Home - Gallery', icon: ImagePlus },
                { path: 'research-hero', label: 'Research - Hero', icon: FlaskConical },
                { path: 'faculty-leadership', label: 'Faculty - Leadership', icon: Users },
                { path: 'navbar', label: 'Global - Navbar', icon: Globe },
                { path: 'footer', label: 'Global - Footer', icon: Globe },
            ];
        }
        // Placeholder for other portals
        return [
            { path: 'coming-soon', label: 'More sections coming soon...', icon: LayoutDashboard }
        ];
    };

    const sections = getSidebarSections(activePortal);
    const currentPortal = portals.find(p => p.id === activePortal);

    // Sync active portal with URL on initial load if possible, though currently only main is built
    useEffect(() => {
        if (location.pathname.includes('main-') || location.pathname.includes('footer') || location.pathname.includes('research') || location.pathname.includes('faculty')) {
            setActivePortal('main');
        }
    }, [location.pathname]);

    return (
        <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-slate-50/50">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Content Management (CMS)</h1>
                <p className="text-sm text-slate-500 mt-2">Manage pages and static images for different portals from here.</p>
            </div>

            {/* Top Tabs for Portals */}
            <div className="flex flex-wrap gap-3 mb-8 bg-white p-2.5 rounded-2xl shadow-sm border border-slate-200/60 w-fit">
                {portals.map(portal => {
                    const Icon = portal.icon;
                    const isActive = activePortal === portal.id;
                    return (
                        <button
                            key={portal.id}
                            onClick={() => {
                                setActivePortal(portal.id);
                                if (portal.id === 'main') {
                                    navigate('main-hero');
                                } else {
                                    navigate('coming-soon');
                                }
                            }}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${isActive ? `${portal.bg} ${portal.color} shadow-sm ring-1 ring-black/5` : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? '' : 'opacity-70'}`} />
                            {portal.label}
                        </button>
                    )
                })}
            </div>

            <div className="flex gap-8 flex-col lg:flex-row">
                {/* Left Sidebar for Sections */}
                <div className="w-full lg:w-72 shrink-0 bg-white rounded-3xl shadow-sm border border-slate-200/60 p-5 h-fit lg:sticky top-6">
                    <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 px-3">
                        {currentPortal.label} Pages
                    </h3>
                    <div className="flex flex-col gap-1.5">
                        {sections.map(sec => {
                            const Icon = sec.icon;
                            // Check if current URL ends with this path
                            const isActive = location.pathname.endsWith(sec.path);
                            return (
                                <button
                                    key={sec.path}
                                    onClick={() => navigate(sec.path)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${isActive ? `${currentPortal.bg} ${currentPortal.color} font-bold` : 'text-slate-600 hover:bg-slate-50 font-medium'}`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? currentPortal.color : 'text-slate-400'}`} />
                                    {sec.label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Dynamic Content Area (Routed via Outlet) */}
                <div className="flex-1 w-full">
                    {activePortal !== 'main' ? (
                        <div className="p-10 flex flex-col items-center justify-center text-center text-gray-400 min-h-[500px] bg-white rounded-3xl shadow-sm border border-slate-200/60">
                            <Globe className="w-16 h-16 mb-4 opacity-20" />
                            <h3 className="text-xl font-medium text-gray-600">Under Construction</h3>
                            <p className="mt-2 max-w-md">The specific nested folders and files for {currentPortal.label} are currently being built.</p>
                        </div>
                    ) : (
                        <Outlet />
                    )}
                </div>
            </div>
        </div>
    );
}
