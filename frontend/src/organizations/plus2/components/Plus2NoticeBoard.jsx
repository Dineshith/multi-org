const events = [
  { day: '10', month: 'Jun', title: 'Grade XI Orientation Program', desc: 'A great journey begins with a single step. Get rea...' },
  { day: '29', month: 'May', title: 'Blood Donation Program 2082', desc: 'Blood donation program 2082' },
  { day: '10', month: 'Jun', title: 'Entrance Examination of Science & Management Faculty', desc: 'A great journey begins with a single step. Get rea...' },
];

const notices = [
  { date: 'May-21-2026', title: 'Grade 11 Scholarship Entrance Exam 2083 Exam Bus Routes' },
  { date: 'May-21-2026', title: 'Final call for Grade XII!' },
  { date: 'May-20-2026', title: 'Admission Inquiry open for Grade XI' },
  { date: 'May-20-2026', title: 'Entrance & Scholarship Exam' },
];

export default function Plus2NoticeBoard() {
  return (
    <section className="w-full bg-white py-16 px-[clamp(1.25rem,4vw,4rem)]">
      <div className="max-w-[var(--container-max-width)] mx-auto">
        <div className="text-center mb-10">
          <p className="text-[var(--color-accent)] font-bold text-[0.85rem] tracking-[0.05em] uppercase mb-2">Notice Boards</p>
          <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold text-[var(--color-text-heading)]">
            Upcoming events &amp; Recent Notices
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 items-start">
          <div className="flex flex-col gap-5">
            {events.map((ev, i) => (
              <div
                key={i}
                className={`flex items-center gap-5 rounded-[var(--radius-md)] p-5 ${i === 0 ? 'bg-[var(--color-surface-muted)]' : 'bg-white border border-[var(--color-border)]'}`}
              >
                <div className="shrink-0 w-16 h-16 border-2 border-[var(--color-text-heading)] rounded-[var(--radius-sm)] flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-[var(--color-text-heading)] leading-none">{ev.day}</span>
                  <span className="text-[0.7rem] uppercase text-[var(--color-text-secondary)] mt-1">{ev.month}</span>
                </div>
                <div>
                  <h3 className="text-[1.05rem] font-bold text-[var(--color-text-heading)] mb-1">{ev.title}</h3>
                  <p className="text-[0.9rem] text-[var(--color-text-secondary)]">{ev.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden">
            <div className="bg-[var(--color-accent)] py-3 px-5">
              <h3 className="text-white font-bold text-[1rem]">Notice Boards</h3>
            </div>
            <ul className="list-none m-0 p-0">
              {notices.map((n, i) => (
                <li key={i} className={`py-4 px-5 ${i !== notices.length - 1 ? 'border-b border-[var(--color-border)]' : ''}`}>
                  <p className="text-[0.75rem] text-[var(--color-text-secondary)] mb-1">{n.date}</p>
                  <p className="text-[0.9rem] font-semibold text-[var(--color-text-heading)]">{n.title}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}