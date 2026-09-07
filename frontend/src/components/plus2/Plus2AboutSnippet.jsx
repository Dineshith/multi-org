import { Link } from 'react-router-dom';

export default function Plus2AboutSnippet() {
  return (
    <section className="w-full bg-white py-16 px-[clamp(1.25rem,4vw,4rem)]">
      <div className="max-w-[var(--container-max-width)] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-[var(--color-accent)] font-bold text-[0.85rem] tracking-[0.05em] uppercase mb-3">Who We Are</p>
          <h2 className="text-[clamp(1.8rem,3.5vw,2.5rem)] font-extrabold text-[var(--color-text-heading)] mb-5">
            About <span className="text-[var(--color-accent)]">Akshar</span>
          </h2>
          <p className="text-[var(--color-text-secondary)] text-[0.98rem] leading-[1.8] mb-4">
            It is a matter of great honor for the Akshar family that Vishwa Adarsha college, Itahari, has stepped into the 28 years of the glorious march towards imparting quality education to the students, particularly in the Eastern region of Nepal.
          </p>
          <p className="text-[var(--color-text-secondary)] text-[0.98rem] leading-[1.8] mb-8">
            We proudly acknowledge the participation of the teachers, students, parents, and the general public to make this institution a center for academic excellence in this beautiful town. We feel proud to share our success that we have successfully produced some of the best minds in the country.
          </p>
          <Link
            to="/plus2/about"
            className="inline-block bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white text-[0.9rem] font-bold py-3 px-7 rounded-[var(--radius-sm)] no-underline transition-colors duration-[var(--transition-fast)]"
          >
            Learn More
          </Link>
        </div>
        <div className="rounded-[var(--radius-md)] overflow-hidden shadow-[var(--shadow-image)]">
          <img
            src="/images/gallery-group.jpg"
            alt="Students on the Akshar campus"
            loading="lazy"
            className="w-full h-full object-cover block"
          />
        </div>
      </div>
    </section>
  );
}