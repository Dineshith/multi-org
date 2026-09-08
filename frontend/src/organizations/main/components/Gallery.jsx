export default function Gallery() {
  return (
    <section className="w-full bg-white pt-14 pb-[4.5rem] px-[clamp(1.25rem,4vw,4rem)]" id="gallery">
      <div className="max-w-[var(--container-max-width)] mx-auto">
        <h2 className="text-[clamp(1.3rem,1.8vw,1.6rem)] font-extrabold text-[var(--color-text-heading)] mb-7 font-[var(--font-primary)]">Gallery</h2>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.15fr_1fr] gap-6 items-stretch">
          {/* Column 1: Two stacked images */}
          <div className="flex flex-col gap-6">
            <div className="rounded-md overflow-hidden shadow-[var(--shadow-gallery)] h-[13.75rem] md:h-[13.75rem] transition-all duration-[var(--transition-fast)] hover:-translate-y-[0.1875rem] hover:shadow-[var(--shadow-gallery-hover)]">
              <img
                src="/images/gallery-classroom.jpg"
                alt="Students collaborating and studying"
                loading="lazy"
                className="w-full h-full object-cover block"
              />
            </div>
            <div className="rounded-md overflow-hidden shadow-[var(--shadow-gallery)] h-[13.75rem] md:h-[13.75rem] transition-all duration-[var(--transition-fast)] hover:-translate-y-[0.1875rem] hover:shadow-[var(--shadow-gallery-hover)]">
              <img
                src="/images/gallery-library.jpg"
                alt="Students in academic hall"
                loading="lazy"
                className="w-full h-full object-cover block"
              />
            </div>
          </div>

          {/* Column 2: One tall portrait image */}
          <div>
            <div className="rounded-md overflow-hidden shadow-[var(--shadow-gallery)] h-[16.25rem] md:h-[calc(13.75rem*2+1.5rem)] transition-all duration-[var(--transition-fast)] hover:-translate-y-[0.1875rem] hover:shadow-[var(--shadow-gallery-hover)]">
              <img
                src="/images/gallery-lab.jpg"
                alt="Classroom learning environment"
                loading="lazy"
                className="w-full h-full object-cover block"
              />
            </div>
          </div>

          {/* Column 3: Two stacked images */}
          <div className="flex flex-col gap-6">
            <div className="rounded-md overflow-hidden shadow-[var(--shadow-gallery)] h-[13.75rem] md:h-[13.75rem] transition-all duration-[var(--transition-fast)] hover:-translate-y-[0.1875rem] hover:shadow-[var(--shadow-gallery-hover)]">
              <img
                src="/images/gallery-student.jpg"
                alt="Student actively participating in class"
                loading="lazy"
                className="w-full h-full object-cover block"
              />
            </div>
            <div className="rounded-md overflow-hidden shadow-[var(--shadow-gallery)] h-[13.75rem] md:h-[13.75rem] transition-all duration-[var(--transition-fast)] hover:-translate-y-[0.1875rem] hover:shadow-[var(--shadow-gallery-hover)]">
              <img
                src="/images/gallery-group.jpg"
                alt="Group of smiling university students"
                loading="lazy"
                className="w-full h-full object-cover block"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
