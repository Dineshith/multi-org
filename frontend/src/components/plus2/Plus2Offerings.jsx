export default function Plus2Offerings() {
  return (
    <section className="w-full bg-[var(--color-surface-muted)] py-16 px-[clamp(1.25rem,4vw,4rem)]">
      <div className="max-w-[var(--container-max-width)] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
          <div>
            <p className="text-[var(--color-accent)] font-bold text-[0.85rem] tracking-[0.05em] uppercase mb-3">What We Offer</p>
            <h2 className="text-[clamp(1.6rem,3vw,2.3rem)] font-extrabold text-[var(--color-text-heading)] leading-[1.3]">
              The best educational faculty for our students.
            </h2>
          </div>
          <p className="text-[var(--color-text-secondary)] text-[1rem] leading-[1.8] lg:pt-3">
            We got a long experience in teaching science and commerce faculty with over 50,000+ alumni all over the world.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-[var(--radius-md)] p-8 shadow-[var(--shadow-card)]">
            <h3 className="text-[1.3rem] font-extrabold text-[var(--color-text-heading)] mb-3">+2 Science</h3>
            <p className="text-[var(--color-text-secondary)] text-[0.95rem] leading-[1.7]">
              Our +2 science program offers the study of the natural world's behavior and structure through experimentation and observation.
            </p>
          </div>
          <div className="bg-white rounded-[var(--radius-md)] p-8 shadow-[var(--shadow-card)]">
            <h3 className="text-[1.3rem] font-extrabold text-[var(--color-text-heading)] mb-3">+2 Management</h3>
            <p className="text-[var(--color-text-secondary)] text-[0.95rem] leading-[1.7]">
              Our +2 management program offers the study of organizational activities, processes, principles and different types of managerial role.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}