const news = [
  { image: '/images/gallery-student.jpg', date: '24-Jan-2026', title: 'Cyber Connect 4.0' },
  { image: '/images/gallery-group.jpg', date: '27-Jan-2024', title: 'Graduation 2024' },
  { image: '/images/gallery-lab.jpg', date: '24-Jan-2026', title: 'Cyber Vertex' },
  { image: '/images/gallery-classroom.jpg', date: '26-June-2024', title: 'Visiting expo 2024' },
];

export default function Plus2News() {
  return (
    <section className="w-full bg-white py-16 px-[clamp(1.25rem,4vw,4rem)]">
      <div className="max-w-[var(--container-max-width)] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <p className="text-[var(--color-accent)] font-bold text-[0.85rem] tracking-[0.05em] uppercase mb-3">News Updates</p>
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold text-[var(--color-text-heading)] leading-[1.3]">
              Read our latest <span className="text-[var(--color-accent)]">News &amp; Updates.</span>
            </h2>
          </div>
          <button className="shrink-0 bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white text-[0.85rem] font-bold py-3 px-6 rounded-[var(--radius-sm)] border-none cursor-pointer transition-colors duration-[var(--transition-fast)]">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.map((item, i) => (
            <div key={i} className="rounded-[var(--radius-md)] overflow-hidden border border-[var(--color-border)] shadow-[var(--shadow-xs)]">
              <div className="h-[9.5rem] overflow-hidden">
                <img src={item.image} alt={item.title} loading="lazy" className="w-full h-full object-cover block" />
              </div>
              <div className="p-4">
                <p className="text-[0.75rem] text-[var(--color-text-secondary)] mb-1">{item.date}</p>
                <h3 className="text-[1rem] font-bold text-[var(--color-text-heading)]">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}