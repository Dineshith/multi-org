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
    <main className="grow bg-[#f8fafc] min-h-screen font-sans">
      {/* Header Banner */}
      <section className="relative w-full bg-[#051087] text-white pt-[5.5rem] pb-[5rem] px-6 text-center overflow-hidden">
        {/* Decorative blur blobs */}
        <div className="absolute -top-[80px] -right-[80px] w-[320px] h-[320px] rounded-full bg-white/[0.06] blur-[60px] pointer-events-none" />
        <div className="absolute -bottom-[40px] -left-[60px] w-[240px] h-[240px] rounded-full bg-[#d32f2f]/[0.12] blur-[60px] pointer-events-none" />

        <div className="relative z-[2] max-w-[800px] mx-auto">
          <span className="inline-block py-[0.3rem] px-4 rounded-full bg-white/10 border border-white/20 text-[0.78rem] font-bold tracking-[1.5px] uppercase text-white/85 mb-5">
            Academic Leadership
          </span>
          <h1 className="text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.15] mb-4 tracking-[-0.5px]">
            Meet Our Exceptional Faculty
          </h1>
          <p className="text-[clamp(1rem,1.3vw,1.15rem)] text-white/75 max-w-[640px] mx-auto leading-[1.7] font-normal">
            Discover the dedicated educators and industry experts committed to
            guiding you towards academic and professional excellence.
          </p>
        </div>
      </section>

      {/* Search & Filter Toolbar */}
      <div className="max-w-[1280px] mx-auto -mt-8 mb-10 px-[clamp(1rem,3vw,2.5rem)] relative z-10">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 bg-white p-4 rounded-2xl shadow-[0_8px_32px_rgba(5,16,135,0.1),0_2px_8px_rgba(0,0,0,0.04)] border border-[#e5e7eb]">
          <div className="relative flex-shrink-0 md:flex-[0_1_380px] min-w-0">
            <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9ca3af] pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-[0.7rem] pr-4 pl-[2.75rem] border-[1.5px] border-[#e5e7eb] rounded-xl text-[0.9rem] font-medium text-[#111827] bg-[#f9fafb] outline-none transition-all duration-200 placeholder:text-[#9ca3af] placeholder:font-normal focus:border-[#051087] focus:bg-white focus:shadow-[0_0_0_3px_rgba(5,16,135,0.08)] font-[inherit]"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto flex-1 no-scrollbar">
            {departments.map(dept => (
              <button
                key={dept}
                className={`py-[0.55rem] px-[1.15rem] rounded-[10px] border-[1.5px] text-[0.85rem] font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer font-[inherit] ${
                  selectedDept === dept
                    ? 'bg-[#051087] text-white border-[#051087] shadow-[0_4px_12px_rgba(5,16,135,0.25)]'
                    : 'bg-transparent text-[#6b7280] border-[#e5e7eb] hover:bg-[#f3f4f6] hover:text-[#111827] hover:border-[#d1d5db]'
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
      <div className="max-w-[1280px] mx-auto px-[clamp(1rem,3vw,2.5rem)] pb-20">
        {filteredFaculty.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {filteredFaculty.map((member) => (
              <div key={member.id} className="group bg-white rounded-2xl overflow-hidden border border-[#e5e7eb] shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:-translate-y-[6px] hover:shadow-[0_16px_40px_rgba(5,16,135,0.12),0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col">
                {/* Image */}
                <div className="w-full h-[260px] max-[820px]:h-[220px] max-[580px]:h-[240px] relative overflow-hidden bg-[#f3f4f6]">
                  <img src={member.image} alt={member.name} loading="lazy" className="w-full h-full object-cover object-top block transition-transform duration-500 group-hover:scale-[1.06]" />
                  <span className="absolute top-3 right-3 bg-white/[0.92] backdrop-blur-[8px] text-[#051087] text-[0.72rem] font-bold py-[0.3rem] px-3 rounded-lg tracking-[0.3px] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                    {member.department}
                  </span>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-[1.1rem] font-bold text-[#111827] mb-1 leading-[1.3] transition-colors duration-200 group-hover:text-[#051087]">
                    {member.name}
                  </h3>
                  <p className="text-[0.82rem] font-semibold text-[#d32f2f] mb-[0.85rem]">
                    {member.role}
                  </p>
                  <p className="text-[0.85rem] text-[#6b7280] leading-[1.65] flex-1 mb-5 line-clamp-3">
                    {member.bio}
                  </p>

                  {/* Footer */}
                  <div className="flex flex-col pt-4 border-t border-[#f3f4f6] gap-3">
                    <a href={`mailto:${member.email}`} className="group/email flex items-center gap-2 no-underline text-[#6b7280] text-[0.8rem] font-medium transition-colors duration-200 min-w-0 flex-1 hover:text-[#051087]">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#f9fafb] shrink-0 transition-colors duration-200 group-hover/email:bg-[#eef2ff]">
                        <Mail className="w-[15px] h-[15px]" />
                      </span>
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">{member.email}</span>
                    </a>
                    <a href={`tel:${member.phone}`} className="group/phone flex items-center gap-2 no-underline text-[#16a34a] text-[0.8rem] font-medium transition-colors duration-200 min-w-0 flex-1 hover:text-[#15803d]">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#f0fdf4] shrink-0 transition-colors duration-200 group-hover/phone:bg-[#dcfce7]">
                        <Phone className="w-[15px] h-[15px]" />
                      </span>
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">{member.phone}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-8 bg-white rounded-[20px] border border-[#e5e7eb]">
            <div className="inline-flex items-center justify-center w-[72px] h-[72px] rounded-full bg-[#f3f4f6] mb-5">
              <Search className="w-8 h-8 text-[#9ca3af]" />
            </div>
            <h3 className="text-[1.35rem] font-bold text-[#111827] mb-2">No faculty found</h3>
            <p className="text-[#6b7280] text-[0.95rem] max-w-[420px] mx-auto">We couldn't find anyone matching "{searchTerm}" in the {selectedDept} department.</p>
            <button
              className="mt-6 inline-block py-[0.65rem] px-6 bg-[#051087] text-white border-none rounded-[10px] text-[0.9rem] font-semibold cursor-pointer transition-all duration-200 font-[inherit] hover:bg-[#040c6c] hover:-translate-y-px"
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
