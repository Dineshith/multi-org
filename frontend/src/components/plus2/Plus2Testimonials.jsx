import { Quote } from 'lucide-react';

const testimonials = [
  { quote: "This is one of the most exciting things I have been involved in since entering the teaching profession. This really is a once in a lifetime opportunity to help our students understand and prepare for the global opportunities that await them after they have finished their education.", name: 'Anmol Dhakal', role: 'Chairman', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80' },
  { quote: "This is one of the most exciting things I have been involved in since entering the teaching profession. This really is a once in a lifetime opportunity to help our students understand and prepare for the global opportunities that await them after they have finished their education.", name: 'Susmita Dangol', role: 'Teacher', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80' },
  { quote: "This is one of the most exciting things I have been involved in since entering the teaching profession. This really is a once in a lifetime opportunity to help our students understand and prepare for the global opportunities that await them after they have finished their education.", name: 'Neek Kafle', role: 'Director', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80' },
];

export default function Plus2Testimonials() {
  return (
    <section className="w-full bg-white py-16 px-[clamp(1.25rem,4vw,4rem)]">
      <div className="max-w-[var(--container-max-width)] mx-auto">
        <div className="text-center max-w-[40rem] mx-auto mb-12">
          <p className="text-[var(--color-accent)] font-bold text-[0.85rem] tracking-[0.05em] uppercase mb-3">What Our Leader's Say</p>
          <h2 className="text-[clamp(1.5rem,2.8vw,2.1rem)] font-extrabold text-[var(--color-text-heading)] leading-[1.4]">
            Here what our respected associated tells about Vishwa Adarsha
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="border-t border-[var(--color-border)] pt-6">
              <Quote className="w-7 h-7 text-[var(--color-accent)] mb-4 fill-[var(--color-accent)]" />
              <p className="text-[var(--color-text-secondary)] text-[0.92rem] leading-[1.8] mb-6">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-[0.9rem] font-bold text-[var(--color-text-heading)]">{t.name}</p>
                  <p className="text-[0.8rem] text-[var(--color-text-secondary)]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}