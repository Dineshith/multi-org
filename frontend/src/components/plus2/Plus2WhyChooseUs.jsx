const reasons = [
  'Experienced and student-oriented teaching faculties',
  'Quality education with excellent HSEB result',
  'Well-equipped building and ideal classrooms',
  'Peaceful academic environment',
  'Specially designed labs for exploring and experimenting',
  'Well-equipped library with recent publications',
  'Powerpoint presentation educational tours and fieldwork',
  'Diverse scholarship schemes and awards',
  'Audio-visual classes, remedial classes for the needy student',
];

export default function Plus2WhyChooseUs() {
  return (
    <section className="w-full bg-white pb-16 px-[clamp(1.25rem,4vw,4rem)]">
      <div className="max-w-[var(--container-max-width)] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="block w-14 h-[3px] bg-[var(--color-accent)] mb-4" />
          <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold text-[var(--color-text-heading)] mb-6">
            Why choose us
          </h2>
          <ul className="flex flex-col gap-3">
            {reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-3 text-[var(--color-text-secondary)] text-[0.95rem] leading-[1.6]">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shrink-0" />
                {reason}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[var(--radius-md)] overflow-hidden shadow-[var(--shadow-image)]">
          <img
            src="/images/gallery-classroom.jpg"
            alt="Students in a classroom at Akshar +2"
            loading="lazy"
            className="w-full h-full object-cover block"
          />
        </div>
      </div>
    </section>
  );
}