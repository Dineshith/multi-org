import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  GraduationCap,
  Sparkles,
  Phone,
  Mail,
  ExternalLink,
  BookOpen,
  FlaskConical,
  Briefcase,
  Scale,
  Award,
  Calendar,
  X,
  Menu,
} from 'lucide-react';

const navLinks = [
  { label: 'Home', to: '/plus2' },
  {
    label: 'About us',
    to: '/plus2/about',
    children: [
      { label: 'Our History', to: '/plus2/about', icon: Award, desc: '25+ years of academic legacy' },
      { label: 'Message from Principal', to: '/plus2/about', icon: GraduationCap, desc: 'Vision for the next generation' },
    ],
  },
  {
    label: 'Academic',
    to: '#',
    children: [
      { label: '+2 Science', to: '#', icon: FlaskConical, desc: 'Physics, Chemistry, Biology & CS' },
      { label: '+2 Management', to: '#', icon: Briefcase, desc: 'Accountancy, Economics & Business' },
      { label: '+2 Law & Humanities', to: '#', icon: Scale, desc: 'Jurisprudence & Social Science' },
    ],
  },
  {
    label: 'Resources',
    to: '#',
    children: [
      { label: 'Downloads & Syllabus', to: '#', icon: BookOpen, desc: 'NEB Curriculum & Model Papers' },
      { label: 'Digital Library', to: '#', icon: BookOpen, desc: 'Online e-books & research journals' },
    ],
  },
  {
    label: 'Update',
    to: '#',
    children: [
      { label: 'Notices', to: '#', icon: Calendar, desc: 'Exam schedules & announcements' },
      { label: 'Events & ECA', to: '#', icon: Sparkles, desc: 'Sports, exhibitions & competitions' },
    ],
  },
  { label: 'Contact', to: '/plus2/contact' },
];

