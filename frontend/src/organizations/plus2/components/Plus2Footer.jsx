import { Link } from 'react-router-dom';

export default function Plus2Footer() {
  return (
    <footer className="w-full bg-[#051087] bg-[var(--color-primary,#051087)] text-white pt-14 pb-8 px-[clamp(1.25rem,4vw,4rem)] border-t border-white/10">
      <div className="max-w-[var(--container-max-width,84.375rem)] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] gap-10">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center justify-center text-white shrink-0 mt-1">
            <svg className="w-9 h-9 stroke-white fill-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            <span className="font-[var(--font-brand)] text-[1.05rem] font-bold -mt-[0.1875rem]">अक्षर</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[1.4rem] font-bold leading-[1.2] text-white">Akshar +2</h3>
              <span className="bg-amber-400 text-[#051087] text-xs font-black px-1.5 py-0.5 rounded">WING</span>
            </div>
            <p className="text-[0.85rem] text-white/80 mt-1">Aaitabare-Itahari, Sunsari</p>
            <p className="text-[0.8rem] text-white/70 mt-2 max-w-xs leading-relaxed">
              Empowering students through quality education, modern labs, and visionary faculty.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-[0.95rem] font-bold mb-3 text-white">Faculty</h4>
            <ul className="list-none flex flex-col gap-2 text-[0.88rem] text-white/85 p-0 m-0">
              <li><span className="hover:text-amber-300 transition-colors cursor-pointer">Science</span></li>
              <li><span className="hover:text-amber-300 transition-colors cursor-pointer">IT & Management</span></li>
              <li><span className="hover:text-amber-300 transition-colors cursor-pointer">Humanities & Law</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[0.95rem] font-bold mb-3 text-white">Contact Us</h4>
            <p className="text-[0.88rem] text-white/85 mb-1.5 flex items-center gap-1.5">
              <span>✉</span> <a href="mailto:plus2@akshar.edu.np" className="text-white/85 hover:text-white no-underline">plus2@akshar.edu.np</a>
            </p>
            <p className="text-[0.88rem] text-white/85 flex items-center gap-1.5">
              <span>📞</span> <a href="tel:9842108899" className="text-white/85 hover:text-white no-underline">9842108899</a>
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-[0.95rem] font-bold mb-3 text-white">Location</h4>
          <div className="w-full h-[7.5rem] rounded-[var(--radius-sm,0.625rem)] overflow-hidden border border-white/20 shadow-md">
            <iframe
              title="Akshar +2 Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3565.6223425417024!2d87.2742654752152!3d26.660571676798227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef6d8b1d73da1d%3A0xd4d57514869ca946!2sLunar%20IT%20Solution%20Pvt.%20Ltd.!5e0!3m2!1sen!2sno!4v1788074468924!5m2!1sen!2sno"
              className="w-full h-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Quick Links */}
      <div className="max-w-[var(--container-max-width,84.375rem)] mx-auto mt-10 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between text-xs text-white/70 gap-3">
        <p className="m-0">© {new Date().getFullYear()} Akshar Higher Secondary School (+2). All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="/plus2" className="hover:text-amber-300 text-white/75 transition-colors no-underline">Home</Link>
          <span>•</span>
          <Link to="/plus2/about" className="hover:text-amber-300 text-white/75 transition-colors no-underline">About Us</Link>
          <span>•</span>
          <Link to="/home" className="hover:text-amber-300 text-white/75 transition-colors no-underline">Main School</Link>
          <span>•</span>
          <Link to="/contact" className="hover:text-amber-300 text-white/75 transition-colors no-underline">Contact</Link>
        </div>
      </div>
    </footer>
  );
}