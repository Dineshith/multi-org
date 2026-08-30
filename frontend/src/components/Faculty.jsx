import { useState } from 'react';
import { Search, Mail, Phone } from 'lucide-react';

// Mock Data for Faculty
const facultyData = [
  {
    id: 1,
    name: "Dr. Ananya Sharma",
    role: "Head of Department",
    department: "Science",
    email: "ananya.s@akshar.edu.np",
    phone: "+977 9841234561",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80",
    bio: "Ph.D. in Physics with 15 years of teaching experience. Leads advanced research in quantum mechanics."
  },
  {
    id: 2,
    name: "Prof. Rajesh Thapa",
    role: "Senior Lecturer",
    department: "Management",
    email: "rajesh.t@akshar.edu.np",
    phone: "+977 9841234562",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=80",
    bio: "Expert in Business Strategy and Marketing. Former consultant for top multinational companies."
  },
  {
    id: 3,
    name: "Mrs. Sunita Shrestha",
    role: "Lecturer",
    department: "Humanities",
    email: "sunita.s@akshar.edu.np",
    phone: "+977 9841234563",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80",
    bio: "Passionate about literature and modern history. Published author of three critically acclaimed books."
  },
  {
    id: 4,
    name: "Er. Bikash Maharjan",
    role: "Assistant Professor",
    department: "Computer Science",
    email: "bikash.m@akshar.edu.np",
    phone: "+977 9841234564",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80",
    bio: "Specializes in Artificial Intelligence and Web Technologies. Mentors the college robotics club."
  },
  {
    id: 5,
    name: "Ms. Puja Karki",
    role: "Lecturer",
    department: "Science",
    email: "puja.k@akshar.edu.np",
    phone: "+977 9841234565",
    image: "https://thumbs.dreamstime.com/b/confident-female-teacher-hands-chin-sitting-desk-portrait-classroom-31236404.jpg",
    bio: "M.Sc. in Chemistry, focuses on organic chemistry research and sustainable lab practices."
  },
  {
    id: 6,
    name: "Dr. Sandip Gurung",
    role: "Head of Department",
    department: "Computer Science",
    email: "sandip.g@akshar.edu.np",
    phone: "+977 9841234566",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80",
    bio: "Leading research in cybersecurity and networks. Has over 20 peer-reviewed journal publications."
  },
  {
    id: 7,
    name: "Ms. Rita Pandey",
    role: "Lecturer",
    department: "Management",
    email: "rita.p@akshar.edu.np",
    phone: "+977 9841234567",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80",
    bio: "Specializes in accounting and finance. Dedicated to helping students build strong financial literacy."
  },
  {
    id: 8,
    name: "Mr. Kiran Joshi",
    role: "Lecturer",
    department: "Humanities",
    email: "kiran.j@akshar.edu.np",
    phone: "+977 9841234568",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
    bio: "Teaches Sociology and Political Science. Organizes community outreach programs."
  }
];

const departments = ["All", "Science", "Management", "Humanities", "Computer Science"];

