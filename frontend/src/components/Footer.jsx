export default function Footer() {
  return (
    <div className="w-full m-0 ">
      <footer className="w-full bg-[var(--color-primary)] text-white py-12 px-[clamp(1.25rem,4vw,4rem)]" id="contact">
        <div className="max-w-[var(--container-max-width)] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_0.8fr] gap-10 items-start">
          {/* Brand info */}
          <div className="flex items-center gap-5">
            <div className="flex flex-col items-center justify-center text-white">
              <svg
                className="w-[2.125rem] h-[2.125rem] stroke-white fill-none"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              <span className="font-[var(--font-brand)] text-[1.1rem] font-bold text-white -mt-[0.1875rem]">अक्षर</span>
            </div>
            <div className="flex flex-col">
              <h3 className="text-[1.45rem] font-bold text-white leading-[1.2]">Akshar</h3>
              <p className="text-[0.85rem] text-white/80 mt-1">Akshara marg, Butwal</p>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <ul className="list-none flex flex-col gap-3">
              <li><a href="#faculty" className="text-white no-underline text-[0.9rem] font-medium transition-opacity duration-[var(--transition-fast)] hover:opacity-80 hover:underline">Faculty</a></li>
              <li><a href="#notice" className="text-white no-underline text-[0.9rem] font-medium transition-opacity duration-[var(--transition-fast)] hover:opacity-80 hover:underline">Notice</a></li>
              <li><a href="#it" className="text-white no-underline text-[0.9rem] font-medium transition-opacity duration-[var(--transition-fast)] hover:opacity-80 hover:underline">IT Management</a></li>
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div>
            <h4 className="text-base font-bold text-white mb-3">Contact Us</h4>
            <p className="text-[0.9rem] text-white/90 leading-[1.7]">akshar@gmail.com</p>
            <p className="text-[0.9rem] text-white/90 leading-[1.7]">984xxxxxxx</p>
          </div>

          {/* Column 4: Location */}
          <div className="flex flex-col items-center">
            <h4 className="text-base font-bold text-white mb-3 text-center">Location</h4>
            <div className="w-full h-[150px] rounded-xl overflow-hidden border border-white/20 shadow-inner relative mt-2">
              <iframe
                title="Akshar Academy Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3565.6223425417024!2d87.2742654752152!3d26.660571676798227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef6d8b1d73da1d%3A0xd4d57514869ca946!2sLunar%20IT%20Solution%20Pvt.%20Ltd.!5e0!3m2!1sen!2sno!4v1788074468924!5m2!1sen!2sno"
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