export default function Plus2Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  // Scroll listener for the top scroll progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (totalScroll > 0) {
        const currentScroll = (window.scrollY / totalScroll) * 100;
        setScrollProgress(currentScroll);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard accessibility
  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        setOpenDropdown(null);
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  // Check if link is active (checks both direct path and sub-paths)
  const isLinkActive = (link) => {
    if (link.to && link.to !== '#' && location.pathname === link.to) {
      return true;
    }
    if (link.children && link.children.some((child) => child.to !== '#' && child.to === location.pathname)) {
      return true;
    }
    return false;
  };

  return (
    <header className="sticky top-0 w-full z-[1000] shadow-md bg-[#051087] select-none">

      {/* Top Utility Bar */}
      <div className="w-full bg-[#030b5e] border-b border-white/10 text-white text-[0.78rem] py-1.5 px-4 sm:px-8 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-amber-400/15 text-amber-300 px-2.5 py-0.5 rounded-full font-semibold text-[0.72rem] border border-amber-400/30">
              NEB Affiliated
            </span>
            <span className="text-white/80 text-[0.75rem]">
              Admissions Open for Class XI (Science & Management)
            </span>
          </div>

          <div className="flex items-center gap-5">
            <a href="tel:+977014567890" className="flex items-center gap-1 text-white/80 hover:text-white no-underline">
              <Phone className="w-3 h-3 text-red-400" />
              <span>+977 01-4567890</span>
            </a>
            <a href="mailto:plus2@akshar.edu.np" className="flex items-center gap-1 text-white/80 hover:text-white no-underline">
              <Mail className="w-3 h-3 text-red-400" />
              <span>plus2@akshar.edu.np</span>
            </a>
            <div className="h-3 w-px bg-white/20"></div>
            <Link
              to="/home"
              className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 text-amber-300 hover:text-amber-200 px-2.5 py-0.5 rounded font-medium text-[0.72rem] no-underline transition-colors"
            >
              <span>Main School</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Nav Container */}
      <nav className="relative w-full flex items-center justify-between py-2.5 px-4 sm:px-8 max-w-7xl mx-auto min-h-[4.2rem]">

        {/* Brand / Logo */}
        <Link
          to="/plus2"
          className="flex items-center gap-3 text-white no-underline shrink-0 group"
          aria-label="Akshar Plus Two home"
          onClick={() => setMobileOpen(false)}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#02073e] to-[#1422a8] border border-amber-400/40 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6 text-white group-hover:text-amber-300 transition-colors" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-white text-xl font-black tracking-tight">AKSHAR</span>
              <span className="bg-amber-400 text-[#051087] font-black text-xs px-1.5 py-0.5 rounded">
                +2
              </span>
              <span className="font-bold text-amber-200/90 text-sm ml-0.5">अक्षर</span>
            </div>
            <span className="text-white/70 text-[0.65rem] tracking-wider uppercase font-semibold mt-0.5">
              Higher Secondary Wing
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          <ul className="flex items-center gap-1 xl:gap-2 list-none m-0 p-0">
            {navLinks.map((link, i) => {
              const active = isLinkActive(link);
              const hasDropdown = Boolean(link.children);

              return (
                <li
                  key={link.label}
                  className="relative py-2"
                  onMouseEnter={() => hasDropdown && setOpenDropdown(i)}
                  onMouseLeave={() => hasDropdown && setOpenDropdown(null)}
                >
                  {hasDropdown ? (
                    <button
                      type="button"
                      className={`relative flex items-center gap-1 px-3 py-2 rounded-lg text-[0.92rem] font-semibold transition-all border-none bg-transparent cursor-pointer ${active
                        ? 'text-amber-300 font-bold'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                        }`}
                      onClick={() => setOpenDropdown(openDropdown === i ? null : i)}
                      aria-expanded={openDropdown === i}
                      aria-haspopup="true"
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === i ? 'rotate-180 text-amber-300' : 'text-white/70'
                          }`}
                      />

                      {/* Active Scroller / Underline Bar right under active menu item */}
                      {active && (
                        <span className="absolute -bottom-1 left-2 right-2 h-[3px] bg-amber-400 rounded-full shadow-[0_2px_8px_rgba(251,191,36,0.7)]" />
                      )}
                    </button>
                  ) : (
                    <Link
                      to={link.to}
                      className={`relative block px-3 py-2 rounded-lg text-[0.92rem] font-semibold no-underline transition-all ${active
                        ? 'text-amber-300 font-bold'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                        }`}
                    >
                      <span>{link.label}</span>

                      {/* Active Scroller / Underline Bar right under active menu item */}
                      {active && (
                        <span className="absolute -bottom-1 left-2 right-2 h-[3px] bg-amber-400 rounded-full shadow-[0_2px_8px_rgba(251,191,36,0.7)]" />
                      )}
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  {hasDropdown && openDropdown === i && (
                    <div className="absolute top-full left-0 pt-2 z-[1100] w-64 animate-in fade-in duration-150">
                      <div className="bg-white rounded-xl shadow-2xl p-2 border border-slate-200">
                        {link.children.map((child) => {
                          const IconComp = child.icon || BookOpen;
                          const childActive = location.pathname === child.to && child.to !== '#';

                          return (
                            <Link
                              key={child.label}
                              to={child.to}
                              className={`flex items-start gap-2.5 p-2.5 rounded-lg no-underline transition-colors ${childActive
                                ? 'bg-blue-50 text-[#051087] font-bold'
                                : 'text-slate-800 hover:bg-slate-100'
                                }`}
                              onClick={() => setOpenDropdown(null)}
                            >
                              <div className="w-8 h-8 rounded-md bg-blue-50 text-[#051087] flex items-center justify-center shrink-0 mt-0.5">
                                <IconComp className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="block text-[0.88rem] font-semibold leading-tight text-slate-900">
                                  {child.label}
                                </span>
                                {child.desc && (
                                  <span className="block text-[0.72rem] text-slate-500 line-clamp-1 mt-0.5">
                                    {child.desc}
                                  </span>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right Action Button */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href="#apply"
            className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-[0.85rem] font-bold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all no-underline"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Apply Now</span>
          </a>
        </div>

        {/* Mobile Toggle Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href="#apply"
            className="bg-red-600 hover:bg-red-700 text-white text-[0.75rem] font-bold px-3 py-1.5 rounded-md no-underline shadow-sm"
          >
            Apply
          </a>
          <button
            type="button"
            className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border-none cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Real-time Scroll Progress Bar directly under the navbar */}
      <div className="w-full h-[3px] bg-black/20 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-yellow-300 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[1900] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Slide-in Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-72 bg-[#040c6c] text-white z-[2000] lg:hidden flex flex-col shadow-2xl transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#02073e]">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm tracking-wide">AKSHAR +2 MENU</span>
          </div>
          <button
            type="button"
            className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center border-none cursor-pointer"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {navLinks.map((link) => {
            const active = isLinkActive(link);
            return (
              <div key={link.label} className="border-b border-white/5 pb-1">
                <Link
                  to={link.to}
                  className={`block py-2 px-3 rounded-lg text-sm font-semibold no-underline transition-colors ${active ? 'bg-amber-400 text-[#051087] font-bold' : 'text-white/90 hover:bg-white/10'
                    }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>

                {link.children && (
                  <div className="pl-4 py-1 space-y-1">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        to={child.to}
                        className="block py-1 px-2 text-xs text-white/70 hover:text-white no-underline"
                        onClick={() => setMobileOpen(false)}
                      >
                        • {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-4 space-y-2">
            <a
              href="#apply"
              className="block w-full text-center bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg no-underline shadow-md text-sm"
              onClick={() => setMobileOpen(false)}
            >
              Apply for Admissions 2025
            </a>
            <Link
              to="/home"
              className="block w-full text-center bg-white/10 text-white text-xs font-medium py-2 rounded-lg no-underline"
              onClick={() => setMobileOpen(false)}
            >
              ← Return to Main School Website
            </Link>
          </div>
        </div>
      </div>

    </header>
  );
}