const Faculty = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  const filteredFaculty = facultyData.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === "All" || member.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <main className="grow bg-[var(--color-surface)] min-h-screen font-sans">
      {/* Header Banner */}
      <section className="relative w-full bg-[var(--color-primary)] text-white pt-[5.5rem] pb-[5rem] px-6 text-center overflow-hidden">
        {/* Decorative blur blobs */}
        <div className="absolute -top-[5rem] -right-[5rem] w-[20rem] h-[20rem] rounded-full bg-white/[0.06] blur-[3.75rem] pointer-events-none" />
        <div className="absolute -bottom-[2.5rem] -left-[3.75rem] w-[15rem] h-[15rem] rounded-full bg-[var(--color-accent)]/[0.12] blur-[3.75rem] pointer-events-none" />

        <div className="relative z-[2] max-w-[50rem] mx-auto">
          <span className="inline-block py-[0.3rem] px-4 rounded-full bg-white/10 border border-white/20 text-[0.78rem] font-bold tracking-[0.09375rem] uppercase text-white/85 mb-5">
            Academic Leadership
          </span>
          <h1 className="text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.15] mb-4 tracking-[-0.03125rem]">
            Meet Our Exceptional Faculty
          </h1>
          <p className="text-[clamp(1rem,1.3vw,1.15rem)] text-white/75 max-w-[40rem] mx-auto leading-[1.7] font-normal">
            Discover the dedicated educators and industry experts committed to
            guiding you towards academic and professional excellence.
          </p>
        </div>
      </section>

      {/* Search & Filter Toolbar */}
      <div className="max-w-[var(--container-max-width-narrow)] mx-auto -mt-8 mb-10 px-[clamp(1rem,3vw,2.5rem)] relative z-10">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 bg-white p-4 rounded-2xl shadow-[var(--shadow-toolbar)] border border-[var(--color-border)]">
          <div className="relative flex-shrink-0 md:flex-[0_1_380px] min-w-0">
            <Search className="absolute left-[0.875rem] top-1/2 -translate-y-1/2 w-[1.125rem] h-[1.125rem] text-[var(--color-text-placeholder)] pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-[0.7rem] pr-4 pl-[2.75rem] border-[0.09375rem] border-[var(--color-border)] rounded-xl text-[0.9rem] font-medium text-[var(--color-text-heading)] bg-[var(--color-surface-alt)] outline-none transition-all duration-[var(--transition-fast)] placeholder:text-[var(--color-text-placeholder)] placeholder:font-normal focus:border-[var(--color-primary)] focus:bg-white focus:shadow-[0_0_0_0.1875rem_rgba(5,16,135,0.08)] font-[inherit]"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto flex-1 no-scrollbar">
            {departments.map(dept => (
              <button
                key={dept}
                className={`py-[0.55rem] px-[1.15rem] rounded-[var(--radius-sm)] border-[0.09375rem] text-[0.85rem] font-semibold whitespace-nowrap transition-all duration-[var(--transition-fast)] cursor-pointer font-[inherit] ${
                  selectedDept === dept
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-[var(--shadow-primary-btn)]'
                    : 'bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-heading)] hover:border-[var(--color-border-hover)]'
                }`}
                onClick={() => setSelectedDept(dept)}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Faculty Grid */}
      <div className="max-w-[var(--container-max-width-narrow)] mx-auto px-[clamp(1rem,3vw,2.5rem)] pb-20">
        {filteredFaculty.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {filteredFaculty.map((member) => (
              <div key={member.id} className="group bg-white rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-[var(--shadow-xs)] hover:-translate-y-[0.375rem] hover:shadow-[var(--shadow-faculty-hover)] transition-all duration-[var(--transition-base)] flex flex-col">
                {/* Image */}
                <div className="w-full h-[16.25rem] max-[820px]:h-[13.75rem] max-[580px]:h-[15rem] relative overflow-hidden bg-[var(--color-surface-muted)]">
                  <img src={member.image} alt={member.name} loading="lazy" className="w-full h-full object-cover object-top block transition-transform duration-[var(--transition-slow)] group-hover:scale-[1.06]" />
                  <span className="absolute top-3 right-3 bg-white/[0.92] backdrop-blur-[0.5rem] text-[var(--color-primary)] text-[0.72rem] font-bold py-[0.3rem] px-3 rounded-lg tracking-[0.01875rem] shadow-[var(--shadow-badge)]">
                    {member.department}
                  </span>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-[1.1rem] font-bold text-[var(--color-text-heading)] mb-1 leading-[1.3] transition-colors duration-[var(--transition-fast)] group-hover:text-[var(--color-primary)]">
                    {member.name}
                  </h3>
                  <p className="text-[0.82rem] font-semibold text-[var(--color-accent)] mb-[0.85rem]">
                    {member.role}
                  </p>
                  <p className="text-[0.85rem] text-[var(--color-text-secondary)] leading-[1.65] flex-1 mb-5 line-clamp-3">
                    {member.bio}
                  </p>

                  {/* Footer */}
                  <div className="flex flex-col pt-4 border-t border-[var(--color-surface-muted)] gap-3">
                    <a href={`mailto:${member.email}`} className="group/email flex items-center gap-2 no-underline text-[var(--color-text-secondary)] text-[0.8rem] font-medium transition-colors duration-[var(--transition-fast)] min-w-0 flex-1 hover:text-[var(--color-primary)]">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-surface-alt)] shrink-0 transition-colors duration-[var(--transition-fast)] group-hover/email:bg-[var(--color-primary-tint-bg)]">
                        <Mail className="w-[0.9375rem] h-[0.9375rem]" />
                      </span>
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">{member.email}</span>
                    </a>
                    <a href={`tel:${member.phone}`} className="group/phone flex items-center gap-2 no-underline text-[var(--color-success)] text-[0.8rem] font-medium transition-colors duration-[var(--transition-fast)] min-w-0 flex-1 hover:text-[var(--color-success-dark)]">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-success-tint)] shrink-0 transition-colors duration-[var(--transition-fast)] group-hover/phone:bg-[var(--color-success-tint-hover)]">
                        <Phone className="w-[0.9375rem] h-[0.9375rem]" />
                      </span>
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">{member.phone}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-8 bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)]">
            <div className="inline-flex items-center justify-center w-[4.5rem] h-[4.5rem] rounded-full bg-[var(--color-surface-muted)] mb-5">
              <Search className="w-8 h-8 text-[var(--color-text-placeholder)]" />
            </div>
            <h3 className="text-[1.35rem] font-bold text-[var(--color-text-heading)] mb-2">No faculty found</h3>
            <p className="text-[var(--color-text-secondary)] text-[0.95rem] max-w-[26.25rem] mx-auto">We couldn't find anyone matching "{searchTerm}" in the {selectedDept} department.</p>
            <button
              className="mt-6 inline-block py-[0.65rem] px-6 bg-[var(--color-primary)] text-white border-none rounded-[var(--radius-sm)] text-[0.9rem] font-semibold cursor-pointer transition-all duration-[var(--transition-fast)] font-[inherit] hover:bg-[var(--color-primary-dark)] hover:-translate-y-px"
              onClick={() => { setSearchTerm(""); setSelectedDept("All"); }}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Hide scrollbar utility */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </main>
  );
};

export default Faculty;
