import { Link } from 'react-router-dom';

export default function Plus2Intro() {
  return (
    <section className="w-full bg-white py-16 px-[clamp(1.25rem,4vw,4rem)]">
      <div className="max-w-[var(--container-max-width)] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="rounded-[var(--radius-md)] overflow-hidden shadow-[var(--shadow-image)] order-2 lg:order-1">
          <img
            src="/images/hero-building.jpg"
            alt="Akshar +2 campus building and playground"
            loading="lazy"
            className="w-full h-full object-cover block"
          />
        </div>
        <div className="order-1 lg:order-2">
          <span className="block w-14 h-[3px] bg-[var(--color-accent)] mb-4" />
          <h2 className="text-[clamp(1.8rem,3.5vw,2.5rem)] font-extrabold text-[var(--color-text-heading)] mb-5">
            Introducing Akshar
          </h2>
          <p className="text-[var(--color-text-secondary)] text-[0.98rem] leading-[1.8] mb-4">
            Vishwa Adarsha College, established in 2055 B.S. by a group of qualified and dedicated professionals, is one of the leading institutions in the eastern part of Nepal. It has been running it's plus two programs right from its inception. It is an umbrella institution for plus two (Science &amp; Management).
          </p>
          <p className="text-[var(--color-text-secondary)] text-[0.98rem] leading-[1.8] mb-8">
            The college has its own beautiful buildings with a remarkable compound of Ten Katthas. It has basketball, volleyball, and table tennis courts inside its own premises. It has a beautiful garden within a peaceful academic environment.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white text-[0.9rem] font-bold py-3 px-7 rounded-[var(--radius-sm)] no-underline transition-colors duration-[var(--transition-fast)]"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}