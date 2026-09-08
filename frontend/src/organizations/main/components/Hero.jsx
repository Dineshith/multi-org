export default function Hero() {
  return (
    <section className="w-full relative overflow-hidden bg-[var(--color-hero-bg)]" id="home">
      <div className="w-full h-[clamp(21.25rem,46vw,42.5rem)] overflow-hidden relative">
        <img
          src="/images/tuimg.png"
          alt="Akshar Academy main campus building"
          loading="eager"
          className="w-full h-full object-cover object-center block"
        />
        <div className="hero-overlay"></div>
      </div>
    </section>
  );
}
