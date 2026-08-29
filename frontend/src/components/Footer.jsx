export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white px-6 py-8 flex flex-wrap justify-between gap-6">
      <div>
        <p className="font-bold text-lg">Akshar</p>
        <p className="text-xs text-gray-300">Aaitabare-Itahari, Sunsari</p>
      </div>

      <div className="text-xs">
        <p className="font-semibold mb-1">Faculty</p>
        <p>Science</p>
        <p>IT</p>
        <p>Management</p>
      </div>

      <div className="text-xs">
        <p className="font-semibold mb-1">Contact Us</p>
        <p>Akshar@gmail.com</p>
        <p>9842108899</p>
      </div>

      <div>
        <p className="text-xs font-semibold mb-1">Location</p>
        <iframe
          title="Location map"
          src="https://www.google.com/maps?q=Itahari,Sunsari,Nepal&output=embed"
          width="150"
          height="100"
          style={{ border: 0 }}
          loading="lazy"
        />
      </div>
    </footer>
  );
}