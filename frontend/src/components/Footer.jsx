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
          <div>
            <h4 className="text-base font-bold text-white mb-0">Location</h4>
          </div>
        </div>
      </footer>
    </div>
  );
}
